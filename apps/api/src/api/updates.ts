import { resolveError } from "@ethern/utils";
import { GENERIC_ERROR_MESSAGE } from "@ethern/utils/consts";
import { sign, verify } from "@ethern/utils/crypto";
import { notNull } from "@ethern/utils/notNull";
import { PromiseQueue } from "@ethern/utils/promiseQueue";
import { getR2UpdateUrl } from "@ethern/utils/server";
import { vValidator as vv } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import { createUpdates } from "~/actions/updates";
import { middlewares } from "~/middlewares";
import { r2 } from "~/r2";
import type { Env } from "~/types";
import {
  generateManifest,
  populatePlatforms,
  type Manifest,
} from "~/utils/expo";
import {
  hashesToPayload,
  secondsLeftBeforeEndOfMonth,
  unzipBlob,
} from "~/utils/helpers";
import { Metadata, UpdateSchema } from "~/validators/updates";
import { Platform } from "~/validators/updates";

export const updates = new Hono<Env>()
  .get("/:projectId", async (c) => {
    const runtimeVersion = c.req.header("expo-runtime-version") ?? 1;
    const platform = c.req.header("expo-platform") ?? "ios";
    const clientId = c.req.header("eas-client-id") ?? crypto.randomUUID();
    const { projectId } = c.req.param();

    if (!platform || !runtimeVersion || !clientId) {
      return c.json({ ok: false, message: "Invalid headers." }, 400);
    }

    const response = await r2.get(
      c.env.R2_DOMAIN,
      `${projectId}/${runtimeVersion}/${platform}/latest`,
    );

    if (!response) {
      return c.json({ ok: false, message: "Update not found." }, 404);
    }

    return response as Response;
  })
  .post(
    "/handshake",
    middlewares.auth,
    middlewares.project,
    vv(
      "json",
      v.object({
        platforms: v.object({
          android: v.optional(Platform),
          ios: v.optional(Platform),
        }),
        force: v.optional(v.boolean()),
      }),
    ),
    async (c) => {
      try {
        const { repository, project } = c.var;
        const { platforms: platformsBare, force } = c.req.valid("json");
        const {
          platforms: { android, ios },
          assetHashes: receivedHashes,
        } = populatePlatforms({
          projectId: project.id,
          platforms: platformsBare,
        });

        if (android == null && ios == null) {
          return c.json({ ok: false, message: "No platforms provided." });
        }

        if (android && ios && android.checksum === ios.checksum) {
          const update = await repository.updates.find(android.checksum);

          if (update && !force) {
            return c.json({
              ok: false,
              message: "Update already exists.",
              code: "UPDATE_ALREADY_EXISTS",
            });
          }
        }

        if (!receivedHashes || !receivedHashes.length || !receivedHashes[0]) {
          return c.json({ ok: false, message: "No hashes received." });
        }

        if (receivedHashes.length > 100) {
          return c.json({ ok: false, message: "Too many hashes." });
        }

        const nonExistantHashes =
          await repository.blobs.findUnusedHashes(receivedHashes);

        console.log({
          nonExistantHashes,
          receivedHashes,
        });

        const payload = [
          hashesToPayload(nonExistantHashes),
          hashesToPayload(receivedHashes),
        ].join("&");

        const { mac: token, timestamp } = await sign(payload, c.env.SECRET_KEY);
        return c.json({
          ok: true,
          upload: nonExistantHashes,
          token,
          timestamp,
        });
      } catch (error) {
        const err = resolveError(error);
        return c.json(
          { ok: false, message: err.message ?? GENERIC_ERROR_MESSAGE },
          { status: 400 },
        );
      }
    },
  )
  .post('/', UpdateSchema, middlewares.auth, middlewares.project, async (c) => {
    const { repository, project } = c.var;
    const {
      zip: newAssetsZip,
      name,
      metadata: metadataString,
    } = c.req.valid("form");

    const metadata = v.parse(Metadata, JSON.parse(metadataString));

    const { token: mac, timestamp, platforms: platformsBare } = metadata;

    const { platforms, assetHashes } = populatePlatforms({
      projectId: project.id,
      platforms: platformsBare,
    });

    const assetsUnzipped = await unzipBlob(newAssetsZip);
    const assetKeys = Object.keys(assetsUnzipped);

    const payload = [
      hashesToPayload(assetKeys),
      hashesToPayload(assetHashes),
    ].join("&");

    const isValid = await verify(payload, mac, c.env.SECRET_KEY, timestamp);

    if (!isValid) {
      return c.json({ ok: false, message: "Authorization failed." }, 401);
    }

    const queue = new PromiseQueue();

    let assetsSize = 0;

    const alreadyUploaded = assetHashes.filter((h) => assetKeys.includes(h));

    await repository.assets.incrementRefCount({ blobHashes: alreadyUploaded });

    try {
      for (const [filename, content] of Object.entries(assetsUnzipped)) {
        const hash = filename;

        await queue.add(
          c.env.R2.put(hash, content, { sha256: filename }).then(() =>
            console.info(`Uploaded ${filename}`),
          ),
        );

        assetsSize += content.byteLength;

        console.info(`Creating asset ${filename} - ${hash}`, assetsSize);

        await repository.assets.create({
          projectId: project.id,
          blobHash: hash,
          size: content.byteLength,
        });
      }
    } catch (err) {
      console.error(err);
      return c.json({ ok: false, message: "Failed to upload assets." });
    }

    console.info("Updating project size", assetsSize);
    await repository.projects.updateSize(project.id, project.size + assetsSize);

    await queue.flush();

    const platformsArr = Object.values(platforms).filter(notNull);

    for (const platformMeta of platformsArr) {
      const { projectId } = project;
      const {
        checksum: updateId,
        name: platform,
        launchAsset,
        runtimeVersion,
        assets,
      } = platformMeta;

      const manifest = generateManifest({
        r2Domain: c.env.R2_DOMAIN,
        updateId,
        projectId,
        platform,
        launchAsset,
        runtimeVersion,
        assets,
      });

      const r2UpdatePath = getR2UpdateUrl({
        projectId,
        runtimeVersion,
        platform,
        updateId,
      });

      const r2LatestPath = getR2UpdateUrl({
        projectId,
        runtimeVersion,
        platform,
        updateId: "latest",
      });

      const manifestStringfied = JSON.stringify(manifest);

      await c.env.R2.put(r2UpdatePath, manifestStringfied);
      await c.env.R2.put(r2LatestPath, manifestStringfied);
    }

    await createUpdates({
      name,
      repository,
      platforms,
      projectId: project.id,
    });

    const unusedHashes = assetHashes.filter((h) => !assetKeys.includes(h));

    if (unusedHashes.length) {
      await repository.assets.incrementRefCount({ blobHashes: unusedHashes });
    }

    return c.json({ ok: true });
  })
  .delete("/:updateId", async (c) => {
    const { R2 } = c.env;
    const { repository } = c.var;
    const { updateId } = c.req.param();

    const update = await repository.updates.find(updateId);

    if (!update) {
      return c.json({ ok: false, message: "Update not found." }, 404);
    }

    const platforms =
      update.platform === "all" ? ["ios", "android"] : [update.platform];

    const assetHashes = new Set<string>();

    for (const platform of platforms) {
      const r2UpdatePath = getR2UpdateUrl({
        projectId: update.project.projectId,
        runtimeVersion: update.runtimeVersion,
        platform,
        updateId,
      });

      const updateManifest = (await R2.get(r2UpdatePath).then((r) =>
        r?.json(),
      )) as Manifest;

      await R2.delete(r2UpdatePath);

      for (const hash of [
        updateManifest.launchAsset,
        ...updateManifest.assets,
      ].map((a) => a.hash)) {
        assetHashes.add(hash);
      }
    }

    await repository.assets.decrementRefCount({
      blobHashes: Array.from(assetHashes),
    });

    await repository.assets.deleteUnused();

    await repository.updates.delete(updateId);

    return c.json({ ok: true });
  })
  .onError((error, c) => {
    const err = resolveError(error);

    return c.json(
      { ok: false, message: err.message ?? GENERIC_ERROR_MESSAGE },
      500,
    );
  });

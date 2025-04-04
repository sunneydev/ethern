import type { Platform } from "@ethern/api/src/validators/updates";
import { resolveError } from "@ethern/utils";
import JSZip from "jszip";
import fs from "node:fs/promises";
import ora from "ora";
import prompts from "prompts";
import { api } from "~/api";
import { config } from "~/config";
import { expo, setupEthernUpdates } from "~/expo";
import {
  expoCommandAsync,
  getMetadata,
  resolveRuntimeVersionAsync,
} from "~/expo/utils";
import pLimit from "~/lib/p-limit";

export async function update(flags?: Record<string, string | boolean>) {
  await setupEthernUpdates("./", {
    nonInteractive: Boolean(flags?.y || flags?.yes),
  });

  if (!flags?.["skip-export"] && !flags?.s) {
    const exportSpinner = ora("Exporting and bundling the app...").start();
    await expoCommandAsync("./", ["export"], { silent: !config.isDev }).catch(
      (err) => {
        exportSpinner.fail(`Export failed: ${err.message}`);
        process.exit(1);
      },
    );
    exportSpinner.succeed("App export and bundle complete");
  }

  const forceUpdate = flags?.force || flags?.f;

  const handshakeSpinner = ora(
    "Establishing server connection for asset synchronization...",
  ).start();

  const updatePath = "./dist";
  const metadata = await getMetadata(updatePath);
  const assetsMap = await expo.createAssetPathHashMap(updatePath, metadata);

  const assets = Object.values(assetsMap).map(
    ({ path: _excluded, ...asset }) => asset,
  );

  const { runtimeVersion: iosRuntimeVersion } =
    await resolveRuntimeVersionAsync("./", "ios");

  let iosLaunchAsset = assets.find((a) => a.launchAsset === "ios");

  const { runtimeVersion: androidRuntimeVersion } =
    await resolveRuntimeVersionAsync("./", "android");

  const androidLaunchAsset = assets.find((a) => a.launchAsset === "android");

  const platforms = {
    ios:
      iosLaunchAsset && iosRuntimeVersion
        ? {
            runtimeVersion: iosRuntimeVersion,
            launchAsset: iosLaunchAsset,
            assets: assets.filter((a) => a.platform === "ios"),
          }
        : undefined,
    android:
      androidRuntimeVersion && androidLaunchAsset
        ? {
            runtimeVersion: androidRuntimeVersion,
            launchAsset: androidLaunchAsset,
            assets: assets.filter((a) => a.platform === "android"),
          }
        : undefined,
  } satisfies {
    ios?: Platform;
    android?: Platform;
  };

  const { data } = await api
    .handshake(platforms, { force: Boolean(forceUpdate) })
    .catch((err) => {
      handshakeSpinner.fail(
        `Server handshake failed: ${resolveError(err).message}`,
      );
      process.exit(1);
    });

  if (!data.ok) {
    handshakeSpinner.fail(`Server handshake unsuccessful: ${data.message}`);
    process.exit(1);
  }

  handshakeSpinner.succeed("Server handshake successful");

  const { upload: uploadable, token, timestamp } = data;

  handshakeSpinner.start("Preparing assets for update");

  const limit = pLimit(10);
  const zip = new JSZip();

  const files = await Promise.all(
    uploadable.map((hash) => {
      return limit(async () => ({
        hash,
        content: await fs.readFile(assetsMap[hash].path),
      }));
    }),
  );

  for (const { hash, content } of files) {
    zip.file(hash, content);
  }

  const blob = await zip.generateAsync({ type: "blob" });

  handshakeSpinner.succeed("Assets prepared");

  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "Enter a name for the update",
    initial: "untitled",
  });

  handshakeSpinner.start(
    `Creating a new update (${name}) with ${uploadable.length} new asset(s)...`,
  );

  const response = await api
    .update({
      zip: blob,
      name,
      token,
      timestamp,
      platforms,
    })
    .catch((err) => {
      handshakeSpinner.fail(`Update failed: ${err.message}`);
      process.exit(1);
    });

  if (!response.data.ok) {
    handshakeSpinner.fail(
      `Update failed: ${response?.data.message ?? "Unknown error"}`,
    );
    process.exit(1);
  }

  handshakeSpinner.succeed("Update created");
}

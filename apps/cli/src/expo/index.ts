import { RequestedPlatform, type Metadata } from "../types/expo";
import { ask, hash } from "../utils";
import {
  configureExpoConfig,
  ensureEASUpdateIsConfiguredNativelyAsync,
  installExpoUpdates,
} from "./actions";
import {
  getCurrentWorkingEnvironment,
  hasDependancy,
  resolveWorkflowPerPlatformAsync,
} from "./utils";
import GitClient from "../tools/git";
import { Log } from "../tools/others";
import { api } from "../api";
import fs from "node:fs/promises";
import { resolveError } from "@ethern/utils";
import mime from "mime";
import p from "node:path";
import ora from "ora";

export async function createAssetPathHashMap(
  buildPath: string,
  metadata: Metadata,
) {
  const assets = [
    ...metadata.fileMetadata.ios.assets.map((a) => ({ ...a, platform: "ios" })),
    ...metadata.fileMetadata.android.assets.map((a) => ({
      ...a,
      platform: "android",
    })),
    {
      path: metadata.fileMetadata.ios.bundle,
      ext: metadata.fileMetadata.ios.bundle.endsWith(".hbc") ? "bundle" : "js",
      launchAsset: "ios",
    },
    {
      path: metadata.fileMetadata.android.bundle,
      ext: metadata.fileMetadata.android.bundle.endsWith(".hbc")
        ? "bundle"
        : "js",
      launchAsset: "android",
    },
  ] as {
    platform?: "ios" | "android";
    path: string;
    ext: string;
    launchAsset?: "ios" | "android";
  }[];

  const hashMap = {} as Record<
    string,
    {
      platform?: "ios" | "android";
      path: string;
      ext: string;
      key: string;
      hash: string;
      type: string;
      launchAsset?: "ios" | "android";
    }
  >;

  for (const { path, ext, launchAsset, platform } of assets) {
    if (!path) {
      Log.warn("Asset path not found. Skipping...");
      continue;
    }

    const filePath = p.join(buildPath, path);

    const content = await fs.readFile(filePath);
    const hashes = hash(content, "sha256");
    const contentType =
      ext === "bundle"
        ? "application/javascript"
        : (mime.getType(ext) ?? "application/octet-stream");

    hashMap[hashes.hex] = {
      path: filePath,
      ext: `.${ext}`,
      hash: hashes.base64,
      key: hashes.hex,
      platform: platform,
      type: contentType,
      launchAsset,
    };
  }

  return hashMap;
}

export async function setupEthernUpdates(
  projectDir: string,
  props?: { platform?: RequestedPlatform; nonInteractive: boolean },
) {
  const { platform, nonInteractive } = {
    platform: props?.platform == null ? RequestedPlatform.All : props.platform,
    nonInteractive: props?.nonInteractive ?? false,
  };

  const { config, packageJson, ...extra } =
    await getCurrentWorkingEnvironment(projectDir);

  if (!hasDependancy(packageJson, "react-native")) {
    Log.error("Ethern Updates setup failed.");
    Log.fail("This project doesn't seem to be a React Native project.");
    Log.withInfo(
      "Please ensure you're in the correct directory or check your project's setup.",
    );
    process.exit(1);
  }

  const setupSpinner = !extra.projectId
    ? ora("Setting up Ethern Updates...").start()
    : null;

  let projectId = extra.projectId
    ? await api.setProjectId(extra.projectId).then((r) => r?.projectId)
    : null;

  if (!projectId) {
    setupSpinner?.clear().stop();

    Log.withInfo(
      "Looks like your project isn't linked to Ethern Updates yet. Let's get it set up!",
    );

    const proceedWithSetup =
      nonInteractive ||
      (await ask(
        "Would you like to initiate Ethern Updates setup for this project?",
      ));

    if (!proceedWithSetup) {
      Log.fail(
        "Setup skipped. Run 'eth' or 'eth setup' when you're ready to proceed.",
      );
      process.exit(0);
    }

    projectId = await api.createProject(config.exp.slug).then(async (r) => {
      if (r.status === 409) {
        const yes =
          nonInteractive ||
          (await ask(
            "A project with this name already exists. Would you like to link to it instead?",
          ));

        if (!yes) {
          Log.fail("Setup cancelled.");
          process.exit(0);
        }
      }

      return r.data?.projectId;
    });

    if (!projectId) {
      Log.fail("Failed to create a new project for Ethern Updates.");
      Log.withInfo(
        "Please try again or contact support if you continue to experience issues.",
      );
      process.exit(1);
    }

    await api.setProjectId(projectId).catch((err) => {
      Log.error(resolveError(err));
      Log.fail("Failed to set project ID");
      process.exit(1);
    });
  }

  const wasInstalled = await installExpoUpdates(packageJson);

  const vcsClient = new GitClient();

  const workflows = await resolveWorkflowPerPlatformAsync(
    projectDir,
    vcsClient,
  );

  const { projectChanged, exp: expWithUpdates } = await configureExpoConfig({
    exp: config.exp,
    platform,
    projectDir,
    projectId,
    workflows,
  });

  if (projectChanged || !wasInstalled) {
    await ensureEASUpdateIsConfiguredNativelyAsync(vcsClient, {
      exp: expWithUpdates,
      projectDir,
      platform,
      workflows,
    });
  }

  if (projectChanged) {
    Log.addNewLineIfNone();
    Log.warn(
      "All builds of your app going forward will be eligible to receive updates published with EAS Update.",
    );
    Log.newLine();
  }

  setupSpinner?.succeed("Ethern Updates setup complete.");

  return { config, packageJson, projectId };
}

export * as expo from "./";

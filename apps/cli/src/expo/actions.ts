import type { ExpoConfig, PackageJSONConfig } from "@expo/config";
import { Platform as EasPlatform, Workflow } from "@expo/eas-build-job";
import c from "chalk";
import {
  logEasUpdatesAutoConfig,
  warnEASUpdatesManualConfig,
} from "~/expo/logs";
import {
  getDefaultRuntimeVersion,
  getEthernUpdateUrl,
  install,
  isRuntimeEqual,
  mergeExpoConfig,
  modifyExpoConfig,
  syncAndroidConfiguration,
  syncIosConfiguration,
} from "~/expo/utils";
import type GitClient from "~/tools/git";
import { Log } from "~/tools/others";
import type { Platform, RequestedPlatform } from "~/types/expo";
import { ask, log } from "~/utils";

export async function installExpoUpdates(packageJson: PackageJSONConfig) {
  const isExpoUpdatedInstalled =
    (packageJson?.dependencies?.["expo-updates"] ||
      packageJson?.devDependencies?.["expo-updates"]) !== undefined;

  if (!isExpoUpdatedInstalled) {
    await ask(
      "expo-updates is not installed. Do you want to install it now?",
      async () => {
        log(c.green("Installing expo-updates..."));
        await install("expo-updates");
      },
    );
  }

  return isExpoUpdatedInstalled;
}

export async function configureExpoConfig({
  exp,
  platform,
  projectDir,
  projectId,
  workflows,
}: {
  exp: ExpoConfig;
  platform: Platform;
  projectDir: string;
  projectId: string;
  workflows: Record<EasPlatform, Workflow>;
}) {
  const modifyConfig: Partial<ExpoConfig> = {};

  const ethernUpdateUrl = getEthernUpdateUrl(projectId);

  if (exp.updates?.url !== ethernUpdateUrl) {
    modifyConfig.updates = { url: ethernUpdateUrl };
    modifyConfig.extra = { ethern: { projectId } };
  }

  let androidRuntimeVersion = exp.android?.runtimeVersion ?? exp.runtimeVersion;
  let iosRuntimeVersion = exp.ios?.runtimeVersion ?? exp.runtimeVersion;

  if (
    (["all", "android"].includes(platform) && !androidRuntimeVersion) ||
    (["all", "ios"].includes(platform) && !iosRuntimeVersion)
  ) {
    androidRuntimeVersion =
      androidRuntimeVersion ??
      getDefaultRuntimeVersion(workflows.android, exp.sdkVersion);
    iosRuntimeVersion =
      iosRuntimeVersion ??
      getDefaultRuntimeVersion(workflows.ios, exp.sdkVersion);

    if (
      platform === "all" &&
      isRuntimeEqual(androidRuntimeVersion, iosRuntimeVersion)
    ) {
      modifyConfig.runtimeVersion = androidRuntimeVersion;
    } else {
      if (["all", "android"].includes(platform)) {
        modifyConfig.runtimeVersion = undefined;
        modifyConfig.android = { runtimeVersion: androidRuntimeVersion };
      }
      if (["all", "ios"].includes(platform)) {
        modifyConfig.runtimeVersion = undefined;
        modifyConfig.ios = { runtimeVersion: iosRuntimeVersion };
      }
    }
  }

  if (Object.keys(modifyConfig).length === 0) {
    return { exp, projectChanged: false };
  }

  const mergedExp = mergeExpoConfig(exp, modifyConfig);
  const result = await modifyExpoConfig(projectDir, mergedExp);

  switch (result.type) {
    case "success":
      logEasUpdatesAutoConfig({ exp, modifyConfig });
      return {
        projectChanged: true,
        exp: result.config?.expo,
      };

    case "warn":
      warnEASUpdatesManualConfig({ modifyConfig, workflows });
      throw new Error(result.message);

    case "fail":
      throw new Error(result.message);

    default:
      throw new Error(
        `Unexpected result type "${result.type}" received when modifying the project config.`,
      );
  }
}

/**
 * Make sure that the current `app.json` configuration for EAS Updates is set natively.
 */
export async function ensureEASUpdateIsConfiguredNativelyAsync(
  vcsClient: GitClient,
  {
    exp,
    projectDir,
    platform,
    workflows,
  }: {
    exp: ExpoConfig;
    projectDir: string;
    platform: RequestedPlatform;
    workflows: Record<EasPlatform, Workflow>;
  },
): Promise<void> {
  if (
    ["all", "android"].includes(platform) &&
    workflows.android === Workflow.GENERIC
  ) {
    await syncAndroidConfiguration(projectDir, exp);
    Log.withTick(`Configured ${c.bold("AndroidManifest.xml")} for EAS Update`);
  }

  if (["all", "ios"].includes(platform) && workflows.ios === Workflow.GENERIC) {
    await syncIosConfiguration(vcsClient, projectDir, exp);
    Log.withTick(`Configured ${c.bold("Expo.plist")} for EAS Update`);
  }
}

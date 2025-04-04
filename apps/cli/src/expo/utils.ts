import { resolveError, nullthrows } from "../../../../packages/utils/utils";
import { config } from "../config";
import GitClient from "../tools/git";
import { learnMore, type Client, link, Log } from "../tools/others";
import type { Metadata } from "../types/expo";
import { readJsonFile, writeJsonFile } from "../utils";
import type { ExpoConfig, PackageJSONConfig } from "@expo/config";
import {
  getConfigFilePaths,
  modifyConfigAsync,
  type AppJSONConfig,
  getConfig,
  getPackageJson,
} from "@expo/config";
import {
  AndroidConfig,
  IOSConfig,
  type AndroidManifest,
  default as ExpoPlugins,
} from "@expo/config-plugins";
import {
  getAppVersion,
  getNativeVersion,
} from "@expo/config-plugins/build/utils/Updates.js";
import type { Android, IOS } from "@expo/config-types";
import { Workflow, Platform } from "@expo/eas-build-job";
import * as Fingerprint from "@expo/fingerprint";
import plist from "@expo/plist";
import { getRuntimeVersionForSDKVersion } from "@expo/sdk-runtime-versions";
import spawnAsync from "@expo/spawn-async";
import chalk from "chalk";
import fs from "fs-extra";
import path from "node:path";
import prompts from "prompts";
import resolveFrom, { silent as silentResolveFrom } from "resolve-from";
import semver from "semver";
import { RequestedPlatform } from "~/types/expo";

export async function getCurrentWorkingEnvironment(projectRoot = "~/") {
  const config = getConfig(projectRoot, { skipSDKVersionRequirement: true });
  const packageJson = getPackageJson(projectRoot);

  return {
    projectId: config?.exp?.extra?.ethern?.projectId as string | undefined,
    config,
    packageJson,
  };
}

export function install(packageName: string) {
  return expoCommandAsync(process.cwd(), ["install", packageName]);
}

export function hasDependancy(
  packageJson: PackageJSONConfig,
  dependancy: string,
) {
  return (
    packageJson.dependencies?.[dependancy] ||
    packageJson.devDependencies?.[dependancy]
  );
}

export function getMetadata(buildPath: string) {
  return readJsonFile<Metadata>(`${buildPath}/metadata.json`);
}

export function getEthernUpdateUrl(projectId: string): string {
  return `${config.API_URL}/updates/${projectId}`;
}

export async function expoCommandAsync(
  projectDir: string,
  args: string[],
  { silent = false }: { silent?: boolean } = {},
): Promise<void> {
  let expoCliPath: string;
  try {
    expoCliPath =
      silentResolveFrom(projectDir, "expo/bin/cli") ??
      resolveFrom(projectDir, "expo/bin/cli.js");
  } catch (err) {
    const error = resolveError(err);
    if (error.code === "MODULE_NOT_FOUND") {
      throw new Error(
        `The \`expo\` package was not found. Follow the installation directions at ${link(
          "https://docs.expo.dev/bare/installing-expo-modules/",
        )}`,
      );
    }
    throw error;
  }

  const spawnPromise = spawnAsync(expoCliPath, args, {
    stdio: ["inherit", "pipe", "pipe"], // inherit stdin so user can install a missing expo-cli from inside this command
  });
  const {
    child: { stdout, stderr },
  } = spawnPromise;
  if (!(stdout && stderr)) {
    throw new Error("Failed to spawn expo-cli");
  }
  if (!silent) {
    stdout.on("data", (data) => {
      for (const line of data.toString().trim().split("\n")) {
        Log.log(`${chalk.gray("[expo-cli]")} ${line}`);
      }
    });
    stderr.on("data", (data) => {
      for (const line of data.toString().trim().split("\n")) {
        Log.warn(`${chalk.gray("[expo-cli]")} ${line}`);
      }
    });
  }
  await spawnPromise;
}

export function isRuntimeEqual(
  runtimeVersionA: NonNullable<ExpoConfig["runtimeVersion"]>,
  runtimeVersionB: NonNullable<ExpoConfig["runtimeVersion"]>,
): boolean {
  if (
    typeof runtimeVersionA === "string" &&
    typeof runtimeVersionB === "string"
  ) {
    return runtimeVersionA === runtimeVersionB;
  }

  if (
    typeof runtimeVersionA === "object" &&
    typeof runtimeVersionB === "object"
  ) {
    return runtimeVersionA.policy === runtimeVersionB.policy;
  }

  return false;
}

export async function resolveWorkflowAsync(
  projectDir: string,
  platform: Platform,
  vcsClient: Client,
): Promise<Workflow> {
  let platformWorkflowMarkers: string[];
  try {
    platformWorkflowMarkers =
      platform === "android"
        ? [
            path.join(projectDir, "android/app/build.gradle"),
            await AndroidConfig.Paths.getAndroidManifestAsync(projectDir),
          ]
        : [IOSConfig.Paths.getPBXProjectPath(projectDir)];
  } catch {
    return Workflow.MANAGED;
  }

  const vcsRootPath = path.normalize(await vcsClient.getRootPathAsync());
  for (const marker of platformWorkflowMarkers) {
    if (
      (await fs.pathExists(marker)) &&
      !(await vcsClient.isFileIgnoredAsync(path.relative(vcsRootPath, marker)))
    ) {
      return Workflow.GENERIC;
    }
  }
  return Workflow.MANAGED;
}

export async function resolveWorkflowPerPlatformAsync(
  projectDir: string,
  vcsClient: GitClient,
): Promise<Record<Platform, Workflow>> {
  const [android, ios] = await Promise.all([
    resolveWorkflowAsync(projectDir, Platform.ANDROID, vcsClient),
    resolveWorkflowAsync(projectDir, Platform.IOS, vcsClient),
  ]);
  return { android, ios };
}

export const DEFAULT_MANAGED_RUNTIME_VERSION_GTE_SDK_49 = {
  policy: "appVersion",
} as const;

export const DEFAULT_MANAGED_RUNTIME_VERSION_LTE_SDK_48 = {
  policy: "sdkVersion",
} as const;

export const DEFAULT_BARE_RUNTIME_VERSION = "1.0.0" as const;

export function getDefaultRuntimeVersion(
  workflow: Workflow,
  sdkVersion: string | undefined,
): NonNullable<ExpoConfig["runtimeVersion"]> {
  if (workflow === Workflow.GENERIC) {
    return DEFAULT_BARE_RUNTIME_VERSION;
  }
  // Expo Go supports loading appVersion SDK 49 and above
  const hasSupportedSdk =
    sdkVersion && semver.satisfies(sdkVersion, ">= 49.0.0");
  return hasSupportedSdk
    ? DEFAULT_MANAGED_RUNTIME_VERSION_GTE_SDK_49
    : DEFAULT_MANAGED_RUNTIME_VERSION_LTE_SDK_48;
}

export const requestedPlatformDisplayNames: Record<RequestedPlatform, string> =
  {
    [RequestedPlatform.Android]: "Android",
    [RequestedPlatform.Ios]: "iOS",
    [RequestedPlatform.All]: "Android and iOS",
  };

export async function selectRequestedPlatformAsync(
  platform?: string,
): Promise<RequestedPlatform> {
  if (
    platform &&
    Object.values(RequestedPlatform).includes(
      platform.toLowerCase() as RequestedPlatform,
    )
  ) {
    return platform.toLowerCase() as RequestedPlatform;
  }

  const { requestedPlatform } = await prompts({
    type: "select",
    message: "Select platform",
    name: "requestedPlatform",
    choices: [
      { title: "All", value: RequestedPlatform.All },
      { title: "Android", value: RequestedPlatform.Android },
      { title: "iOS", value: RequestedPlatform.Ios },
    ],
  });
  return requestedPlatform;
}

export async function selectPlatformAsync(
  platform?: string,
): Promise<Platform> {
  if (
    platform &&
    Object.values(Platform).includes(platform.toLowerCase() as Platform)
  ) {
    return platform.toLowerCase() as Platform;
  }

  const { resolvedPlatform } = await prompts({
    type: "select",
    message: "Select platform",
    name: "resolvedPlatform",
    choices: [
      { title: "Android", value: Platform.ANDROID },
      { title: "iOS", value: Platform.IOS },
    ],
  });
  return resolvedPlatform;
}

export function toPlatforms(requestedPlatform: RequestedPlatform): Platform[] {
  if (requestedPlatform === RequestedPlatform.All) {
    return [Platform.ANDROID, Platform.IOS];
  }

  if (requestedPlatform === RequestedPlatform.Android) {
    return [Platform.ANDROID];
  }

  return [Platform.IOS];
}

export function serializeRuntimeVersionToString(
  runtimeVersion: NonNullable<ExpoConfig["runtimeVersion"]>,
): string {
  if (typeof runtimeVersion === "object") {
    return JSON.stringify(runtimeVersion);
  }

  return runtimeVersion;
}

export function replaceUndefinedObjectValues(
  value: Record<string, unknown>,
  replacement: unknown,
): Record<string, unknown> {
  for (const key in value) {
    if (value[key] === undefined) {
      value[key] = replacement;
    } else if (typeof value[key] === "object") {
      // @ts-ignore: value[key] is Record<string, unknown>
      value[key] = replaceUndefinedObjectValues(value[key], replacement);
    }
  }
  return value;
}

async function getAndroidManifestAsync(
  projectDir: string,
): Promise<AndroidManifest> {
  const androidManifestPath =
    await AndroidConfig.Paths.getAndroidManifestAsync(projectDir);
  if (!androidManifestPath) {
    throw new Error(
      `Could not find AndroidManifest.xml in project directory: "${projectDir}"`,
    );
  }
  return AndroidConfig.Manifest.readAndroidManifestAsync(androidManifestPath);
}

/**
 * Synchronize updates configuration to native files. This needs to do essentially the same thing as `withUpdates`
 */
export async function syncAndroidConfiguration(
  projectDir: string,
  exp: ExpoConfig,
): Promise<void> {
  ensureValidVersions(exp, RequestedPlatform.Android);

  // sync AndroidManifest.xml
  const androidManifestPath =
    await AndroidConfig.Paths.getAndroidManifestAsync(projectDir);
  const androidManifest = await getAndroidManifestAsync(projectDir);
  const updatedAndroidManifest =
    await AndroidConfig.Updates.setUpdatesConfigAsync(
      projectDir,
      exp,
      androidManifest,
    );
  await AndroidConfig.Manifest.writeAndroidManifestAsync(
    androidManifestPath,
    updatedAndroidManifest,
  );

  // sync strings.xml
  const stringsJSONPath =
    await AndroidConfig.Strings.getProjectStringsXMLPathAsync(projectDir);
  const stringsResourceXML =
    await AndroidConfig.Resources.readResourcesXMLAsync({
      path: stringsJSONPath,
    });

  const updatedStringsResourceXML =
    await AndroidConfig.Updates.applyRuntimeVersionFromConfigForProjectRootAsync(
      projectDir,
      exp,
      stringsResourceXML,
    );
  await ExpoPlugins.XML.writeXMLAsync({
    path: stringsJSONPath,
    xml: updatedStringsResourceXML,
  });
}

export function ensureValidVersions(
  exp: ExpoConfig,
  platform: RequestedPlatform,
): void {
  const error = new Error(
    `Couldn't find either ${chalk.bold("runtimeVersion")} or ${chalk.bold(
      "sdkVersion",
    )} to configure ${chalk.bold(
      "expo-updates",
    )}. Specify at least one of these properties under the ${chalk.bold(
      "expo",
    )} key in ${chalk.bold("app.json")}. ${learnMore(
      "https://docs.expo.dev/eas-update/runtime-versions/",
    )}`,
  );

  if (
    [RequestedPlatform.Android, RequestedPlatform.All].includes(platform) &&
    !(exp.android?.runtimeVersion || exp.runtimeVersion) &&
    !exp.sdkVersion
  ) {
    throw error;
  }
  if (
    [RequestedPlatform.Ios, RequestedPlatform.All].includes(platform) &&
    !(exp.ios?.runtimeVersion || exp.runtimeVersion) &&
    !exp.sdkVersion
  ) {
    throw error;
  }
}

export async function syncIosConfiguration(
  vcsClient: Client,
  projectDir: string,
  exp: ExpoConfig,
): Promise<void> {
  ensureValidVersions(exp, RequestedPlatform.Ios);
  const expoPlist = await readExpoPlistAsync(projectDir);
  const updatedExpoPlist = await IOSConfig.Updates.setUpdatesConfigAsync(
    projectDir,
    exp,
    expoPlist,
  );
  await writeExpoPlistAsync(vcsClient, projectDir, updatedExpoPlist);
}

async function readExpoPlistAsync(
  projectDir: string,
): Promise<IOSConfig.ExpoPlist> {
  const expoPlistPath = IOSConfig.Paths.getExpoPlistPath(projectDir);
  return ((await readPlistAsync(expoPlistPath)) ?? {}) as IOSConfig.ExpoPlist;
}

async function writeExpoPlistAsync(
  vcsClient: Client,
  projectDir: string,
  expoPlist: IOSConfig.ExpoPlist,
): Promise<void> {
  const expoPlistPath = IOSConfig.Paths.getExpoPlistPath(projectDir);
  await writePlistAsync(expoPlistPath, expoPlist);
  await vcsClient.trackFileAsync(expoPlistPath);
}

export async function readPlistAsync(
  plistPath: string,
): Promise<object | null> {
  if (await fs.pathExists(plistPath)) {
    const expoPlistContent = await fs.readFile(plistPath, "utf8");
    try {
      return plist.parse(expoPlistContent);
    } catch (error) {
      const err = resolveError(error);
      err.message = `Failed to parse ${plistPath}. ${err.message}`;
      throw err;
    }
  } else {
    return null;
  }
}

export async function writePlistAsync(
  plistPath: string,
  plistObject: IOSConfig.ExpoPlist | IOSConfig.InfoPlist,
): Promise<void> {
  const contents = plist.build(plistObject);
  await fs.mkdirp(path.dirname(plistPath));
  await fs.writeFile(plistPath, contents);
}

/**
 * Partially merge the EAS Update config with the existing Expo config.
 * This preserves and merges the nested update-related properties.
 */
export function mergeExpoConfig(
  exp: ExpoConfig,
  modifyExp: Partial<ExpoConfig>,
): Partial<ExpoConfig> {
  return {
    runtimeVersion: modifyExp.runtimeVersion ?? exp.runtimeVersion,
    updates: { ...exp.updates, ...modifyExp.updates },
    android: {
      ...exp.android,
      ...modifyExp.android,
    },
    ios: {
      ...exp.ios,
      ...modifyExp.ios,
    },
    extra: {
      ...exp.extra,
      ...modifyExp.extra,
    },
    platforms: ["ios", "android"],
  };
}

type ModifyConfigResult =
  | {
      type: "success";
      config: AppJSONConfig;
    }
  | {
      type: "warn" | "fail";
      message: string;
      config: null;
    }
  | {
      type: "bruh";
      message: string;
      config: null;
    };

export async function modifyExpoConfig(
  projectDir: string,
  exp: Partial<ExpoConfig>,
  readOptions?: { skipSDKVersionRequirement?: boolean },
): Promise<ModifyConfigResult> {
  ensureExpoConfigExists(projectDir);
  await ensureStaticExpoConfigIsValidAsync(projectDir);

  if (readOptions) {
    // @ts-expect-error
    return modifyConfigAsync(projectDir, exp, readOptions);
  }

  // @ts-expect-error
  return modifyConfigAsync(projectDir, exp);
}

export function ensureExpoConfigExists(projectDir: string): void {
  const paths = getConfigFilePaths(projectDir);
  if (!paths?.staticConfigPath && !paths?.dynamicConfigPath) {
    fs.writeFileSync(
      path.join(projectDir, "app.json"),
      JSON.stringify({ expo: {} }, null, 2),
    );
  }
}

async function ensureStaticExpoConfigIsValidAsync(
  projectDir: string,
): Promise<void> {
  if (isUsingStaticExpoConfig(projectDir)) {
    const staticConfigPath = nullthrows(
      getConfigFilePaths(projectDir).staticConfigPath,
    );
    const staticConfig = await readJsonFile<AppJSONConfig>(staticConfigPath);

    // Add the "expo" key if it doesn't exist on app.json yet, such as in
    // projects initialized with RNC CLI
    if (!staticConfig?.expo) {
      // @ts-expect-error: expo can be empty
      staticConfig.expo = {};
      await writeJsonFile(staticConfigPath, staticConfig);
    }
  }
}

export function isUsingStaticExpoConfig(projectDir: string): boolean {
  const paths = getConfigFilePaths(projectDir);
  return !!(
    paths.staticConfigPath?.endsWith("app.json") && !paths.dynamicConfigPath
  );
}

export async function resolveRuntimeVersionPolicyAsync(
  policy: "appVersion" | "nativeVersion" | "sdkVersion",
  config: Pick<ExpoConfig, "version" | "sdkVersion"> & {
    android?: Pick<Android, "versionCode">;
    ios?: Pick<IOS, "buildNumber">;
  },
  platform: "android" | "ios",
): Promise<string> {
  switch (policy) {
    case "appVersion":
      return getAppVersion(config);
    case "nativeVersion":
      return getNativeVersion(config, platform);
    case "sdkVersion":
      if (!config.sdkVersion) {
        throw new Error(
          "An SDK version must be defined when using the 'sdkVersion' runtime policy.",
        );
      }
      return getRuntimeVersionForSDKVersion(config.sdkVersion);
    default:
      // fingerprintExperimental is resolvable only at build time (not in config plugin).
      throw new Error(
        `"${policy}" is not a valid runtime version policy type.`,
      );
  }
}

export async function resolveRuntimeVersionAsync(
  projectRoot: string,
  platform: "android" | "ios",
): Promise<{
  runtimeVersion: string | null;
  fingerprintSources: Fingerprint.FingerprintSource[] | null;
}> {
  const { exp: config } = getConfig(projectRoot, {
    isPublicConfig: true,
    skipSDKVersionRequirement: true,
  });

  const runtimeVersion =
    config[platform]?.runtimeVersion ?? config.runtimeVersion;
  if (!runtimeVersion || typeof runtimeVersion === "string") {
    return { runtimeVersion: runtimeVersion ?? null, fingerprintSources: null };
  }

  const vcs = new GitClient();

  const workflow = await resolveWorkflowAsync(
    projectRoot,
    platform === "ios" ? Platform.IOS : Platform.ANDROID,
    vcs,
  );

  const policy = runtimeVersion.policy;

  if (policy === "fingerprintExperimental") {
    const fingerprint = await Fingerprint.createFingerprintAsync(projectRoot, {
      platforms: [platform],
    });
    await Bun.write("fingerprint.json", JSON.stringify(fingerprint));
    return {
      runtimeVersion: fingerprint.hash,
      fingerprintSources: fingerprint.sources,
    };
  }

  if (workflow !== "managed") {
    throw new Error(
      `You're currently using the bare workflow, where runtime version policies are not supported. You must set your runtime version manually. For example, define your runtime version as "1.0.0", not {"policy": "appVersion"} in your app config. https://docs.expo.dev/eas-update/runtime-versions`,
    );
  }

  return {
    runtimeVersion: await resolveRuntimeVersionPolicyAsync(
      policy,
      config,
      platform,
    ),
    fingerprintSources: null,
  };
}

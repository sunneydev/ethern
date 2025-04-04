import { Log, learnMore } from "../tools/others";
import type { ExpoConfig, Platform } from "@expo/config";
import { Workflow, Platform as EPlatform } from "@expo/eas-build-job";
import c from "chalk";
import {
  replaceUndefinedObjectValues,
  serializeRuntimeVersionToString,
} from "~/expo/utils";
import { appPlatformDisplayNames, AppPlatform } from "~/types/expo";

export function logEasUpdatesAutoConfig({
  modifyConfig,
  exp,
}: {
  modifyConfig: Partial<ExpoConfig>;
  exp: ExpoConfig;
}): void {
  if (modifyConfig.updates?.url) {
    Log.withTick(
      exp.updates?.url
        ? `Overwrote updates.url "${exp.updates.url}" with "${modifyConfig.updates.url}"`
        : `Configured updates.url to "${modifyConfig.updates.url}"`,
    );
  }

  const androidRuntime =
    modifyConfig.android?.runtimeVersion ?? modifyConfig.runtimeVersion;
  const iosRuntime =
    modifyConfig.ios?.runtimeVersion ?? modifyConfig.runtimeVersion;
  if (androidRuntime && iosRuntime && androidRuntime === iosRuntime) {
    Log.withTick(
      `Configured runtimeVersion for ${
        appPlatformDisplayNames[AppPlatform.Android]
      } and ${
        appPlatformDisplayNames[AppPlatform.Ios]
      } with "${serializeRuntimeVersionToString(androidRuntime)}"`,
    );
  } else {
    if (androidRuntime) {
      Log.withTick(
        `Configured runtimeVersion for ${
          appPlatformDisplayNames[AppPlatform.Android]
        } with "${serializeRuntimeVersionToString(androidRuntime)}"`,
      );
    }
    if (iosRuntime) {
      Log.withTick(
        `Configured runtimeVersion for ${
          appPlatformDisplayNames[AppPlatform.Ios]
        } with "${serializeRuntimeVersionToString(iosRuntime)}"`,
      );
    }
  }
}

export function warnEASUpdatesManualConfig({
  modifyConfig,
  workflows,
}: {
  modifyConfig: Partial<ExpoConfig>;
  workflows: Record<EPlatform, Workflow>;
}): void {
  Log.addNewLineIfNone();
  Log.warn(
    `It looks like you are using a dynamic configuration! ${learnMore(
      "https://docs.expo.dev/workflow/configuration/#dynamic-configuration-with-appconfigjs)",
    )}`,
  );
  Log.warn(
    `Finish configuring EAS Update by adding the following to the project app.config.js:\n${learnMore(
      "https://expo.fyi/eas-update-config",
    )}\n`,
  );

  Log.log(
    c.bold(
      JSON.stringify(
        replaceUndefinedObjectValues(modifyConfig, "<remove this key>"),
        null,
        2,
      ),
    ),
  );
  Log.addNewLineIfNone();

  if (
    workflows.android === Workflow.GENERIC ||
    workflows.ios === Workflow.GENERIC
  ) {
    Log.warn(
      c`The native config files {bold Expo.plist & AndroidManifest.xml} must be updated to support EAS Update. ${learnMore(
        "https://expo.fyi/eas-update-config.md#native-configuration",
      )}`,
    );
  }

  Log.addNewLineIfNone();
}

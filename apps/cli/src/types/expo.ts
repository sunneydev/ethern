import type { ExpoConfig } from "@expo/config";
import type { Empty } from "~/types/common";

export enum AppPlatform {
  Android = "ANDROID",
  Ios = "IOS",
}

export const appPlatformDisplayNames: Record<AppPlatform, string> = {
  ANDROID: "Android",
  IOS: "iOS",
};

export const appPlatformEmojis = {
  IOS: "🍏",
  ANDROID: "🤖",
};

export enum RequestedPlatform {
  All = "all",
  Android = "android",
  Ios = "ios",
}

export type Platform = "ios" | "android" | "all" | "web";

export type ContentType =
  | "application/javascript"
  | "font/otf"
  | "image/png"
  | "image/svg+xml";

export type EXT = "otf" | "png" | "svg";

export type FileExtension = `.${EXT}`;

export interface Metadata {
  version: number;
  bundler: string;
  fileMetadata: FileMetadata;
}

export interface FileMetadata {
  ios: PlatformMetadata;
  android: PlatformMetadata;
}

export interface PlatformMetadata {
  bundle: string;
  assets: Asset[];
}

export interface Manifest {
  id: string;
  createdAt: string;
  platform: Platform;
  runtimeVersion: string;
  assets: Asset[];
  launchAsset: {
    ios: Asset;
    android: Asset;
  };
  metadata: Metadata | Empty;
  extra: ManifestExtra;
}

export interface Asset {
  hash: string;
  key: string;
  fileExtension?: FileExtension;
  ext?: EXT;
  path?: string;
  contentType: ContentType;
  url: string;
}

export interface ManifestExtra {
  expoClient: ExpoConfig;
}

export type GetAssetMetadataArg = {
  updateBundlePath: string;
  filePath: string;
  ext: EXT | null;
  isLaunchAsset: boolean;
  runtimeVersion: string;
  platform: string;
  appId: string;
  timestamp: string;
} & ({ ext: null; isLaunchAsset: true } | { ext: EXT; isLaunchAsset: false });

import { notNull } from "@ethern/utils/notNull";
import { stringToUUID } from "./helpers";
import { Platform } from "~/validators/updates";

export interface Manifest {
  id: string;
  createdAt: string;
  platform: string;
  runtimeVersion: string;
  extra: { ethern: { projectId: string } };
  assets: Asset[];
  launchAsset: Asset;
  metadata: Record<string, string>;
}

export interface Asset {
  url: string;
  key: string;
  hash: string;
  contentType: string;
  fileExtension: string;
}

export interface RawAsset {
  key: string;
  hash: string;
  type: string;
  ext: string;
}

export function getR2UpdateUrl({
  projectId,
  runtimeVersion,
  platform,
  updateId,
}: {
  runtimeVersion: string;
  projectId: string;
  platform: string;
  updateId: string;
}) {
  return `${projectId}/${runtimeVersion}/${platform}/${updateId}`;
}

export function generateUpdateId(projectId: number, platform: Platform) {
  return stringToUUID(
    JSON.stringify({
      projectId,
      runtimeVersion: platform.runtimeVersion,
      assets: platform.assets.map((a) => a.hash),
    }),
  );
}

export function generateManifest({
  updateId,
  runtimeVersion,
  platform,
  launchAsset,
  assets,
  projectId,
  r2Domain,
}: {
  updateId: string;
  runtimeVersion: string;
  platform: string;
  launchAsset: RawAsset;
  assets: RawAsset[];
  projectId: string;
  r2Domain: string;
}) {
  return {
    id: updateId,
    createdAt: new Date().toISOString(),
    runtimeVersion,
    platform,
    launchAsset: {
      url: `${r2Domain}/${launchAsset.key}`,
      key: launchAsset.key,
      hash: launchAsset.hash,
      contentType: launchAsset.type,
      fileExtension: launchAsset.ext,
    },
    assets: assets.map((a) => ({
      url: `${r2Domain}/${a.key}`,
      key: a.hash,
      hash: a.hash,
      contentType: a.type,
      fileExtension: a.ext,
    })),
    extra: { ethern: { projectId } },
    metadata: {},
  } satisfies Manifest;
}

export function populatePlatforms({
  platforms: { ios, android },
  projectId,
}: {
  platforms: { android?: Platform; ios?: Platform };
  projectId: number;
}): {
  assetHashes: string[];
  platforms: {
    ios: (Platform & { name: "ios"; checksum: string }) | null;
    android: (Platform & { name: "android"; checksum: string }) | null;
  };
} {
  const assetHashes = [
    ...new Set(
      [
        android?.launchAsset,
        ios?.launchAsset,
        ...(android?.assets ?? []),
        ...(ios?.assets ?? []),
      ]
        .filter(notNull)
        .map((a) => a.key),
    ),
  ];

  if (ios == null && android == null) {
    throw new Error("Invalid platforms provided");
  }

  if (ios && android && ios.runtimeVersion === android.runtimeVersion) {
    const combinedUpdateId = stringToUUID(
      JSON.stringify({
        projectId,
        runtimeVersion: ios.runtimeVersion,
        assets: assetHashes,
      }),
    );

    return {
      assetHashes,
      platforms: {
        android: {
          ...android,
          checksum: combinedUpdateId,
          name: "android",
        },
        ios: {
          ...ios,
          checksum: combinedUpdateId,
          name: "ios",
        },
      },
    };
  }

  return {
    assetHashes,
    platforms: {
      android: android
        ? {
            ...android,
            name: "android",
            checksum: generateUpdateId(projectId, android),
          }
        : null,
      ios: ios
        ? {
            ...ios,
            name: "ios",
            checksum: generateUpdateId(projectId, ios),
          }
        : null,
    },
  };
}

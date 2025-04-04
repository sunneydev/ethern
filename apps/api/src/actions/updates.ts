import type { Repository } from "@ethern/db";
import type { Platform } from "~/validators/updates";

export async function createUpdates({
  repository,
  projectId,
  platforms,
  name,
}: {
  name: string;
  repository: Repository;
  platforms: {
    ios: (Platform & { checksum: string; name: "ios" }) | null;
    android: (Platform & { checksum: string; name: "android" }) | null;
  };
  projectId: number;
}) {
  if (!platforms.android && !platforms.ios) {
    throw new Error("No platforms provided.");
  }

  const { android, ios } = platforms;

  for (const platform of [android, ios]) {
    if (android && ios && android.runtimeVersion === ios.runtimeVersion) {
      await repository.updates.create({
        id: android.checksum,
        name,
        projectId,
        runtimeVersion: android.runtimeVersion,
        platform: "all",
      });

      // important, so we don't create the same update twice
      return;
    }

    if (platform) {
      await repository.updates.create({
        id: platform.checksum,
        name,
        projectId,
        runtimeVersion: platform.runtimeVersion,
        platform: platform.name,
      });
    }
  }
}

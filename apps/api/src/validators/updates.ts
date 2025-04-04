import { vValidator as vv } from "@hono/valibot-validator";
import * as v from "valibot";

const Asset = v.object({
  key: v.string(),
  /**
   * sha256 hash of the asset
   */
  hash: v.string(),
  type: v.string(),
  ext: v.string(),
});

export const Platform = v.object({
  runtimeVersion: v.string(),
  launchAsset: Asset,
  assets: v.array(Asset),
});

export interface Platform extends v.InferInput<typeof Platform> {}

export const Metadata = v.object({
  token: v.string(),
  timestamp: v.number(),
  platforms: v.pipe(
    v.object({
      ios: v.optional(Platform),
      android: v.optional(Platform),
    }),
    v.transform((v) => {
      if (v.ios == null && v.android == null) {
        throw new Error("No platforms provided.");
      }

      if (
        v.ios &&
        v.android &&
        v.ios.launchAsset.hash === v.android.launchAsset.hash
      ) {
        throw new Error("Update already exists.");
      }

      return v;
    }),
  ),
});

export interface Metadata extends v.InferInput<typeof Metadata> {}

export const UpdateSchema = vv(
  "form",
  v.object({
    zip: v.instance(File),
    name: v.string(),
    metadata: v.string(),
  }),
);

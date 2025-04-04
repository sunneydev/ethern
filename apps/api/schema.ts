import {
  sqliteTable,
  text,
  blob,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const kv = sqliteTable("_cf_KV", {
  key: text("key").primaryKey().notNull(),
  value: blob("value"),
});

export const objects = sqliteTable("_mf_objects", {
  key: text("key").primaryKey(),
  blobId: text("blob_id"),
  version: text("version").notNull(),
  size: integer("size").notNull(),
  etag: text("etag").notNull(),
  uploaded: integer("uploaded").notNull(),
  checksums: text("checksums").notNull(),
  httpMetadata: text("http_metadata").notNull(),
  customMetadata: text("custom_metadata").notNull(),
});

export const uploads = sqliteTable("_mf_multipart_uploads", {
  uploadId: text("upload_id").primaryKey(),
  key: text("key").notNull(),
  httpMetadata: text("http_metadata").notNull(),
  customMetadata: text("custom_metadata").notNull(),
  state: integer("state").default(0).notNull(),
});

export const mfMultipartParts = sqliteTable(
  "_mf_multipart_parts",
  {
    uploadId: text("upload_id")
      .notNull()
      .references(() => uploads.uploadId),
    partNumber: integer("part_number").notNull(),
    blobId: text("blob_id").notNull(),
    size: integer("size").notNull(),
    etag: text("etag").notNull(),
    checksumMd5: text("checksum_md5").notNull(),
    objectKey: text("object_key").references(() => objects.key),
  },
  (table) => {
    return {
      pk0: primaryKey({
        columns: [table.partNumber, table.uploadId],
        name: "_mf_multipart_parts_part_number_upload_id_pk",
      }),
    };
  },
);

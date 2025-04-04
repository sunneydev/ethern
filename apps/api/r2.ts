import { Database } from "bun:sqlite";
import p from "path";
import fs from "node:fs";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

const blobsPath = p.join(
  p.dirname(p.dirname(import.meta.dir)),
  ".wrangler/state/v3/r2/rn-updates/blobs",
);

const basePath = p.join(
  p.dirname(p.dirname(import.meta.dir)),
  ".wrangler/state/v3/r2/miniflare-R2BucketObject",
);

const sqlitePath = fs.readdirSync(basePath).find((f) => f.endsWith(".sqlite"));

if (!sqlitePath) {
  throw new Error("SQLite file not found");
}

const file = p.join(basePath, sqlitePath);

const client = new Database(file);

const db = drizzle(client, { schema });

Bun.serve({
  port: 8788,
  async fetch(request) {
    const filename = new URL(request.url).pathname.slice(1);

    const object = await db.query.objects
      .findMany({
        where: eq(schema.objects.key, filename),
        limit: 1,
      })
      .then((r) => r[0]);

    if (!object || !object.blobId) {
      return new Response("Not found", { status: 404 });
    }

    const file = Bun.file(p.join(blobsPath, object.blobId));

    return new Response(file, {
      headers: {
        "content-disposition": `attachment; filename="${filename}"`,
      },
    });
  },
});

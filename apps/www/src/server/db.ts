import { createClient } from "@clickhouse/client-web";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { Repository, getDB } from "@ethern/db";

export const db = getDB(
  process.env.NODE_ENV === "development"
    ? getRequestContext().env.DB
    : (process.env as unknown as { DB: D1Database }).DB,
);

export const kv = (
  process.env.NODE_ENV === "development"
    ? getRequestContext().env.KV
    : process.env.KV
) as KVNamespace;

export const clickhouse = createClient({
  url: process.env.CLICKHOUSE_URL,
});

export const repository = new Repository(db);

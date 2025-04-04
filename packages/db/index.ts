import * as schema from "./schema";
import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";

export function getDB(d1: D1Database) {
  return drizzle(d1, { schema });
}

export * from "./schema";
export * from "./types";
export * from "./repository";

import type { Config } from "drizzle-kit";

export default {
  schema: "./schema.ts",
  out: "./",
  driver: "d1",
  dbCredentials: {
    dbName:
      process.env.NODE_ENV === "production" ? "ethern-db" : "preview-ethern-db",
    wranglerConfigPath: "../../apps/api/wrangler.toml",
  },
} satisfies Config;

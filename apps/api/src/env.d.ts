// Generated by Wrangler on Mon Jun 24 2024 04:13:38 GMT+0400 (Georgia Standard Time)
// by running `wrangler types src/env.d.ts`

interface Env {
  KV: KVNamespace;
  SECRET_KEY: string;
  R2_DOMAIN: string;
  CLICKHOUSE_DB_URL: string;
  REDIS_PASSWORD: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  CLI_AUTH: DurableObjectNamespace;
  R2: R2Bucket;
  DB: D1Database;
  UPDATES: AnalyticsEngineDataset;
}

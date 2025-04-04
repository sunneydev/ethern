interface CloudflareEnv {
  DB: D1Database;
  SECRET_KEY: string;
  RESEND_API_KEY: string;
  PADDLE_API_KEY: string;
  KV: KVNamespace;
  R2: R2Bucket;
}

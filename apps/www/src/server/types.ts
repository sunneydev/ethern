import { getRequestContext } from "@cloudflare/next-on-pages";

export type Context = ReturnType<typeof getRequestContext>;

export interface Env {
  DB: D1Database;
  SECRET_KEY: string;
  RESEND_API_KEY: string;
  PADDLE_API_KEY: string;
  KV: KVNamespace;
  R2: R2Bucket;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

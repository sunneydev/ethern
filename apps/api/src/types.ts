import type { Repository } from "@ethern/db";
import type { DB } from "@ethern/db/types";
import type { MiddlewareHandler } from "hono";
import type { CliAuthStub } from "~/do/cli-auth";

export type Env<T = Record<string, unknown>> = {
  Bindings: {
    R2: R2Bucket;
    KV: KVNamespace;
    CLI_AUTH: CliAuthStub;
    DB: D1Database;
    SECRET_KEY: string;
    R2_DOMAIN: string;
    UPDATES: AnalyticsEngineDataset;
    REDIS_PASSWORD: string;
    CLICKHOUSE_DB_URL: string;
  };
  Variables: {
    db: DB;
    repository: Repository;
  } & T;
};

export type Middleware<T = Record<string, unknown>> = MiddlewareHandler<Env<T>>;

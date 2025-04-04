import { getRequestContext } from "@cloudflare/next-on-pages";
import "server-only";
import type { Env } from "~/server/types";

export function getEnv(): Env {
  const grc = getRequestContext().env as unknown as Env;

  if (grc.SECRET_KEY != null) {
    return grc;
  }

  if (process.env.SECRET_KEY != null) {
    return process.env as unknown as Env;
  }

  throw new Error("Env variables are not defined");
}

export function isDev() {
  return (
    // @ts-expect-error dumb
    process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "prod"
  );
}

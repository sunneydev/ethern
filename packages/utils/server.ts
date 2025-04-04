import type { getRequestContext } from "@cloudflare/next-on-pages";
import { Repository, getDB } from "@ethern/db";
import { UAParser } from "ua-parser-js";

export function getR2UpdateUrl({
  projectId,
  runtimeVersion,
  platform,
  updateId,
}: {
  runtimeVersion: string;
  projectId: string;
  platform: string;
  updateId: string;
}) {
  return `${projectId}/${runtimeVersion}/${platform}/${updateId}`;
}

export async function createSession({
  userId,
  userAgent,
  ...opts
}: {
  userId: number;
  userAgent?: string | null;
} & (
  | {
      cf?: { city?: string | unknown; country?: string | unknown };
      db: D1Database | Repository;
    }
  | { ctx: ReturnType<typeof getRequestContext> }
)) {
  const { cf, db } =
    "ctx" in opts
      ? {
          cf: opts.ctx.cf,
          // @ts-ignore
          db: (opts.ctx.env as unknown).DB as D1Database,
        }
      : opts;

  const repository = db instanceof Repository ? db : new Repository(getDB(db));

  if (!db) {
    throw new Error("Missing db");
  }

  const deviceInfo = userAgent ? new UAParser(userAgent).getResult() : null;

  const {
    browser: { name, version },
    device: { model },
  } = deviceInfo ?? { browser: {}, device: {} };

  const device =
    deviceInfo && name && version && model
      ? `${model} - ${name} ${version}`
      : null;

  const location =
    cf && typeof cf.city === "string" && typeof cf.country === "string"
      ? `${cf.city}, ${cf.country}`
      : null;

  const session = await repository.sessions.create({
    userId,
    device,
    location,
  });

  return session;
}

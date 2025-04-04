import { getRequestContext } from "@cloudflare/next-on-pages";
import { sessionCookieProps } from "@ethern/web/utils";
import { cookies } from "next/headers";
import { repository } from "~/server/db";

export const runtime = "edge";

export async function POST() {
  const cookie = (await cookies()).get("session-token");
  const token = cookie?.value;

  if (token) {
    getRequestContext().ctx.waitUntil(repository.sessions.expire(token));
    await repository.sessions.expire(token);
  }
  (await cookies()).set("session-token", "", sessionCookieProps(new Date(0)));

  return new Response(null, {
    status: 204,
  });
}

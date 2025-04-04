import "server-only";

import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export function sessionCookieProps(expiresAt?: Date): Partial<ResponseCookie> {
  return {
    expires: expiresAt,
    httpOnly: true,
    sameSite: "strict",
    secure:
      process.env.NODE_ENV === "production" ||
      (process.env.NODE_ENV as string) === "prod",

    domain: process.env.NODE_ENV !== "production" ? "localhost" : ".ethern.dev",
  };
}

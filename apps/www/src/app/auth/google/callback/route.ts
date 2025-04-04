import { getRequestContext } from "@cloudflare/next-on-pages";
import { users } from "@ethern/db";
import { createSession } from "@ethern/utils/server";
import { sessionCookieProps } from "@ethern/web/utils";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import type { SignInErrors } from "~/lib/types";
import { log } from "~/lib/utils";
import { db, repository } from "~/server/db";
import { google } from "~/server/modules/google";

function signInErrorUrl(error: SignInErrors, baseUrl?: string) {
  return `${baseUrl}/auth/account/sign-in?error=${error}`;
}

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const redirectUri = `${url.origin}/auth/google/callback`;

    if (!code) {
      log.info("Missing code in query params", { extra: { url: request.url } });

      return NextResponse.redirect(signInErrorUrl("missing-code", url.origin));
    }

    const accessToken = await google.generateAccessToken({
      code,
      redirectUri,
    });

    const user = await google.getUserInfo(accessToken);

    if (!user.verified_email) {
      return NextResponse.redirect(
        signInErrorUrl("unverified-email", url.origin),
      );
    }

    if (!user) {
      return NextResponse.redirect(signInErrorUrl("invalid-token", url.origin));
    }

    const existingUser = await db.query.users.findFirst({
      where({ oauthId, provider, email }, { eq, and, or }) {
        return or(
          and(eq(oauthId, user.id.toString()), eq(provider, "google")),
          eq(email, user.email),
        );
      },
    });

    log.info(`Existing user: ${existingUser}`, { user });

    if (existingUser && existingUser.oauthId !== user.id.toString()) {
      log.info("Updating oauthId", { extra: { user, existingUser } });

      let values = {
        oauthId: user.id.toString(),
        provider: "google",
      } as { [key: string]: string };

      if (existingUser.avatarUrl == null || existingUser.avatarUrl === "") {
        values = {
          ...values,
          avatarUrl: user.picture,
        };
      }

      await db.update(users).set(values).where(eq(users.id, existingUser.id));

      existingUser.oauthId = user.id.toString();
    }

    const ctx = getRequestContext();
    const { cf } = ctx;
    const userAgent = request.headers.get("user-agent");

    // If the user does not exist, create a new user
    if (!existingUser) {
      log.info(`Creating new user for ${user.email}`, { user });

      const newUserId = await repository.users
        .create({
          avatarUrl: user.picture,
          provider: "google",
          oauthId: user.id.toString(),
          verified: true,
          email: user.email,
          username: user.email.split("@")[0],
        })
        .catch((error) => {
          log.info(`Failed to create google user ${user.email}: ${error}`, {
            user,
          });
          return null;
        });

      if (!newUserId) {
        log.info("Failed to create new user, redirecting", { user });
        return NextResponse.redirect(
          signInErrorUrl("account-exists", url.origin),
        );
      }

      const { sessionId, expiresAt } = await createSession({
        cf,
        userId: newUserId,
        userAgent,
        db: repository,
      });
      (await cookies()).set("session-token", sessionId, {
        ...sessionCookieProps(expiresAt),
        sameSite: "lax",
      });

      return NextResponse.redirect(new URL("/dashboard/overview", url.origin));
    }

    const { sessionId, expiresAt } = await createSession({
      cf,
      userAgent,
      userId: existingUser.id,
      db: repository,
    });
    (await cookies()).set("session-token", sessionId, {
      ...sessionCookieProps(expiresAt),
      sameSite: "lax",
    });

    return NextResponse.redirect(new URL("/dashboard/overview", url.origin));
  } catch (error) {
    log.info(`Failed to sign in: ${error}`, { extra: { url: request.url } });
    return NextResponse.redirect(
      signInErrorUrl("unexpected-error", new URL(request.url).origin),
    );
  }
}

import { getRequestContext } from "@cloudflare/next-on-pages";
import { users } from "@ethern/db";
import { createSession } from "@ethern/utils/server";
import { sessionCookieProps } from "@ethern/web/utils";
import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import type { SignInErrors } from "~/lib/types";
import { log, s } from "~/lib/utils";
import { db, repository } from "~/server/db";
import { github } from "~/server/modules/github";

function signInErrorUrl(error: SignInErrors, baseUrl?: string) {
  return `${baseUrl}/auth/account/sign-in?error=${error}`;
}

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  try {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(signInErrorUrl("missing-code", url.origin));
    }

    const token = await github.generateAccessToken(code).catch((error) => {
      log.info(`Failed to exchange code for token: ${error}`);
      return null;
    });

    console.log(token);

    if (!token) {
      return NextResponse.redirect(signInErrorUrl("invalid-token", url.origin));
    }

    const user = await github.fetchUser(token).catch((error) => {
      log.info(`Failed to get GitHub user: ${error}`, {
        user: {
          id: token,
        },
      });
      return null;
    });

    if (!user) {
      return NextResponse.redirect(signInErrorUrl("invalid-token", url.origin));
    }

    const existingUser = await db.query.users.findFirst({
      where({ oauthId, provider, email }, { or, eq, and }) {
        return or(
          and(eq(oauthId, user.id.toString()), eq(provider, "github")),
          eq(email, user.email),
        );
      },
    });

    const { ctx, cf } = getRequestContext();
    const userAgent = (await headers()).get("user-agent");

    if (existingUser && existingUser.oauthId !== user.id.toString()) {
      log.info("Updating oauthId", { extra: { existingUser, user } });

      let values = {
        oauthId: user.id.toString(),
        provider: "github",
      } as { [key: string]: string };

      if (existingUser.avatarUrl == null || existingUser.avatarUrl === "") {
        values = {
          ...values,
          avatarUrl: user.avatar_url,
        };
      }

      await db.update(users).set(values).where(eq(users.id, existingUser.id));

      existingUser.oauthId = user.id.toString();
    }

    if (!existingUser) {
      const newUserId = await repository.users
        .create({
          avatarUrl: user.avatar_url,
          provider: "github",
          oauthId: user.id.toString(),
          verified: true,
          email: user.email,
          username: user.login,
        })
        .catch((error) => {
          log.info(`Failed to create user ${user.login}: ${error}`, { user });
          return null;
        });

      if (!newUserId) {
        console.error(`Failed to create user ${user.login}`);
        return NextResponse.redirect(
          signInErrorUrl("unexpected-error", url.origin),
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
      userId: existingUser.id,
      userAgent,
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
      signInErrorUrl("unexpected-error", url.origin),
    );
  }
}

export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: null;
  blog: string;
  location: null;
  email: string;
  hireable: boolean;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: Date;
  updated_at: Date;
}

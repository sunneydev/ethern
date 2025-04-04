import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { repository } from "~/server/db";
import "server-only";

export const getSession = cache(async (providedToken?: string) => {
  const token = providedToken || (await cookies()).get("session-token")?.value;

  if (!token) {
    redirect("/auth/account/sign-in");
  }

  const sessionWithUser = await repository.sessions.findById(token);

  if (!sessionWithUser) {
    redirect("/auth/sign-out");
  }

  const { user, ...session } = sessionWithUser;

  return { user, session };
});

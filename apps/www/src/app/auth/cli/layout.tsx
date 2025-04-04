import { cookies } from "next/headers";
import { Redirect } from "~/components/redirect";
import { getSession } from "~/server";

export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("session-token");

  if (!token) {
    return <Redirect to="/auth/account/sign-in" withAfter />;
  }

  const session = await getSession(token.value);

  if (!session) {
    return <Redirect to="/auth/account/sign-in" withAfter />;
  }

  return <>{children}</>;
}

import { verify } from "@ethern/utils/crypto";
import { redirect } from "next/navigation";
import { repository } from "~/server/db";
import { getEnv, isDev } from "~/server/env";

export default async function Page(props: {
  searchParams: Promise<{
    token: string;
    timestamp: string;
    email: string;
  }>;
}) {
  const { token, timestamp, email } = await props.searchParams;

  const verified = await verify(
    `email:${email}`,
    token,
    getEnv().SECRET_KEY,
    timestamp,
    60,
    "hex",
  );

  if (verified) {
    await repository.users.verifyEmail(email);
    redirect("/dashboard/overview");
  }

  return (
    <div>
      <h1>Verify Email</h1>
      <p>{verified ? "Email verified" : "Email not verified"}</p>
    </div>
  );
}

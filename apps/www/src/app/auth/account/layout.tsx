import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { Navbar } from "~/components/features/navbar";

export default async function Layout({ children }: PropsWithChildren) {
  const token = (await cookies()).get("session-token");

  if (!token) {
    return (
      <div>
        <Navbar to="/" />
        <div className="flex w-full pt-6 sm:justify-center sm:pt-20">
          {children}
        </div>
      </div>
    );
  }

  redirect("/dashboard/overview");
}

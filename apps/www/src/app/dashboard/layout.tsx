import Script from "next/script";
import type { PropsWithChildren } from "react";
import { Onboarding } from "~/components/dashboard/onboarding";
import { Sidebar } from "~/components/dashboard/sidebar";
import { Navbar } from "~/components/features/navbar";
import { cn } from "~/lib/utils";
import { getSession } from "~/server";

export default async function Layout({ children }: PropsWithChildren) {
  const { user } = await getSession();

  return (
    <div>
      <Navbar user={user} to="/dashboard/overview" />
      <div className="flex w-full px-4 2xl:pl-[calc(100vw-100%)]">
        <div
          className={cn(
            "flex w-full max-w-6xl flex-row justify-between pt-6 md:px-10 md:pt-6 xl:mx-auto",
          )}
        >
          {user.onboarded ? (
            <>
              <Sidebar />
              <div className="h-full w-full">{children}</div>
            </>
          ) : (
            <Onboarding liveReload />
          )}
        </div>
      </div>
    </div>
  );
}

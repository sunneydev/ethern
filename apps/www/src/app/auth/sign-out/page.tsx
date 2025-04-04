"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { EllipsisLoader } from "~/components/ellipsis-loader";
import { log } from "~/lib/utils";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    fetch("/auth/account/sign-out", { method: "POST" })
      .then(() => router.push("/auth/account/sign-in"))
      .catch((err) => log.info(`Failed to sign out: ${err}`));
  }, [router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-black">
      <EllipsisLoader className="scale-150" circleClassName="bg-white" />
    </div>
  );
}

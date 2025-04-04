"use client";

import { useState, use } from "react";
import { toast } from "sonner";
import { OTP } from "~/components/features/otp";
import { CheckIcon } from "~/components/icons/check-icon";
import { validateOTP } from "~/server/actions/auth";

export default function Page(props: {
  searchParams: Promise<{ token?: string }>;
}) {
  const searchParams = use(props.searchParams);

  const { token } = searchParams;

  const [success, setSuccess] = useState(false);

  const handleComplete = async (code: string) => {
    if (!token) {
      toast.error("Invalid token");
      return;
    }

    const response = await validateOTP(code, token).catch(() => {
      return {
        ok: false,
        message:
          "Something went wrong. Please try again later, or contact support",
        redirect: null,
      };
    });

    if (response.ok) {
      setSuccess(true);
    } else {
      toast.error(response.message);
    }
  };

  if (success) {
    return (
      <div className="flex h-[90dvh] flex-col items-center justify-center bg-black/95 text-white">
        <CheckIcon className="h-24 w-24 text-green-500" />
        <h1 className="mt-4 text-4xl font-bold">Success</h1>
        <p className="mt-2 text-center text-lg text-white/75">
          You are authenticated, feel free to close this window.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[90dvh] flex-col items-center justify-center bg-black/95 text-white">
      <div className="flex flex-col items-center justify-center rounded-lg bg-black/95 p-8">
        <h2 className="text-center text-4xl font-bold">Session Verification</h2>
        <p className="mt-2 text-center text-xl text-white/75">
          Enter the 8-digit code from your CLI to proceed
        </p>
      </div>
      <OTP onComplete={handleComplete} />
      <p className="mt-4 text-center text-sm text-white/75">
        Never enter a code given to you by a third party
      </p>
    </div>
  );
}

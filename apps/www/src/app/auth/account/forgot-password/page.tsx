"use client";

import { GENERIC_ERROR_MESSAGE } from "@ethern/utils/consts";
import { useOptimistic } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { forgotPassword } from "~/server/actions/auth";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function Page() {
  const [isLoading, setIsLoading] = useOptimistic(false);

  const action = async (form: FormData) => {
    setIsLoading(true);

    const email = form.get("email") as string;

    if (!email) {
      setIsLoading(false);
      toast.error("Please enter your email address.");
      return;
    }

    const response = await forgotPassword(email).finally(() =>
      setIsLoading(false),
    );

    if (!response?.ok) {
      toast.error(response?.message ?? GENERIC_ERROR_MESSAGE);
    } else {
      toast.success("Password reset link sent.");
    }
  };

  return (
    <div className="flex h-fit w-full justify-center">
      <div className="h-full w-full max-w-md rounded-md bg-black p-6 sm:border [&>div]:gap-2 [&>input]:mt-1">
        <Link
          href="/auth/account/sign-in"
          className="mb-4 flex items-center text-[#B0B0B0] hover:text-white"
        >
          <ArrowLeftIcon className="mr-2 size-4" />
          Back
        </Link>
        <div className="text-left">
          <h1 className="text-2xl font-bold">Forgot password</h1>
          <p className="mb-6 text-sm text-[#989898]">
            Enter your email address to receive a password reset link.
          </p>
        </div>
        <form action={action}>
          <label className="!text-[#B0B0B0]">Email</label>
          <Input
            placeholder="Enter your email"
            type="email"
            name="email"
            className="mt-1 h-11 rounded-sm"
          />
          <Button loading={isLoading} className="mt-4 h-11 w-full">
            Send reset link
          </Button>
        </form>
      </div>
    </div>
  );
}

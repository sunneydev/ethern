"use client";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic } from "react";
import { toast } from "sonner";
import { GoogleIcon } from "~/icons/google-icon";
import {
  generateGitHubRedirectUri,
  generateGoogleRedirectUri,
} from "~/lib/utils";
import { signUp } from "~/server/actions/auth";
import { Button } from "~/ui/button";
import { Divider } from "~/ui/divider";
import { Input } from "~/ui/input";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useOptimistic(false);

  const onSubmit = async (form: FormData) => {
    "use client";

    if (!Object.entries(Object.fromEntries(form)).every(([, v]) => v)) {
      toast.error("Please fill out all fields.");
      return;
    }

    setIsLoading(true);

    const response = await signUp(form).finally(() => setIsLoading(false));

    if (response.success) {
      toast.success("Account created successfully");
      router.push("/dashboard/overview");
      return;
    }

    if (response?.error) {
      toast.error(response.error);
      return;
    }

    if (response?.errors) {
      for (const { message } of response.errors) {
        toast.error(message, { position: "top-right" });
      }
      return;
    }
  };

  return (
    <div className="flex h-fit w-full justify-center">
      <div className="h-full w-full max-w-md rounded-md bg-black p-5 sm:border">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <p className="text-[#989898]">
          Already have an account?
          <Link href="/auth/account/sign-in">
            <span className="cursor-pointer text-[#3CABFF]"> Sign In</span>
          </Link>
          .
        </p>
        <form
          action={onSubmit}
          className="mt-5 flex flex-col gap-3 [&>div]:flex [&>div]:flex-col [&>div]:gap-1"
        >
          <div>
            <label className="text-[#B0B0B0]">Username</label>
            <Input
              name="username"
              placeholder="Pick a username"
              type="text"
              className="h-11 rounded-sm"
              autoCapitalize="none"
            />
          </div>
          <div>
            <label className="text-[#B0B0B0]">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="h-11 rounded-sm"
              autoCapitalize="none"
            />
          </div>
          <div>
            <label className="text-[#B0B0B0]">Password</label>
            <Input
              name="password"
              placeholder="••••••••••"
              type="password"
              className="h-11 rounded-sm font-semibold tracking-[0.2em] placeholder:text-white/60"
            />
          </div>
          <div>
            <label className="text-[#B0B0B0]">Confirm Password</label>
            <Input
              name="confirmPassword"
              placeholder="••••••••••"
              type="password"
              className="h-11 rounded-sm font-semibold tracking-[0.2em] placeholder:text-white/60"
            />
          </div>
          <Button
            className={"mt-2 h-11 w-full rounded-sm font-bold"}
            size={"lg"}
            loading={isLoading}
          >
            Sign Up
          </Button>
        </form>
        <Divider>OR</Divider>
        <div className="flex flex-col justify-between gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="h-11 w-full rounded-sm font-semibold"
            size={"default"}
            onClick={() => {
              setIsLoading(true);
              const url = generateGitHubRedirectUri();
              window.location.href = url;
            }}
          >
            <GitHubLogoIcon width="20" height="20" className="mr-2" /> Login
            With GitHub
          </Button>

          <Button
            variant="outline"
            className="h-11 w-full rounded-sm font-semibold"
            size={"default"}
            onClick={() => {
              setIsLoading(true);
              const url = generateGoogleRedirectUri();
              window.location.href = url;
            }}
          >
            <GoogleIcon className="mr-1" /> Login With Google
          </Button>
        </div>
      </div>
    </div>
  );
}

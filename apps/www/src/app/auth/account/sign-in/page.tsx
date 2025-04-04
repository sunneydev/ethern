"use client";

import { GENERIC_ERROR_MESSAGE } from "@ethern/utils/consts";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { usePlausible } from "next-plausible";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useOptimistic, useState, use } from "react";
import { toast } from "sonner";
import { GoogleIcon } from "~/icons/google-icon";
import { signInErrors } from "~/lib/fixtures/sign-in-errors";
import type { SignInErrors } from "~/lib/types";
import {
  generateGitHubRedirectUri,
  generateGoogleRedirectUri,
} from "~/lib/utils";
import { signIn } from "~/server/actions/auth";
import { Button } from "~/ui/button";
import { Divider } from "~/ui/divider";
import { Input } from "~/ui/input";

export default function Page(props0: {
  searchParams: Promise<{
    error?: SignInErrors;
  }>;
}) {
  const searchParams = use(props0.searchParams);

  const { error } = searchParams;

  const p = usePlausible();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useOptimistic(false);

  useEffect(() => {
    if (!error) {
      return;
    }

    const message = signInErrors[error];

    if (!message) {
      return;
    }

    requestAnimationFrame(() => {
      toast.error(message);
    });
  }, [error]);

  async function action(form: FormData) {
    p("Sign In", { props: { provider: "Email" } });
    setIsLoading(true);

    const username = form.get("username");
    const password = form.get("password");

    if (!username || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    const response = await signIn(form).finally(() => setIsLoading(false));
    if (!response?.ok) {
      toast.error(response?.message ?? GENERIC_ERROR_MESSAGE);
    } else {
      router.push("/dashboard/overview");
      router.refresh();
    }
  }

  return (
    <div className="flex h-fit w-full justify-center">
      <div className="h-full w-full max-w-md rounded-md bg-black p-6 sm:border [&>div]:gap-2 [&>input]:mt-1">
        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="mb-6 text-[#989898]">
          Don&#39;t have an account?
          <Link href="/auth/account/sign-up">
            <span className="cursor-pointer text-[#3CABFF]"> Sign up</span>
          </Link>
          .
        </p>
        <form action={action}>
          <label className="!text-[#B0B0B0]">Username</label>
          <Input
            placeholder="Enter your email or username"
            type="text"
            name="username"
            className="mt-1 h-11 rounded-sm"
            autoCapitalize="none"
          />
          <div className="mt-5 flex items-center justify-between">
            <label className="text-[#B0B0B0]">Password</label>
            <Link href={"/auth/account/forgot-password"}>
              <h1 className="cursor-pointer text-xs text-[#C8C8C8]">
                Forgot your password?
              </h1>
            </Link>
          </div>
          <Input
            placeholder="••••••••••"
            type="password"
            name="password"
            className="mt-1 h-11 rounded-sm font-semibold tracking-[0.2em] placeholder:text-white/60"
          />
          <Button
            className="mt-5 h-11 w-full rounded-sm font-semibold"
            size={"lg"}
            type="submit"
            loading={isLoading || loading}
          >
            Continue
          </Button>
          <Divider className="py-4">OR</Divider>
        </form>
        <div className="flex flex-col justify-between gap-2 sm:flex-row">
          <GitHubSignIn />
          <GoogleSignIn />
        </div>
      </div>
    </div>
  );

  function GitHubSignIn() {
    return (
      <Button
        variant="outline"
        className="h-11 w-full rounded-sm font-semibold"
        size={"default"}
        onClick={() => {
          p("Sign In", { props: { provider: "GitHub" } });
          setLoading(true);
          const url = generateGitHubRedirectUri();
          window.location.href = url;
        }}
      >
        <GitHubLogoIcon width="20" height="20" className="mr-2" /> Login With
        GitHub
      </Button>
    );
  }

  function GoogleSignIn() {
    return (
      <Button
        variant="outline"
        className="h-11 w-full rounded-sm font-semibold"
        size={"default"}
        onClick={() => {
          p("Sign In", { props: { provider: "Google" } });
          setLoading(true);
          const url = generateGoogleRedirectUri();
          window.location.href = url;
        }}
      >
        <GoogleIcon className="mr-1" /> Login With Google
      </Button>
    );
  }
}

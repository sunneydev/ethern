"use client";

import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { log } from "~/lib/utils";
import { getUser, skipOnboarding } from "~/server/actions/user";

const steps = [
  {
    title: "Install Ethern CLI",
    description: "Install globally on your machine",
    action: "npm install -g ethern-cli",
  },
  {
    title: "Authenticate with the CLI",
    description: "Login to your account using the CLI to publish updates",
    action: "ethern auth",
  },
  {
    title: "Publish a new update",
    description:
      "Run the following command in your React Native project directory.",
    action: "ethern",
    secondDescription:
      "Running the command for the first time will create a new project.",
    thirdDescription:
      "If project is already created, it will publish a new update.",
  },
];

export function Onboarding({
  label,
  liveReload,
}: {
  label?: string;
  liveReload?: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      if (liveReload && !(await getUser()).user.onboarded) {
        router.refresh();
      }
    }, 5 * 1000);

    return () => clearInterval(interval);
  }, [liveReload, router]);

  return (
    <div className="mx-auto flex w-fit flex-col items-center justify-center">
      <div className="flex flex-col">
        <div className="flex flex-row items-center gap-3 text-2xl font-bold">
          <span>{label ? label : "Deploy your first update"}</span>
          {liveReload ? <Spinner /> : null}
        </div>

        <div className="flex flex-row gap-2 pb-5 opacity-50">
          <span>
            Follow the steps to create a new project and publish your first
            update
          </span>
        </div>
        <div className="flex flex-row gap-5">
          <p className="text-sm text-white/50"></p>
        </div>
      </div>

      <div className="relative w-full py-6 sm:w-auto sm:py-20">
        <div className="absolute left-[6.5px] z-[-1] hidden h-[calc(100%-50px)] w-[1px] -translate-y-16 bg-gradient-to-b from-white/10 from-0% via-white/30 to-white/10 sm:block" />

        <div className="flex flex-col gap-10">
          {steps.map((step, index) => (
            <Stepper
              key={index}
              {...step}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );

  function Stepper({
    action,
    description,
    title,
    secondDescription,
    thirdDescription,
    isLast,
  }: StepperProps) {
    const [isCopied, setIsCopied] = useState(false);

    const router = useRouter();

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(action);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      } catch (error) {
        log.error(error);
      }
    };

    return (
      <div className="flex w-full">
        <div className="hidden w-12 pt-1 sm:block">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="7" cy="7" r="7" fill="black" />
            <circle cx="7" cy="7" r="4.5" stroke="white" />
          </svg>
        </div>

        <div className="w-full">
          <div className="text-xl font-bold">{title}</div>
          <div className="max-w-[calc(100%-50px)] text-sm text-white/50">
            {description}
          </div>
          <div className="text-md my-3 box-border flex h-[50px] w-full max-w-[361px] items-center justify-between rounded-sm border-[0.5px] border-white/30 px-3 py-5">
            {action}
            <button onClick={copyToClipboard}>
              {isCopied ? (
                <CheckIcon className="stroke-2 text-white/50" />
              ) : (
                <CopyIcon className="text-white/50" />
              )}
            </button>
          </div>
          <div className="text-xs text-white/50">{secondDescription}</div>
          <div className="text-xs text-white/50">{thirdDescription}</div>
          {isLast ? (
            <div className="mt-10 flex items-end justify-end sm:h-1/2">
              {liveReload ? (
                <Button
                  onClick={() => skipOnboarding().then(() => router.refresh())}
                >
                  Skip to Dashboard
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

interface StepperProps {
  title: string;
  description: string;
  action: string;
  secondDescription?: string;
  thirdDescription?: string;
  isLast?: boolean;
}

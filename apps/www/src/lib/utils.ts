import { base64url } from "./base64";
import type { User } from "@ethern/db";
import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { consts } from "~/lib/consts";
// import * as Sentry from '@sentry/nextjs'

export const s = {};

export const log = {
  // info: Sentry.captureMessage,
  // error: Sentry.captureException
  info: console.log,
  error: console.error,
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function after(
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) {
  return encodeURIComponent(`${pathname}?${params.toString()}`);
}

export function formatSizeInMB(sizeInBytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = sizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(0)} ${units[unitIndex]}`;
}

function hasProperty<T, K extends PropertyKey>(
  obj: T,
  key: K,
): obj is T & Record<K, unknown> {
  return typeof obj === "object" && obj !== null && key in obj;
}

export function notNull<T>(value: T | null | undefined): value is T {
  return value != null;
}

export function resolveError(err: unknown) {
  return {
    cause: err instanceof Error ? err.cause : undefined,
    message:
      typeof err === "string"
        ? err
        : err instanceof Error
          ? err.message
          : String(err),
    name: err instanceof Error ? err.name : "UnknownError",
    stack: err instanceof Error ? err.stack : undefined,
    code: hasProperty(err, "code") ? err.code : undefined,
    stdout: hasProperty(err, "stdout") ? err.stdout : undefined,
    stderr: hasProperty(err, "stderr") ? err.stderr : undefined,
  };
}

export function getOngoingMonthDateRange(): {
  label: string;
  dates: { start: Date; end: Date };
} {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentMonthName = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(currentDate);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const firstDayOfMonthName = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(firstDayOfMonth);
  const firstDayOfMonthDate = firstDayOfMonth.getDate();

  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  const dates = {
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  };

  return {
    label: `${firstDayOfMonthName} ${firstDayOfMonthDate} - ${currentMonthName} ${lastDayOfMonth.getDate()}`,
    dates,
  };
}

export function generateState(): string {
  const randomValues = new Uint8Array(32);
  crypto.getRandomValues(randomValues);
  return base64url.encode(randomValues, {
    includePadding: false,
  });
}

export function generateGitHubRedirectUri() {
  const url = new URL("https://github.com/login/oauth/authorize");

  const baseUrl = window.location.origin;

  url.searchParams.set("client_id", consts.github.clientId);
  url.searchParams.set("redirect_uri", `${baseUrl}/auth/github/callback`);
  url.searchParams.set("scope", "user:email");
  url.searchParams.set("state", generateState());

  return url.toString();
}

export function generateGoogleRedirectUri() {
  const url = new URL("https://accounts.google.com/o/oauth2/auth");

  const baseUrl = window.location.origin;

  url.searchParams.set("client_id", consts.google.clientId);
  url.searchParams.set("redirect_uri", `${baseUrl}/auth/google/callback`);
  url.searchParams.set("scope", "email profile");
  url.searchParams.set("state", generateState());
  url.searchParams.set("response_type", "code");

  return url.toString();
}

export function time(date: Date) {
  let timeAgo = formatDistanceToNow(date, {
    addSuffix: true,
  });

  if (timeAgo.includes("less than a minute")) {
    timeAgo = "just now";
  }

  timeAgo = timeAgo
    .replace("about ", "")
    .replace("over", "")
    .replace(" days", "d")
    .replace(" day", "d")
    .replace(" years", "y")
    .replace(" months", "m")
    .replace("1 minute", "1m")
    .replace(" minutes", "m")
    .replace(" hours", "h");

  return timeAgo;
}

export function userPlans(plan: User["plan"]): {
  storage: number;
  updates: number;
} {
  return {
    free: {
      storage: 500 * 1024 * 1024,
      updates: 1000,
    },
    starter: {
      storage: 10 * 1024 * 1024 * 1024, // 10 GB
      updates: 50_000,
    },
    pro: {
      storage: 50 * 1024 * 1024 * 1024, // 50 GB
      updates: 250_000,
    },
    admin: {
      storage: 100 * 1024 * 1024 * 1024, // 100 GB
      updates: 200000,
    },
  }[plan];
}

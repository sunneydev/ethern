import { formatDistanceToNow } from "date-fns";

function hasProperty<T extends PropertyKey>(
  obj: unknown,
  prop: T,
): obj is { [P in T]: unknown } {
  return typeof obj === "object" && obj != null && prop in obj;
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

export function nullthrows<T>(value: T | null | undefined): T {
  if (value == null) {
    throw new Error("Unexpected null or undefined");
  }

  return value;
}

export function isValue<T>(value: unknown): value is T {
  return value != null;
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
    .replace(" years", "y")
    .replace(" months", "m")
    .replace(" minutes", "m")
    .replace(" hours", "h");

  return timeAgo;
}

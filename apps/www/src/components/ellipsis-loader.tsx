import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function EllipsisLoader({
  className,
  circleClassName,
  ...props
}: ComponentProps<"div"> & {
  circleClassName?: string;
}) {
  return (
    <div className={cn("flex flex-row gap-2", className)} {...props}>
      <div
        className={cn(
          "animate-pulse-fast h-1 w-1 rounded-full bg-gray-500 delay-100",
          circleClassName,
        )}
      />
      <div
        className={cn(
          "animate-pulse-fast h-1 w-1 rounded-full bg-gray-500 delay-300",
          circleClassName,
        )}
      />
      <div
        className={cn(
          "animate-pulse-fast h-1 w-1 rounded-full bg-gray-500 delay-700",
          circleClassName,
        )}
      />
    </div>
  );
}

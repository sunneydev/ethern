import type { ComponentProps, PropsWithChildren } from "react";
import {
  Tooltip as SNTooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "~/ui/tooltip";

export function Tooltip({
  children,
  label,
  enabled,
  delayDuration,
  ...props
}: PropsWithChildren<
  {
    label?: string | React.ReactNode;
    enabled?: boolean;
    delayDuration?: number;
  } & ComponentProps<"button">
>) {
  if (enabled === false) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <SNTooltip delayDuration={delayDuration ?? 125}>
        <TooltipTrigger {...props}>{children}</TooltipTrigger>
        <TooltipContent>
          {typeof label === "string" ? <p>{label}</p> : label}
        </TooltipContent>
      </SNTooltip>
    </TooltipProvider>
  );
}

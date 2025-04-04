import * as React from "react";
import { cn } from "~/lib/utils";

export interface DividerProps {
  children: React.ReactNode;
  className?: string;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("my-3 flex items-center justify-center", className)}
      >
        <div className="flex-grow border-t border-[#323232]" />
        <span className="mx-3 flex-shrink text-[#888888]">{children}</span>
        <div className="flex-grow border-t border-[#323232]" />
      </div>
    );
  },
);

Divider.displayName = "Divider";

export { Divider };

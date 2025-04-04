import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function StackIcon(
  props: ComponentProps<"svg"> & { selected?: boolean },
) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.00052 8.385L1 10.0005L4.00052 11.616L8.0005 13.77L12.0005 11.616L15.001 10.0005L12.0005 8.385M4.00052 8.385L8.0005 10.539L12.0005 8.385M4.00052 8.385L1 6.7695L8.0005 3L15.001 6.7695L12.0005 8.385"
        className={cn("stroke-[#B4B4B4]", {
          "stroke-white": props.selected,
        })}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

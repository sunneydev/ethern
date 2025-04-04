import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function CardIcon(
  props: ComponentProps<"svg"> & {
    selected?: boolean;
  },
) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className=""
      {...props}
    >
      <path
        d="M3.15385 10H5.30769H7.46154M3.15385 11.6154H5.30769M1 6.23077H15H8H1ZM2.61538 13.7692H13.3846C13.813 13.7692 14.2239 13.599 14.5269 13.2961C14.8298 12.9932 15 12.5823 15 12.1538V4.61538C15 4.18696 14.8298 3.77608 14.5269 3.47314C14.2239 3.17019 13.813 3 13.3846 3H2.61538C2.18696 3 1.77608 3.17019 1.47314 3.47314C1.17019 3.77608 1 4.18696 1 4.61538V12.1538C1 12.5823 1.17019 12.9932 1.47314 13.2961C1.77608 13.599 2.18696 13.7692 2.61538 13.7692Z"
        className={cn("stroke-[#B4B4B4]", {
          "stroke-white": props.selected,
        })}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

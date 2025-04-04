import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function EthernLogo({
  logoOnly,
  textProps: { className: textClassName, ...textProps } = {},
  ...props
}: ComponentProps<"a"> & {
  logoOnly?: boolean;
  to?: string;
  textProps?: ComponentProps<"p">;
}) {
  if (!props.to) {
    return (
      <div className="flex flex-row items-center gap-1 group-hover:brightness-125">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.4007 8.62219C18.153 8.49443 17.8452 8.49443 17.5975 8.62219L8.91336 13.1007C8.673 13.2246 8.52552 13.4502 8.52552 13.6938C8.52552 13.9375 8.673 14.163 8.91336 14.287L17.5975 18.7655C17.8452 18.8932 18.153 18.8932 18.4007 18.7655L27.0848 14.287C27.3252 14.163 27.4727 13.9375 27.4727 13.6938C27.4727 13.4502 27.3252 13.2246 27.0848 13.1007L18.4007 8.62219ZM17.9991 17.372L10.8668 13.6938L17.9991 10.0157L25.1313 13.6938L17.9991 17.372ZM8.63532 17.8218C8.85713 17.4942 9.34124 17.3855 9.7166 17.5791L17.9991 21.8504L26.2816 17.5791C26.6569 17.3855 27.141 17.4942 27.3628 17.8218C27.5846 18.1494 27.4602 18.5719 27.0848 18.7655L18.4007 23.244C18.153 23.3717 17.8452 23.3717 17.5975 23.244L8.91336 18.7655C8.538 18.5719 8.4135 18.1494 8.63532 17.8218ZM8.63531 21.9557C8.85713 21.6281 9.34123 21.5196 9.7166 21.713L17.9991 25.9844L26.2816 21.713C26.6569 21.5196 27.141 21.6281 27.3628 21.9557C27.5846 22.2834 27.4602 22.7059 27.0848 22.8995L18.4007 27.3779C18.153 27.5057 17.8452 27.5057 17.5975 27.3779L8.91336 22.8995C8.53798 22.7059 8.4135 22.2834 8.63531 21.9557Z"
            fill="white"
          />
          <rect
            x="0.75"
            y="0.75"
            width="34.5"
            height="34.5"
            rx="9.25"
            strokeWidth="1.5"
            className="stroke-muted-foreground"
          />
        </svg>

        {logoOnly ? null : (
          <p
            className={cn(
              textClassName,
              "ml-1 text-lg font-semibold text-white/80 group-hover:brightness-125",
            )}
            {...textProps}
          >
            ETHERN
          </p>
        )}
      </div>
    );
  }

  return (
    <Link
      className="flex flex-row items-center gap-1 px-2 group-hover:brightness-125"
      {...props}
      passHref
      href={props.to}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.4007 8.62219C18.153 8.49443 17.8452 8.49443 17.5975 8.62219L8.91336 13.1007C8.673 13.2246 8.52552 13.4502 8.52552 13.6938C8.52552 13.9375 8.673 14.163 8.91336 14.287L17.5975 18.7655C17.8452 18.8932 18.153 18.8932 18.4007 18.7655L27.0848 14.287C27.3252 14.163 27.4727 13.9375 27.4727 13.6938C27.4727 13.4502 27.3252 13.2246 27.0848 13.1007L18.4007 8.62219ZM17.9991 17.372L10.8668 13.6938L17.9991 10.0157L25.1313 13.6938L17.9991 17.372ZM8.63532 17.8218C8.85713 17.4942 9.34124 17.3855 9.7166 17.5791L17.9991 21.8504L26.2816 17.5791C26.6569 17.3855 27.141 17.4942 27.3628 17.8218C27.5846 18.1494 27.4602 18.5719 27.0848 18.7655L18.4007 23.244C18.153 23.3717 17.8452 23.3717 17.5975 23.244L8.91336 18.7655C8.538 18.5719 8.4135 18.1494 8.63532 17.8218ZM8.63531 21.9557C8.85713 21.6281 9.34123 21.5196 9.7166 21.713L17.9991 25.9844L26.2816 21.713C26.6569 21.5196 27.141 21.6281 27.3628 21.9557C27.5846 22.2834 27.4602 22.7059 27.0848 22.8995L18.4007 27.3779C18.153 27.5057 17.8452 27.5057 17.5975 27.3779L8.91336 22.8995C8.53798 22.7059 8.4135 22.2834 8.63531 21.9557Z"
          fill="white"
        />
        <rect
          x="0.75"
          y="0.75"
          width="34.5"
          height="34.5"
          rx="9.25"
          strokeWidth="1.5"
          className="stroke-muted-foreground"
        />
      </svg>

      {logoOnly ? null : (
        <p
          className={cn(
            textClassName,
            "text-foreground ml-1 text-lg font-semibold group-hover:brightness-125",
          )}
          {...textProps}
        >
          ETHERN
        </p>
      )}
    </Link>
  );
}

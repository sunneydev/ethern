import { cn } from "~/lib/utils";

export function DotPattern({ className }: { className: string }) {
  return (
    <div className="mx-auto flex">
      <div
        className={cn(
          "absolute top-0 bottom-0 left-0 right-0 -z-50 m-2",
          className,
        )}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full fill-white/20 [mask-image:linear-gradient(to_bottom,white,transparent,transparent)] dark:opacity-40"
        >
          <defs>
            <pattern
              id=":Rab4m:"
              width="15"
              height="15"
              patternUnits="userSpaceOnUse"
              patternContentUnits="userSpaceOnUse"
              x="0"
              y="0"
            >
              <circle id="pattern-circle" cx="1" cy="1" r="1"></circle>
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth="0"
            fill="url(#:Rab4m:)"
          ></rect>
        </svg>
      </div>
    </div>
  );
}

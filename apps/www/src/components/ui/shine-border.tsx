"use client";

import { cn } from "~/lib/utils";

type TColorProp = string | string[];

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  children: React.ReactNode;
}

export default function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = [
    "rgba(255,255,255,0.1)",
    "rgba(255,255,255,0.2)",
    "rgba(255,255,255,0.1)",
  ],
  className,
  children,
}: ShineBorderProps) {
  const gradientColors = Array.isArray(color) ? color.join(",") : color;

  return (
    <div
      style={
        {
          "--border-radius": `${borderRadius}px`,
          "--border-width": `${borderWidth}px`,
          "--duration": `${duration}s`,
          "--gradient-colors": gradientColors,
        } as React.CSSProperties
      }
      className={cn(
        "relative min-h-[60px] w-fit min-w-[300px] place-items-center",
        "rounded-[--border-radius] bg-transparent p-[1px]",
        "before:absolute before:inset-[-1px]",
        "before:rounded-[calc(var(--border-radius)+1px)]",
        "before:bg-[linear-gradient(115deg,transparent,var(--gradient-colors),transparent)]",
        "before:bg-[length:200%_100%]",
        "before:animate-shine",
        "after:absolute after:inset-0",
        "after:rounded-[var(--border-radius)]",
        "after:bg-background",
        "border border-zinc-800/20",
        "backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

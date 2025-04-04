import { cn } from "~/lib/utils";

export interface SkeletonProps {
  className?: string;

  height: number;
  width: number;
}

export function Skeleton({ className, height, width }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse-fast rounded-md bg-white/30", className)}
      style={{ height: `${height}px`, width: `${width}px` }}
    />
  );
}

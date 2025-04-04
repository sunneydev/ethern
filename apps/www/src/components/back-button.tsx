"use client";

import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export function BackButton({ label }: { label?: string }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.back()}
      className="group flex cursor-pointer flex-row items-center justify-center gap-1"
    >
      <ChevronLeftIcon className="size-4 text-white/50 transition-colors group-hover:text-white" />
      <span className="line-clamp-1 w-full text-sm font-light text-white/50 transition-colors group-hover:text-white">
        {label}
      </span>
    </div>
  );
}

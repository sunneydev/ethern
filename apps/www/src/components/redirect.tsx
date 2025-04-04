"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface RedirectProps {
  to: string;
  withAfter?: boolean;
}

export function Redirect({ to, withAfter }: RedirectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  useEffect(() => {
    if (!router || !to || !pathname || !params) return;

    if (withAfter) {
      const encodedAfter = encodeURIComponent(
        `${pathname}?${params.toString()}`,
      );
      router.push(`${to}?after=${encodedAfter}`);
      return;
    }

    router.push(to);
  }, [router, to, pathname, params, withAfter]);

  return null;
}

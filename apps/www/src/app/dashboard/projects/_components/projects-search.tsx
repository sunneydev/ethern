"use client";

import { AddNew } from "./add-new";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "~/ui/input";

export function ProjectsSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    if (search) {
      router.push(`${pathname}?search=${encodeURIComponent(debouncedSearch)}`);
    } else {
      router.push(pathname);
    }
  }, [debouncedSearch]);

  return (
    <div className="flex items-center gap-4">
      <div className="focus-within:ring-ring/30 flex w-full items-center gap-0 rounded-md border border-white/10 bg-[#101010] px-4 focus-within:ring-1">
        <MagnifyingGlassIcon className="h-4 w-4 fill-current text-[#7F7F7F]" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-none bg-transparent text-xs outline-none ring-0 ring-red-500 placeholder:text-[#7F7F7F] focus-visible:ring-0"
          type="text"
          placeholder="Search Projects"
        />
      </div>
      <AddNew />
    </div>
  );
}

"use client";

import { User } from "@ethern/db";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, useState, useEffect, useMemo } from "react";
import { XIcon } from "~/components/icons/x-icon";
import { UserDropdown } from "~/components/user-dropdown";
import { fixtures } from "~/lib/fixtures";
import { cn } from "~/lib/utils";

export function MobileNavbar({
  user,
  to,
}: ComponentProps<"div"> & {
  user?: Pick<User, "username" | "email" | "avatarUrl" | "plan">;
  to: string;
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = useMemo(() => {
    if (user) {
      return fixtures.pages;
    }

    return [];
  }, [user]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <div>
        {!isOpen ? (
          <HamburgerMenuIcon
            onClick={() => setIsOpen(!isOpen)}
            className="h-6 w-6 cursor-pointer"
          />
        ) : (
          <XIcon
            onClick={() => setIsOpen(!isOpen)}
            className="h-6 w-6 cursor-pointer text-white/40"
          />
        )}
      </div>
      <div
        className={cn(
          "fixed left-0 top-0 z-[999] mt-[73px] flex h-[calc(100vh-72px)] w-full flex-col justify-between bg-black",
          { hidden: !isOpen },
        )}
      >
        <ul
          className="divide-text-white-10 flex h-full flex-col divide-y whitespace-nowrap pt-0 sm:p-8 sm:pt-0"
          id="mobile-menu"
        >
          {user ? <UserDropdown user={user} className="p-6" /> : null}
          {links.map((page) => (
            <Link
              key={page.name}
              href={page.href}
              className={cn(
                "hover hover:bg-white-10 group flex cursor-pointer items-center justify-between p-6 text-white/80 hover:text-white [&>li>svg>path]:hover:stroke-white",
                { "text-white": page.href === pathname },
              )}
            >
              <li className="flex items-center gap-4">
                <page.icon selected={page.href === pathname} />
                <span>{page.name}</span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
}

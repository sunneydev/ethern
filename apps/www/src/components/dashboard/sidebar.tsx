"use client";

import { User } from "@ethern/db";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CardIcon } from "~/components/icons/card-icon";
import { DashboardIcon } from "~/components/icons/dashboard-icon";
import { FolderIcon } from "~/components/icons/folder-icon";
import { SettingsIcon } from "~/components/icons/settings-icon";
import { StackIcon } from "~/components/icons/stack-icon";
import { cn } from "~/lib/utils";
import { getUser } from "~/server/actions/user";

const pages = [
  {
    name: "Overview",
    href: "/dashboard/overview",
    icon: ({ selected }: { selected: boolean }) => (
      <DashboardIcon selected={selected} className="size-6 scale-125" />
    ),
  },

  { name: "Projects", href: "/dashboard/projects", icon: FolderIcon },
  {
    name: "Updates",
    href: "/dashboard/updates",
    icon: StackIcon,
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: CardIcon,
  },
  { name: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  if (pathname.includes("/projects/")) {
    return null;
  }

  return (
    <div className="mr-6 hidden h-full max-h-[500px] min-h-[500px] shrink-0 flex-col justify-between sm:flex sm:w-[215px]">
      <div
        className={cn(
          "flex flex-row justify-between gap-x-4 gap-y-2 px-4 text-center sm:flex-col sm:px-6 sm:pl-0 sm:text-left",
        )}
      >
        {pages.map((page) => (
          <Link
            key={page.name}
            href={page.href}
            className={cn(
              "flex h-max flex-col items-center justify-center gap-3 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
              "sm:h-10 sm:flex-row sm:justify-start sm:px-4 sm:text-sm",
              {
                "bg-[rgb(24,24,24)] [&>svg]:text-white": page.href === pathname,
                "hover:bg-white-10 text-white/75 hover:text-white [&>svg>path]:hover:stroke-white":
                  page.href !== pathname,
              },
            )}
          >
            <page.icon className="size-6" selected={page.href === pathname} />
            <span
              className={cn(
                ["line-clamp-1 w-full text-base font-normal", "tracking-wide"],
                { "text-white": page.href === pathname },
              )}
            >
              {page.name}
            </span>
          </Link>
        ))}
      </div>

      {/* <div className="flex flex-col gap-3 px-6 text-sm font-medium text-[#a1a1aa]">
				<HelpDialog email={user?.email} username={user?.username} />
				<Link
					href={'https://discord.gg/sPgAApwC'}
					target="_blank"
					className="flex flex-row items-center gap-2 transition-colors hover:text-white"
				>
					<DiscordLogoIcon />
					<span>Discord Server</span>
				</Link>
			</div> */}
    </div>
  );
}

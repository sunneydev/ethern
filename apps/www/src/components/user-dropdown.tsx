"use client";

import type { User } from "@ethern/db";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { signOut } from "~/lib/api";
import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/ui/dropdown-menu";

export interface UserDropdownProps {
  user: Pick<User, "username" | "email" | "avatarUrl" | "plan">;
  className?: string;
}

export function UserDropdown({ user, className }: UserDropdownProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex flex-row items-center justify-start gap-3 outline-none",
          className,
        )}
      >
        <div className="flex w-full flex-row-reverse items-center justify-between gap-2 sm:w-auto sm:flex-row sm:justify-normal">
          <Avatar className="h-[36px] w-[36px]">
            {user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={user.username} />
            ) : null}
            <AvatarFallback>{user.username[0].toUpperCase()} </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-start group-hover:brightness-125">
            <div className="flex flex-row items-center gap-2 font-semibold text-white/80">
              <span>{user.username}</span>
              <Plan plan={user.plan} />
            </div>
            <div className="text-xs text-white/45">{user.email}</div>
          </div>
        </div>
        <ChevronDownIcon className="group-hover:brightness-125" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/5 backdrop-blur-xl">
        <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut().then(() => router.refresh())}
          className="flex flex-row items-center justify-start gap-2 text-red-500"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Plan = ({ plan }: { plan: User["plan"] }) => {
  const color = {
    free: "bg-white-10 text-white/50",
    starter: "bg-[#C9F66F] text-black",
    pro: "bg-[#828FFF] text-black",
    admin: "bg-[#FF8A5B] text-black",
  }[plan];

  const planUppercase = plan[0].toUpperCase() + plan.slice(1);

  return (
    <span
      className={cn(
        "bg-white-10 mb-[0.5px] rounded-[6px] px-2 py-1 text-xs text-white/50",
        color,
      )}
    >
      {planUppercase}
    </span>
  );
};

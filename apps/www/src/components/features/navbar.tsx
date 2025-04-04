import type { User } from "@ethern/db";
import type { ComponentProps } from "react";
import { EthernLogo } from "~/components/ethern-logo";
import { MobileNavbar } from "~/components/features/mobile-navbar";
import { UserDropdown } from "~/components/user-dropdown";
import { cn } from "~/lib/utils";

export function Navbar({
  user,
  to,
  children,
  mobileDisabled,
  className,
  ...props
}: ComponentProps<"div"> & {
  user?: User;
  to: string;
  mobileDisabled?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-white-10 sticky top-0 z-10 flex h-[72px] w-full items-center border-b",
        "p-4 backdrop-blur-xl 2xl:pl-[calc(100vw-100%)]",
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-6xl flex-row items-center justify-between md:px-10 xl:mx-auto",
          className,
        )}
        {...props}
      >
        <div className="flex w-full items-center justify-between">
          <EthernLogo to={to} />
          <div className="hidden sm:block">
            {user ? <UserDropdown user={user} /> : null}
          </div>

          {mobileDisabled ? null : (
            <div className="sm:hidden">
              <MobileNavbar user={user} to={to} />
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

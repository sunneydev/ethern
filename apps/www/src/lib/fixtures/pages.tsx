import { StackIcon } from "@radix-ui/react-icons";
import { CardIcon } from "~/icons/card-icon";
import { DashboardIcon } from "~/icons/dashboard-icon";
import { FolderIcon } from "~/icons/folder-icon";
import { SettingsIcon } from "~/icons/settings-icon";

export const pages = [
  {
    name: "Overview",
    href: "/dashboard/overview",
    icon: ({ selected }: { selected: boolean }) => (
      <DashboardIcon
        selected={selected}
        className="ml-[-4px] mr-[-5px] size-6"
      />
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

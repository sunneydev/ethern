import { Update } from "@ethern/db";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { AndroidIcon } from "~/components/icons/android-icon";
import { IosIcon } from "~/components/icons/ios-icon";
import { Tooltip } from "~/components/tooltip";
import { time } from "~/lib/utils";
import { Button } from "~/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/ui/dropdown-menu";

interface UpdateCardProps {
  project: {
    projectId: string;
    name: string;
  };
  update: Update;
  isLatest?: boolean;
}

export function ActiveUpdateIndicator() {
  return (
    <Tooltip label="This update is currently active and being served to your users.">
      <div className="flex cursor-pointer flex-row">
        <h4 className="flex h-fit items-center justify-center gap-2 self-center px-3 py-2 text-sm text-white/70">
          <div className="h-2 w-2 rounded-full bg-green-300" />
          Active
        </h4>
      </div>
    </Tooltip>
  );
}

export function UpdateCard({ update, isLatest, project }: UpdateCardProps) {
  const timeAgo = time(update.createdAt);

  return (
    <div className="flex flex-row justify-between gap-12 rounded-sm border border-white/15 p-3">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-3">
          <div className="flex h-full w-12 flex-col">
            <span className="text-xs text-white/55">Name</span>
            <span className="text-white/75">{update.name}</span>
          </div>
        </div>
      </div>
      <div className="flex h-[40px] flex-row items-center gap-6 [&>div>span]:text-xs [&>div]:justify-between">
        {isLatest ? (
          <div className="flex h-full flex-col">
            <span className="text-left text-xs text-white/55">Status</span>
            <div className="flex flex-row items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-300" />
              <span className="text-xs text-white/75">Active</span>
            </div>
          </div>
        ) : null}
        <div className="flex h-full flex-col">
          <span className="text-xs text-white/55">Project</span>
          <span className="text-xs text-white/75">{project.name}</span>
        </div>
        <div className="flex h-full flex-col">
          <span className="text-xs text-white/55">Runtime Version</span>
          <span className="text-white/75">{update.runtimeVersion}</span>
        </div>
        <div className="flex h-full flex-col">
          <span className="text-xs text-white/55">Platforms</span>
          <div className="flex flex-row gap-2">
            {update.platform === "all" ? (
              <>
                <AndroidIcon className="size-5 text-white/55" />
                <IosIcon className="size-5 text-white/55" />
              </>
            ) : update.platform === "ios" ? (
              <IosIcon className="size-5 text-white/55" />
            ) : (
              <AndroidIcon className="size-5 text-white/55" />
            )}
          </div>
        </div>
        <div className="flex h-full flex-col">
          <span className="text-xs text-white/55">Created</span>
          <span className="text-white/75">{timeAgo}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-lg p-3 hover:bg-white/10">
            <DotsVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={5}>
            <DropdownMenuItem>
              <Button variant="destructive">Delete</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

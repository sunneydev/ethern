"use client";

import type { Update } from "@ethern/db";
import { time } from "@ethern/utils";
import { DotsVerticalIcon, UploadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";
import { ActiveUpdateIndicator } from "~/components/features/update-card";
import { AndroidIcon } from "~/components/icons/android-icon";
import { IosIcon } from "~/components/icons/ios-icon";
import { Tooltip } from "~/components/tooltip";
import { promoteUpdate as promoteUpdateAction } from "~/server/actions/update";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/ui/alert-dialog";
import { Button } from "~/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/ui/table";

export function UpdatesTable({
  updates,
}: {
  updates: Array<
    Update & { isActive?: boolean; project?: string; hashId?: string }
  >;
}) {
  const [promoteUpdate, setPromoteUpdate] = useState<string | null | undefined>(
    null,
  );
  const [deleteModal, setDeleteModal] = useState(false);

  const hasProjects = updates.every((update) => update.project != null);

  if (!updates.length) {
    return (
      <div className="w-full">
        <div className="border-white-10 relative min-h-[512px] w-full max-w-6xl rounded-sm border text-white">
          <Table className="basis-2/3 bg-black">
            <TableHeader>
              <TableRow className="[&>th]:text-sm">
                <TableHead className="ml-2 text-left">Name</TableHead>
                {hasProjects ? <TableHead>Project</TableHead> : null}
                <TableHead>Runtime Version</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-lg text-white/50">
            No updates found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="border-white-10 min-h-[512px] w-full max-w-6xl rounded-sm border text-white">
        <Table className="basis-2/3 bg-black">
          <TableHeader>
            <TableRow className="[&>th]:text-sm">
              <TableHead className="ml-2 text-left">ID</TableHead>
              <TableHead>Name</TableHead>
              {hasProjects ? <TableHead>Project</TableHead> : null}
              <TableHead>Runtime Version</TableHead>
              <TableHead>Platforms</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {updates.map((update, i) => (
              <TableRow key={update.id} className="[&>td] text-white/70">
                <TableCell className="text-left font-normal">
                  {update.hashId}
                </TableCell>

                <TableCell>{update.name}</TableCell>

                {hasProjects ? (
                  <TableCell>
                    <Link
                      href={`/dashboard/projects/${update.project}`}
                      className="font-semibold text-white hover:underline"
                    >
                      {update.project}
                    </Link>
                  </TableCell>
                ) : null}
                <TableCell>{update.runtimeVersion}</TableCell>

                <TableCell>
                  <Platform platform={update.platform} />
                </TableCell>

                <TableCell>{time(update.createdAt)}</TableCell>

                <TableCell className="flex h-full items-center justify-center">
                  {update.isActive ? <ActiveUpdateIndicator /> : null}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <DotsVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Tooltip
                        className="w-full cursor-default"
                        label={
                          update.isActive
                            ? "This update is already active"
                            : "Promote this update to the latest version"
                        }
                        delayDuration={0}
                      >
                        <DropdownMenuItem
                          disabled={update.isActive}
                          onClick={() => setPromoteUpdate(update.id)}
                          className="flex h-full w-full flex-row items-center justify-between"
                        >
                          Promote
                          <UploadIcon className="size-4" />
                        </DropdownMenuItem>
                      </Tooltip>

                      <DropdownMenuItem
                        onClick={() => setDeleteModal(true)}
                        className="flex flex-row text-red-500 focus:text-red-400"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog
        open={promoteUpdate != null}
        onOpenChange={(open) =>
          setPromoteUpdate(open ? promoteUpdate : undefined)
        }
      >
        <AlertDialogTrigger className="flex flex-row items-center justify-center gap-2 px-3"></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogHeader>
              <AlertDialogHeader>
                <AlertDialogTitle>Promote Update</AlertDialogTitle>
                <AlertDialogDescription>
                  This update will become the latest version for your users.
                  Please review the changes before proceeding.
                </AlertDialogDescription>
              </AlertDialogHeader>
            </AlertDialogHeader>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setPromoteUpdate(undefined);
                promoteUpdate != null
                  ? promoteUpdateAction(promoteUpdate)
                  : null;
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteModal} onOpenChange={setDeleteModal}>
        <AlertDialogTrigger className="flex flex-row items-center justify-center gap-2 px-3"></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  function Platform({ platform }: { platform: string }) {
    return platform === "all" ? (
      <div className="flex flex-row items-center justify-center gap-2">
        <AndroidIcon className="size-5 text-white/55" />
        <IosIcon className="size-5 text-white/55" />
      </div>
    ) : platform === "ios" ? (
      <IosIcon className="size-5 text-white/55" />
    ) : (
      <AndroidIcon className="size-5 text-white/55" />
    );
  }
}

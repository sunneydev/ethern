"use client";

import { Update, UpdateWithProjectName } from "@ethern/db";
import { hashUpdateId } from "@ethern/utils/hashUpdateId";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";
import { Avatar } from "~/components/avatar";
import { updatesTest } from "~/lib/fixtures/updates-test";
import { cn } from "~/lib/utils";
import { ScrollArea } from "~/ui/scroll-area";
import { Skeleton } from "~/ui/skeleton";

export interface UpdatesProps {
  updates: UpdateWithProjectName[];
  isLoading?: boolean;
}

export function Updates(props: UpdatesProps) {
  const updates = useMemo(
    () =>
      props.isLoading
        ? [
            {
              id: "1",
              createdAt: new Date(),
              name: crypto.randomUUID(),
              project: { name: crypto.randomUUID() },
            } as UpdatesProps["updates"][0],
          ]
        : props.updates.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          ),
    [props.updates, props.isLoading],
  );

  return (
    <div className="border-border min-h-[300px] max-h-[300px] text-card-foreground flex flex-col justify-between overflow-hidden rounded-xl border bg-black shadow">
      <div>
        <div className="border-white-10 border-b p-6 py-4">
          <h1 className="text-lg font-bold tracking-tighter">Updates</h1>
          <p className="text-sm text-white/50">Recent updates</p>
        </div>
        {updates.length > 0 ? (
          <ScrollArea className="flex h-[215px] max-h-[215px] w-full flex-col items-start justify-start px-0 py-0 pb-0">
            {updates.map((update, i) => (
              <UpdateRow
                {...update}
                key={update.id}
                project={update.project}
                last={i === updatesTest.length - 1}
              />
            ))}
          </ScrollArea>
        ) : (
          <div className="flex h-[200px] w-full items-center justify-center">
            <p className="pb-4 text-white/50">No Updates found</p>
          </div>
        )}
      </div>
    </div>
  );

  function UpdateRow({
    id,
    name,
    createdAt,
    project: { name: projectName },
    last,
  }: Update & { last?: boolean; project: { name: string } }) {
    const createdAtFormatted = formatDistanceToNow(createdAt, {
      addSuffix: true,
    });

    const hashedUpdateId = useMemo(() => hashUpdateId(id), [id]);

    return (
      <Link
        href={`/dashboard/updates?project=${projectName}`}
        className={cn(
          "border-b-white-10 flex h-[72px] w-full flex-row items-center justify-between border-b px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-white/5",
          { "rounded-b-sm border-none pb-2": last },
        )}
      >
        <div className="flex flex-row items-center justify-center gap-3 py-2">
          {props.isLoading ? (
            <Skeleton height={40} width={40} />
          ) : (
            <Avatar name={projectName} />
          )}
          <div
            className={cn("flex flex-col items-start", {
              "gap-1": props.isLoading,
            })}
          >
            {props.isLoading ? (
              <>
                <Skeleton height={16} width={80} />
                <Skeleton height={16} width={200} />
              </>
            ) : (
              <>
                <div className="text-foreground font-bold flex flex-row items-center gap-[0px]">
                  <p>{name}</p>
                  <p>&nbsp;·&nbsp;</p>
                  <p
                    className="text-white/50 
                    text-xs
                    h-full
                    flex items-center justify-center
                    "
                    style={{ fontFamily: "monospace" }}
                  >
                    {hashedUpdateId}
                  </p>
                </div>
                <div className="flex flex-row gap-[5px] text-xs text-white/50">
                  <p>{projectName}</p>
                  <p>&nbsp;·&nbsp;</p>
                  <p>{createdAtFormatted}</p>
                </div>
              </>
            )}
          </div>
        </div>
        <ChevronRightIcon className="h-4 w-4 text-white/40" />
      </Link>
    );
  }
}

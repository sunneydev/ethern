"use client";

import { Skeleton } from "../ui/skeleton";
import type { ProjectWithUpdates, Update } from "@ethern/db";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Avatar } from "~/components/avatar";
import { projectesTest } from "~/lib/fixtures/updates-test";
import { cn, formatSizeInMB } from "~/lib/utils";
import { ScrollArea } from "~/ui/scroll-area";

export interface ProjectsProps {
  projects: Array<ProjectWithUpdates>;
  isLoading?: boolean;
}

const loadingProjects = [
  {
    id: 1,
    createdAt: new Date(),
    size: 0,
    updates: [] as Update[],
  } as ProjectWithUpdates,
];

export function Projects({ projects, isLoading }: ProjectsProps) {
  return (
    <div className="border-border min-h-[300px] max-h-[300px] text-card-foreground flex flex-col justify-between overflow-hidden rounded-xl border bg-black shadow">
      <div>
        <div className="border-white-10 border-b p-6 py-4">
          <h1 className="text-lg font-bold tracking-tighter">Projects</h1>
          <p className="text-sm text-white/50">Recent Projects</p>
        </div>
        {projects.length > 0 || isLoading ? (
          <ScrollArea className="flex h-[216px] max-h-[216px] w-full flex-col items-start justify-start px-0 py-0 pb-0">
            {(isLoading ? loadingProjects : projects).map((project, i) => (
              <ProjectRow
                {...project}
                key={project.id}
                last={i === projectesTest.length - 1}
              />
            ))}
          </ScrollArea>
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center">
            <p className="pb-4 text-white/50">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );

  function ProjectRow({
    name,
    last,
    size: sizeInBytes,
    updates,
  }: ProjectWithUpdates & { last: boolean }) {
    const size = formatSizeInMB(sizeInBytes);

    return (
      <Link
        key={name}
        href={`/dashboard/projects/${name}`}
        className={cn(
          "border-b-white-10 flex h-[72px] w-full flex-row items-center justify-between border-b px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-white/5",
          { "rounded-b-sm border-b border-b-white-10": last },
        )}
      >
        <div className="flex flex-row items-center justify-center gap-3 py-2">
          {isLoading ? (
            <Skeleton height={40} width={40} />
          ) : (
            <Avatar name={name} />
          )}
          <div
            className={cn("flex flex-col items-start", { "gap-1": isLoading })}
          >
            {isLoading ? (
              <>
                <Skeleton height={16} width={107} />
                <Skeleton height={16} width={150} />
              </>
            ) : (
              <>
                <div className="text-foreground font-bold">{name}</div>
                <div className="flex flex-row gap-[5px] text-xs text-white/50">
                  <p>{size}</p>
                  <p>•</p>
                  <p>{updates.length} updates</p>
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

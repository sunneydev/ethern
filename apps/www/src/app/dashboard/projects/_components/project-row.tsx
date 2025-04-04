import type { Project } from "@ethern/db";
import Link from "next/link";
import { Avatar } from "~/components/avatar";
import { Skeleton } from "~/components/ui/skeleton";

export function ProjectRow({
  timeAgo,
  project,
  updateCounts,
}: {
  timeAgo: string;
  project: Project;
  updateCounts: Record<number, number>;
}) {
  return (
    <Link
      href={`/dashboard/projects/${project.name}`}
      key={project.id}
      className="flex w-full items-center justify-between rounded-md border border-white/15 p-4 hover:bg-white/5"
    >
      <div className="flex items-center gap-4">
        <Avatar name={project.name} />
        <div className="flex flex-col">
          <span className="text-sm font-bold">{project.name}</span>
          <span className="text-xs text-white/50">{project.uid}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="hidden items-center gap-1 text-white/50 sm:flex">
          <div className="w-20 max-w-[60px] text-center">{timeAgo}</div>
          <div className="h-[3px] w-[3px] rounded-full bg-[#6B6B6B]" />
          <div className="w-20 text-center">
            {updateCounts[project.id] ?? 0} updates
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProjectRowLoading() {
  return (
    <div className="flex w-full items-center justify-between rounded-md border border-white/15 p-4 hover:bg-white/5">
      <div className="flex items-center gap-4">
        <Skeleton height={40} width={40} />
        <div className="flex flex-col gap-1">
          <Skeleton height={14} width={107} />
          <Skeleton height={12} width={150} />
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="hidden items-center gap-1 text-white/50 sm:flex">
          <div className="w-20 max-w-[60px] text-center">
            <Skeleton height={16} width={50} />
          </div>
          <div className="h-[3px] w-[3px] rounded-full bg-[#6B6B6B]" />
          <div className="ml-3 w-20 max-w-[60px] text-center">
            <Skeleton height={16} width={50} />
          </div>
        </div>
      </div>
    </div>
  );
}

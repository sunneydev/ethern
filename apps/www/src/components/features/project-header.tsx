import { Avatar } from "~/components/avatar";
import { formatSizeInMB, time } from "~/lib/utils";

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    size: number;
  };
  user: {
    username: string;
  };
  updates: {
    id: string;
    createdAt: Date;
  }[];
}

export function ProjectHeader({ project, user, updates }: ProjectHeaderProps) {
  const [latestUpdate] = updates;

  const timeAgo = latestUpdate ? time(latestUpdate.createdAt) : "Never";

  return (
    <div className="flex h-full w-full flex-col items-start justify-between gap-4 sm:flex-row">
      <div className="flex w-full cursor-pointer flex-col gap-4">
        <div className="flex flex-row gap-2">
          <Avatar name={project.name} className="h-[48.02px] w-[48.02px]" />

          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <span className="text-xs text-white/55">{`@${user.username}/${project.name}`}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4 sm:flex-col">
        <div className="flex flex-col">
          <span className="text-xs text-white/55">Total Size</span>
          <span className="text-sm text-white/85">
            {formatSizeInMB(project.size)}
          </span>
        </div>
        <div className="flex w-32 flex-col">
          <p className="text-xs text-white/55">Last Updated</p>
          <span className="text-sm text-white/85">
            {latestUpdate ? timeAgo : "Never"}
          </span>
        </div>
      </div>
    </div>
  );
}

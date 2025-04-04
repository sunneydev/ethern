import { hash } from "@ethern/utils/crypto";
import { UpdatesTable } from "~/app/dashboard/updates/updates-table";
import { BackButton } from "~/components/back-button";
import { ProjectHeader } from "~/components/features/project-header";
import { getSession } from "~/server";
import { repository } from "~/server/db";

export default async function Page(props: {
  params: Promise<{ project: string }>;
}) {
  const params = await props.params;
  const { user } = await getSession();
  const { project: projectName } = params;

  const project = await repository.projects.findBy({
    uid: `@${user.username}/${decodeURIComponent(projectName)}`,
  });

  if (!project) {
    return <div>project not found</div>;
  }

  const updates = await Promise.all(
    await repository.updates
      .findMany({ projectId: project.id })
      .then((updates) =>
        updates.map(async (update) => ({
          ...update,
          hashId: await hash(update.id, "hex").then((r) => r.slice(0, 6)),
          isActive: update.id === updates[0].id,
        })),
      ),
  );

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full max-w-7xl flex-col gap-4 p-3">
        <BackButton label="Back to Projects" />
        <ProjectHeader
          project={{ ...project, id: project.projectId }}
          user={user}
          updates={updates}
        />

        <div className="flex w-full flex-row justify-between gap-4">
          <div className="flex w-full flex-col gap-4 rounded-md">
            <h1 className="text-sm font-bold text-white">Updates</h1>
            <UpdatesTable updates={updates} />
          </div>
        </div>
      </div>
    </div>
  );
}

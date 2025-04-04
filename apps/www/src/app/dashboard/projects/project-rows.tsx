import * as schema from "@ethern/db";
import { time } from "@ethern/utils";
import { count, inArray, and, eq } from "drizzle-orm";
import { ProjectRow } from "~/app/dashboard/projects/_components/project-row";
import { getSession } from "~/server";
import { db } from "~/server/db";

export async function ProjectRows({ search }: { search?: string }) {
  const { user } = await getSession();

  const projects = await db.query.projects.findMany({
    where: (projects, { eq, and, like }) => {
      if (search) {
        return and(
          eq(projects.ownerId, user.id),
          like(projects.name, `%${search}%`),
        );
      }

      return eq(projects.ownerId, user.id);
    },
  });

  const updatesCount = projects.length
    ? await db
        .select({
          updates: count(schema.updates.id),
          projectId: schema.projects.id,
        })
        .from(schema.updates)
        .leftJoin(
          schema.projects,
          eq(schema.updates.projectId, schema.projects.id),
        )
        .where(
          and(
            eq(schema.projects.ownerId, user.id),
            inArray(
              schema.updates.projectId,
              projects.map((p) => p.id),
            ),
          ),
        )
        .groupBy(schema.projects.id)
        .then((result) => {
          return result.reduce(
            (acc, curr) => {
              if (!curr.projectId) return acc;

              acc[curr.projectId] = curr.updates;
              return acc;
            },
            {} as Record<number, number>,
          );
        })
    : {};

  return (
    <>
      {projects.map((project) => (
        <ProjectRow
          key={project.id}
          project={project}
          timeAgo={time(project.createdAt)}
          updateCounts={updatesCount}
        />
      ))}
    </>
  );
}

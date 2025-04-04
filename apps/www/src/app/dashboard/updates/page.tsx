import { UpdatesSearch } from "./updates-search";
import { UpdatesTable } from "./updates-table";
import * as schema from "@ethern/db";
import { hash } from "@ethern/utils/crypto";
import { eq, and, like, sql } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { getSession } from "~/server";
import { db } from "~/server/db";

interface PageProps {
  searchParams: Promise<{
    project: string;
    update: string;
  }>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const { user } = await getSession();
  const project = searchParams?.project || "";
  const update = searchParams?.update || "";

  const projectNames = await db.query.projects
    .findMany({ where: eq(schema.projects.ownerId, user.id) })
    .then((projects) => projects.map((p) => p.name));

  const projects = await db.query.projects.findMany({
    where: project
      ? and(
          eq(schema.projects.ownerId, user.id),
          eq(sql`lower(${schema.projects.name})`, project),
        )
      : eq(schema.projects.ownerId, user.id),
    with: {
      updates: {
        where: update ? like(schema.updates.name, `%${update}%`) : undefined,
        orderBy: desc(schema.updates.createdAt),
      },
    },
  });

  const updates = await Promise.all(
    projects.flatMap((p) =>
      p.updates.map(async (u, i) => ({
        ...u,
        hashId: await hash(u.id, "hex").then((r) => r.slice(0, 6)),
        isActive: i === 0,
        project: p.name,
      })),
    ),
  );

  return (
    <div>
      <h1 className="mb-3 text-3xl font-bold">Updates</h1>

      <UpdatesSearch projects={projectNames} />

      <div className="mt-8 flex flex-col gap-4">
        <UpdatesTable updates={updates} />
      </div>
    </div>
  );
}

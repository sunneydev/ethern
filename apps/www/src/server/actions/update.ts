"use server";

import { projects, updates } from "@ethern/db";
import { getR2UpdateUrl } from "@ethern/utils/server";
import { eq, sql, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "~/server";
import { db } from "~/server/db";
import { getEnv } from "~/server/env";

export async function promoteUpdate(updateId: string) {
  const { user } = await getSession();

  const [project] = await db
    .select({
      id: projects.id,
      projectId: projects.projectId,
      ownerId: projects.ownerId,
      updateRuntimeVersion: updates.runtimeVersion,
      updatePlatform: updates.platform,
    })
    .from(projects)
    .innerJoin(updates, eq(updates.projectId, projects.id))
    .where(and(eq(updates.id, updateId), eq(projects.ownerId, user.id)))
    .execute();

  await db
    .update(updates)
    .set({ createdAt: sql`(unixepoch())` })
    .where(eq(updates.id, updateId));

  const env = getEnv();

  const r2 = env.R2;

  const updateBody = await r2.get(
    getR2UpdateUrl({
      projectId: project.projectId,
      runtimeVersion: project.updateRuntimeVersion,
      platform: project.updatePlatform,
      updateId,
    }),
  );

  if (!updateBody) {
    throw new Error("Update not found");
  }

  await r2.put(
    getR2UpdateUrl({
      projectId: project.projectId,
      runtimeVersion: project.updateRuntimeVersion,
      platform: project.updatePlatform,
      updateId: "latest",
    }),
    updateBody.body,
  );

  revalidatePath("/dashboard/updates");
}

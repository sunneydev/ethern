import { projects, updates, type NewUpdate, type Update } from "..";
import { BaseRepository } from "./base-repository";
import { count, eq } from "drizzle-orm";

export class Updates extends BaseRepository {
  async create(update: NewUpdate) {
    const existingUpdate = await this.db.query.updates.findFirst({
      where: eq(updates.id, update.id),
    });

    if (existingUpdate) {
      return this.db.insert(updates).values({
        ...update,
        id: crypto.randomUUID(),
      });
    }

    return this.db
      .insert(updates)
      .values(update)
      .returning({ updateId: updates.id })
      .then((updates) => updates[0].updateId);
  }

  async find(updateId: string) {
    return this.db.query.updates.findFirst({
      where: (updates, { eq, and, isNull }) =>
        and(eq(updates.id, updateId), isNull(updates.deletedAt)),
      with: { project: { columns: { id: true, projectId: true } } },
    });
  }

  async findByProjectAndPlatform(
    projectId: number,
    platform: NonNullable<Update["platform"]>,
  ) {
    return this.db.query.updates.findFirst({
      where: (updates, { eq, and, isNull }) =>
        and(
          eq(updates.projectId, projectId),
          eq(updates.platform, platform),
          isNull(updates.deletedAt),
        ),
    });
  }

  async findMany(by: { projectId: number }) {
    return this.db.query.updates.findMany({
      where: (updates, { eq, isNull, and }) =>
        and(eq(updates.projectId, by.projectId), isNull(updates.deletedAt)),
      orderBy: (updates, { desc }) => desc(updates.createdAt),
    });
  }

  async delete(updateId: string) {
    return this.db
      .update(updates)
      .set({ deletedAt: new Date() })
      .where(eq(updates.id, updateId));
  }

  async getCount(userId: number) {
    return this.db
      .select({
        count: count(updates.id),
      })
      .from(updates)
      .leftJoin(projects, eq(updates.projectId, projects.id))
      .where(eq(projects.ownerId, userId))
      .then((result) => result[0].count);
  }
}

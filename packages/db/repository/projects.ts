import { projects, users } from "../schema";
import { BaseRepository } from "./base-repository";
import { eq } from "drizzle-orm";

export class Projects extends BaseRepository {
  async create(name: string, ownerId: number) {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ownerId),
    });

    if (!user) {
      throw new Error("User not found");
    }

    return this.db
      .insert(projects)
      .values({ name, ownerId, uid: `@${user.username}/${name}` })
      .returning({ projectId: projects.projectId, id: projects.id })
      .then((result) => result[0]);
  }

  async findBy({
    id,
    uid,
    name,
    projectId,
    ownerId,
  }: {
    id?: number;
    uid?: string;
    name?: string;
    projectId?: string;
    ownerId?: number;
  }) {
    return this.db.query.projects.findFirst({
      where: (projects, { and, eq }) => {
        return and(
          id ? eq(projects.id, id) : undefined,
          uid ? eq(projects.uid, uid) : undefined,
          name ? eq(projects.name, name) : undefined,
          projectId ? eq(projects.projectId, projectId) : undefined,
          ownerId ? eq(projects.ownerId, ownerId) : undefined,
        );
      },
    });
  }

  async findMany(userId: number) {
    return this.db.query.projects.findMany({
      where: (projects, { eq }) => eq(projects.ownerId, userId),
    });
  }

  async updateSize(projectId: number, size: number) {
    return this.db
      .update(projects)
      .set({ size })
      .where(eq(projects.id, projectId));
  }

  async findById(projectId: string) {
    return this.db.query.projects.findFirst({
      where: (projects, { eq }) => eq(projects.projectId, projectId),
    });
  }
}

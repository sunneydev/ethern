import { users } from "../schema";
import type { NewUser } from "../types";
import { BaseRepository } from "./base-repository";
import { notNull } from "@ethern/utils/notNull";
import { eq, isNotNull, isNull } from "drizzle-orm";

export class Users extends BaseRepository {
  async create(user: NewUser) {
    return this.db
      .insert(users)
      .values(user)
      .returning({ id: users.id })
      .then((result) => result[0].id);
  }

  async findBy(by: {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    oauthId?: string;
  }) {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq, and }) => {
        const statements = [
          by.username !== undefined ? eq(users.username, by.username) : null,
          by.email !== undefined ? eq(users.email, by.email) : null,
          by.id !== undefined ? eq(users.id, by.id) : null,
          by.password !== undefined
            ? and(isNotNull(users.password), eq(users.password, by.password))
            : null,
          by.oauthId !== undefined
            ? and(
                eq(users.oauthId, by.oauthId),
                isNotNull(users.provider),
                isNull(users.password),
              )
            : null,
        ].filter(notNull);

        return and(...statements, isNull(users.deletedAt));
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async findBySessionId(sessionId: string) {
    return this.db.query.sessions
      .findFirst({
        with: { user: true },
        where: (sessions, { eq }) => eq(sessions.id, sessionId),
        columns: { id: true },
      })
      .then((session) => session?.user);
  }

  async verifyEmail(email: string) {
    return this.db
      .update(users)
      .set({ verified: true })
      .where(eq(users.email, email))
      .run();
  }
}

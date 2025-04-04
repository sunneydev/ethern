import { eq } from "drizzle-orm";
import { sessions } from "../schema";
import { BaseRepository } from "./base-repository";
import type { NewSession } from "../types";
import type { Optional } from "@ethern/utils";
import { addYears } from "date-fns/addYears";

export class Sessions extends BaseRepository {
  async create(session: Optional<NewSession, "expiresAt">) {
    return this.db
      .insert(sessions)
      .values({
        ...session,
        expiresAt: session.expiresAt ?? addYears(new Date(), 1),
      })
      .returning({ sessionId: sessions.id, expiresAt: sessions.expiresAt })
      .then((results) => {
        const [result] = results;

        return {
          sessionId: result.sessionId,
          expiresAt: result.expiresAt,
        };
      });
  }

  async findById(
    sessionId: string,
    { includeExpired } = { includeExpired: false },
  ) {
    return this.db.query.sessions.findFirst({
      where: (sessions, { eq, and, gt }) =>
        and(
          eq(sessions.id, sessionId),
          includeExpired ? undefined : gt(sessions.expiresAt, new Date()),
        ),
      with: { user: true },
    });
  }

  async expire(sessionId: string) {
    return this.db
      .update(sessions)
      .set({ expiresAt: new Date() })
      .where(eq(sessions.id, sessionId));
  }

  async deleteById(sessionId: string) {
    return this.db.delete(sessions).where(eq(sessions.id, sessionId));
  }
}

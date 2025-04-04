import type { User } from "@ethern/db";
import type { Middleware } from "~/types";

export const auth: Middleware<{
  user: User;
  sessionId: string;
}> = async (c, next) => {
  const { users } = c.var.repository;
  const sessionId = c.req.header("authorization");

  if (!sessionId) {
    return c.json(
      { ok: false, message: "No token provided", code: "INVALID_TOKEN" },
      401,
    );
  }

  c.set("sessionId", sessionId);

  const user = await users.findBySessionId(sessionId);

  if (!user) {
    return c.json(
      { ok: false, message: "Invalid token", code: "INVALID_TOKEN" },
      401,
    );
  }

  c.set("user", user);

  return next();
};

export const optionalAuth: Middleware<{
  user?: User;
  sessionId?: string;
}> = async (c, next) => {
  const { users } = c.var.repository;
  const sessionId = c.req.header("authorization");

  if (!sessionId) {
    return next();
  }

  c.set("sessionId", sessionId);

  const user = await users.findBySessionId(sessionId);

  if (!user) {
    return next();
  }

  c.set("user", user);

  return next();
};

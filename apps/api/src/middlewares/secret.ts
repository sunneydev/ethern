import type { Middleware } from "~/types";

export const secret: Middleware = async (c, next) => {
  const s = c.req.header("x-secret");

  if (!s || s !== c.env.SECRET_KEY) {
    return c.json({ ok: false, message: "Forbidden", code: "FORBIDDEN" }, 403);
  }

  return next();
};

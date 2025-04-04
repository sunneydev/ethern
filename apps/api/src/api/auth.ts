import { resolveError } from "@ethern/utils";
import { createSession } from "@ethern/utils/server";
import { validDurableObjectId } from "@ethern/utils/validDurableObjectId";
import { vValidator as vv } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import { middlewares } from "~/middlewares";
import type { Env } from "~/types";

export const auth = new Hono<Env>()
  .get("/", async (c) => {
    const { repository } = c.var;
    const sessionId = c.req.header("authorization");

    if (!sessionId) {
      return c.json(
        { ok: false, message: "No token provided", code: "INVALID_TOKEN" },
        401,
      );
    }

    const user = await repository.users.findBySessionId(sessionId);

    if (!user) {
      return c.json(
        { ok: false, message: "Invalid token", code: "INVALID_TOKEN" },
        401,
      );
    }

    return c.json({
      ok: true,
      user: { username: user.username, email: user.email },
    });
  })
  .post("/code", async (c) => {
    try {
      const caid = c.env.CLI_AUTH.newUniqueId();
      const cliAuth = c.env.CLI_AUTH.get(caid);

      const code = await cliAuth.getCode();

      return c.json({ ok: true, code, token: caid.toString() });
    } catch (e) {
      console.error(e);
      return c.json({ ok: false, message: resolveError(e).message }, 500);
    }
  })
  .post(
    "/code/validate",
    middlewares.optionalAuth,
    vv(
      "json",
      v.object({
        code: v.optional(v.string()),
        token: v.optional(v.string()),
      }),
    ),
    async (c) => {
      const { repository, user } = c.var;
      const { code, token } = c.req.valid("json");

      if (!token || !validDurableObjectId(token)) {
        return c.json(
          {
            ok: false,
            message: "Invalid code or token",
            code: "INVALID_CODE",
          },
          401,
        );
      }

      const doId = c.env.CLI_AUTH.idFromString(token);
      const cliAuth = c.env.CLI_AUTH.get(doId);

      if (user) {
        const response = await cliAuth.check(code, user.id);

        return c.json(response);
      }

      const response = await cliAuth.check();

      const userId = "userId" in response ? response.userId : null;

      if (!userId) {
        return c.json(response, { status: 400 });
      }

      const cf = c.req.raw.cf
        ? (c.req.raw.cf as { city: string; country: string })
        : undefined;

      const { username, email } = await repository.users.findBy({ id: userId });

      const { sessionId } = await createSession({
        cf,
        userAgent: c.req.header("user-agent"),
        userId: userId,
        db: repository,
      });

      return c.json({
        ok: true,
        message: "Authenticated",
        token: sessionId,
        user: { username, email },
      });
    },
  );

import { Repository, getDB } from "@ethern/db";
import { Hono } from "hono";
import { auth } from "~/api/auth";
import { projects } from "~/api/projects";
import { updates } from "~/api/updates";
import { Env } from "~/types";

export const app = new Hono<Env>()
  .use("*", async (c, next) => {
    const db = getDB(c.env.DB);

    c.set("db", db);
    c.set("repository", new Repository(db));

    await next();
  })
  .route("/auth", auth)
  .route("/projects", projects)
  .route("/updates", updates);

export type AppType = typeof app;

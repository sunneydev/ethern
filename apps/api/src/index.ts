import { Repository, getDB } from "@ethern/db";
import { Redis } from "@ethern/lib";
import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { auth } from "~/api/auth";
import { projects } from "~/api/projects";
import { updates } from "~/api/updates";
import { CliAuth } from "~/do/cli-auth";
import { Env } from "~/types";

const app = new Hono<Env>().use("*", async (c, next) => {
  const db = getDB(c.env.DB);

  c.set("db", db);
  c.set("repository", new Repository(db));

  await next();
});

const routes = app
  .route("/auth", auth)
  .route("/projects", projects)
  .route("/updates", updates);

showRoutes(app);

export type AppType = typeof routes;

export default {
  port: 8787,
  fetch: app.fetch,
} satisfies ExportedHandler<Env["Bindings"]> & { port?: number };

export { CliAuth };

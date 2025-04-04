import { vValidator as vv } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import { middlewares } from "~/middlewares";
import type { Env } from "~/types";

export const projects = new Hono<Env>()
  .get("/", middlewares.auth, middlewares.project, async (c) => {
    const { project } = c.var;

    return c.json({
      ok: true,
      project: {
        name: project.name,
        createdAt: project.createdAt,
        projectId: project.projectId,
      },
    });
  })
  .post(
    "/",
    middlewares.auth,
    vv(
      "json",
      v.object({
        projectName: v.pipe(v.string(), v.minLength(3), v.maxLength(100)),
      }),
    ),
    async (c) => {
      const {
        user,
        repository: { projects },
      } = c.var;

      const { projectName } = c.req.valid("json");

      const existingProject = await projects.findBy({
        name: projectName,
        ownerId: user.id,
      });

      if (existingProject) {
        return c.json(
          {
            ok: false,
            message: "Project already exists.",
            projectId: existingProject.projectId,
          },
          409,
        );
      }

      const { projectId } = await projects.create(projectName, user.id);

      return c.json({ ok: true, projectId });
    },
  );

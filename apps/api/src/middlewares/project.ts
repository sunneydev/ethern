import type { Project, User } from "@ethern/db";
import type { Middleware } from "~/types";

export const project: Middleware<{ project: Project; user: User }> = async (
  c,
  next,
) => {
  const projectId = c.req.header("ethern-project-id");

  const { projects } = c.var.repository;

  if (!projectId) {
    return c.json({ ok: false, message: "No project id provided" }, 400);
  }

  const project = await projects.findById(projectId);

  if (!project) {
    return c.json({ ok: false, message: "Project not found" }, 404);
  }

  // TODO: add support for teams later
  if (project.ownerId !== c.var.user.id) {
    return c.json({ ok: false, message: "Unauthorized" }, 403);
  }

  c.set("project", project);

  return next();
};

import prompts from "prompts";
import { api } from "~/api";

export async function setupProject(initialProjectName: string) {
  const { projectName } = await prompts({
    type: "text",
    name: "projectName",
    message: "Enter a name for your project",
    initial: initialProjectName,
  });

  return api.createProject(projectName).then((r) => r.data?.projectId);
}

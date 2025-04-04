import type { Metadata, Platform } from "@ethern/api/src/validators/updates";
import type { Project } from "@ethern/db";
import requestly from "requestly";
import { config } from "~/config";

const api = requestly.create({
  baseUrl: config.API_URL,
  headers: {
    authorization: config.API_TOKEN ?? "",
  },
});

type Code = "INVALID_TOKEN" | "UPDATE_ALREADY_EXISTS";

type ApiResponse<T = Record<string, unknown>> =
  | ({ ok: true } & T)
  | ({ ok: false; message: string; code?: Code } & Partial<T>);

export function handshake(
  platforms: { ios?: Platform; android?: Platform },
  opts?: { force: boolean },
) {
  return api.post<
    ApiResponse<{ upload: string[]; token: string; timestamp: number }>
  >("/updates/handshake", {
    body: { platforms, ...opts },
  });
}

export async function update({
  zip,
  token,
  timestamp,
  platforms,
  name,
}: {
  name: string;
  zip: Blob;
  token: string;
  timestamp: number;
  platforms: { ios?: Platform; android?: Platform };
}) {
  const form = new FormData();

  form.append("zip", zip, "assets.zip");
  form.append("name", name);
  form.append(
    "metadata",
    JSON.stringify({
      platforms,
      timestamp,
      token,
    } satisfies Metadata),
  );

  const response = await api
    .post<ApiResponse>("/updates", { body: form })
    .catch((e) => {
      if (e instanceof Error && e.message === "Failed to fetch") {
        throw new Error("Failed to connect to the server");
      }

      throw e;
    });

  return response;
}

export async function auth(token?: string) {
  const response = await fetch(`${config.API_URL}/auth`, {
    headers: token ? { authorization: token } : undefined,
  });

  return response;
}

export async function generateAuthCode() {
  const response =
    await api.post<ApiResponse<{ code?: string; token?: string }>>(
      "/auth/code",
    );

  return response.data;
}

export async function checkAuth({
  code,
  token,
}: {
  code: string;
  token: string;
}) {
  const response = await api.post<ApiResponse<{ token: string }>>(
    "/auth/code/validate",
    { body: { code, token } },
  );

  return response;
}

export async function createProject(projectName: string) {
  const response = await api.post<ApiResponse<{ projectId: string }>>(
    "/projects",
    { body: { projectName } },
  );

  return response;
}

export async function setProjectId(
  projectId: string,
): Promise<Project | null | undefined> {
  api.headers.set("ethern-project-id", projectId);

  const response =
    await api.get<ApiResponse<{ project: Project }>>("/projects");

  if (!response.data.ok) {
    if (response.status === 404) {
      return null;
    }

    if (response.status !== 200) {
      throw new Error(response?.data?.message ?? "Failed to get project");
    }
  } else {
    return response.data.project;
  }
}

export * as api from "~/api";

import { requestly as api } from "requestly";
import { getEnv, isDev } from "~/server/env";

async function generateAccessToken(code: string): Promise<string> {
  const { GITHUB_CLIENT_ID: clientId, GITHUB_CLIENT_SECRET: clientSecret } =
    getEnv();

  const response = await api.post<{ access_token: string }>(
    "https://github.com/login/oauth/access_token",

    {
      headers: { Accept: "application/json" },
      body: {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: isDev()
          ? "http://localhost:3000/auth/github/callback"
          : "https://ethern.dev/auth/github/callback",
      },
    },
  );

  if (typeof response?.data?.access_token !== "string") {
    throw new Error("Failed to generate access token");
  }

  const accessToken = response.data.access_token;

  return accessToken;
}

async function fetchUser(accessToken: string) {
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-OAuth-Scopes": "user:email",
    },
  });

  if (userResponse.status !== 200) {
    throw new Error("Invalid token");
  }

  const user = (await userResponse.json()) as {
    id: number;
    login: string;
    avatar_url: string;
  };

  if (!user.login) {
    throw new Error("Invalid token");
  }

  const userEmailsResponse = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (userEmailsResponse.status !== 200) {
    throw new Error("Invalid token");
  }

  const emails = (await userEmailsResponse.json()) as {
    email: string;
    primary: boolean;
    verified: boolean;
  }[];

  const primaryEmail = emails.find((email) => email.primary && email.verified);

  if (!primaryEmail) {
    throw new Error("Invalid token");
  }

  return {
    id: user.id,
    login: user.login,
    avatar_url: user.avatar_url,
    email: primaryEmail.email,
  };
}

export const github = {
  generateAccessToken,
  fetchUser,
};

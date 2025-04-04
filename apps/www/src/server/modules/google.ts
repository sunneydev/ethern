import "server-only";
import { consts } from "~/lib/consts";
import { getEnv } from "~/server/env";

const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_OAUTH_AUTHORIZE_URL =
  "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

async function generateAccessToken({
  code,
  redirectUri,
}: {
  code: string;
  redirectUri: string;
}) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = getEnv();

  const tokenResponse = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error(
      `Failed to exchange code for token: ${tokenResponse.statusText}`,
    );
  }

  const response = (await tokenResponse.json()) as {
    access_token?: string;
  };

  if (!response.access_token) {
    throw new Error("Failed to exchange code for token");
  }

  return response.access_token;
}

function generateAuthorizationUrl(redirectUri: string) {
  const clientId = consts.google.clientId;

  const url = new URL(GOOGLE_OAUTH_AUTHORIZE_URL);

  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", encodeURIComponent(redirectUri));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");

  return url.toString();
}

async function getUserInfo(accessToken: string) {
  const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userInfoResponse.ok) {
    throw new Error(`Failed to get user info: ${userInfoResponse.statusText}`);
  }

  const user = (await userInfoResponse.json()) as {
    id: string;
    email: string;
    picture: string;
    verified_email: boolean;
  };

  return user;
}

export const google = {
  generateAccessToken,
  generateAuthorizationUrl,
  getUserInfo,
};

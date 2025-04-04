"use server";

import { getRequestContext } from "@cloudflare/next-on-pages";
import { GENERIC_ERROR_MESSAGE } from "@ethern/utils/consts";
import { sign } from "@ethern/utils/crypto";
import { createSession } from "@ethern/utils/server";
import { sessionCookieProps } from "@ethern/web/utils";
import { hashPassword } from "@ethern/web/utils/crypto";
import { cookies, headers } from "next/headers";
import * as v from "valibot";
import { ForgotPasswordEmail } from "~/components/emails/forgot-password";
import { VerifyEmail } from "~/components/emails/verify-email";
import { resolveError } from "~/lib/utils";
import { sendEmail } from "~/server/actions/user";
import { repository } from "~/server/db";
import { isDev, getEnv } from "~/server/env";

export async function validateOTP(code: string, otpToken: string) {
  const token = (await cookies()).get("session-token");

  if (!token) {
    return {
      ok: false,
      message: "You need to sign in",
      redirect: "/auth/account/sign-in" as const,
    };
  }

  const sessionId = token.value;

  const user = await repository.users.findBySessionId(sessionId);

  if (!user) {
    return {
      ok: false,
      message: "Invalid user",
      redirect: "/auth/account/sign-in" as const,
    };
  }

  const env = getEnv();

  const response = await fetch(
    isDev()
      ? "http://localhost:8787/auth/code/validate"
      : "https://api.ethern.dev/auth/code/validate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
        "X-Secret": env.SECRET_KEY,
      },
      body: JSON.stringify({ code, token: otpToken, userId: user.id }),
    },
  );

  if (response.status === 410) {
    return { ok: false, message: "Code expired" };
  }

  if (response.status === 401) {
    return { ok: false, message: "Invalid code" };
  }

  if (response.status !== 200) {
    return {
      ok: false,
      message:
        "Unexpected error occured. Please try again later, or contact support",
    };
  }

  return { ok: true };
}

export async function signIn(form: FormData) {
  const username = form.get("username")?.toString()?.toLowerCase();
  const password = form.get("password");

  if (password === "can you crash") {
    throw new Error("crash error");
  }

  if (typeof username !== "string" || typeof password !== "string") {
    return { ok: false, message: "Username and password are required" };
  }

  const email = username.includes("@") ? username : undefined;

  const user = await repository.users
    .findBy({
      email,
      username: email ? undefined : username,
    })
    .catch((err) => {
      console.error(`Failed to find user: ${err.message}`, err);
      return null;
    });

  const ctx = getRequestContext();

  if (!user) {
    return { ok: false, message: "Invalid credentials" };
  }

  const hashedPassword = await hashPassword({
    username: user.username,
    password,
  });

  if (user.password !== hashedPassword) {
    return { ok: false, message: "Invalid credentials" };
  }

  const { sessionId, expiresAt } = await createSession({
    cf: ctx.cf,
    userId: user.id,
    userAgent: (await headers()).get("user-agent"),
    db: repository,
  });
  (await cookies()).set(
    "session-token",
    sessionId,
    sessionCookieProps(expiresAt),
  );

  return { ok: true };
}

const signupSchema = v.object({
  email: v.pipe(
    v.string(),
    v.email("Invalid email"),
    v.minLength(3, "Email must be at least 3 characters long"),
    v.maxLength(100, "Email must be at most 100 characters long"),
    v.transform((v) => v.trim().toLowerCase()),
  ),
  username: v.pipe(
    v.string(),
    v.minLength(3, "Username must be at least 3 characters long"),
    v.maxLength(20, "Username must be at most 20 characters long"),
    v.transform((v) => v.trim().toLowerCase()),
  ),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Password must be at least 8 characters long"),
    v.maxLength(64, "Password must be at most 64 characters long"),
  ),
  confirmPassword: v.string(),
});

export async function signUp(form: FormData) {
  const ctx = getRequestContext();

  try {
    const parse = v.safeParse(signupSchema, Object.fromEntries(form));

    if (!parse.success) {
      return { errors: parse.issues };
    }

    const { email, username, password, confirmPassword } = parse.output;

    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    const passwordHashed = await hashPassword({ username, password });

    const userId = await repository.users.create({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: passwordHashed,
    });

    const { sessionId, expiresAt } = await createSession({
      cf: ctx.cf,
      userId,
      userAgent: (await headers()).get("user-agent"),
      db: repository,
    });
    (await cookies()).set(
      "session-token",
      sessionId,
      sessionCookieProps(expiresAt),
    );

    return { success: true };
  } catch (err) {
    const error = resolveError(err);
    if (error.message.includes("UNIQUE constraint failed")) {
      return { error: "User already exists" };
    }

    if (error.message.includes("D1_ERROR")) {
      return { error: GENERIC_ERROR_MESSAGE };
    }
    return { error: error.message };
  }
}

export async function forgotPassword(email: string) {
  const user = await repository.users.findBy({ email });

  if (!user) {
    return { ok: false, message: "User not found" };
  }

  const env = getEnv();

  const signature = await sign(
    `email:${email}`,
    env.SECRET_KEY as string,
    "hex",
  );

  const resetLink = `/auth/reset-password?token=${signature.mac}&timestamp=${signature.timestamp}&email=${email}`;

  if (isDev()) {
    console.info(`resetLink: http://localhost:3000${resetLink}`);
    return { ok: true };
  }

  await sendEmail({
    email,
    body: <ForgotPasswordEmail />,
    subject: "Reset your password",
    toast: {
      success: "Reset password email sent",
      fail: "Failed to send reset password email",
    },
  }).catch((err) => {
    console.error(`Failed to send email: ${err.message}`, err);
  });

  return { ok: true };
}

export async function sendVerificationEmail(email: string) {
  const env = getEnv();

  const signature = await sign(
    `email:${email}`,
    env.SECRET_KEY as string,
    "hex",
  );

  const verificationLink = `/auth/verify-email?token=${signature.mac}&timestamp=${signature.timestamp}&email=${email}`;

  if (isDev()) {
    console.info(`verificationLink: http://localhost:3000${verificationLink}`);
    return;
  }

  return sendEmail({
    email,
    body: <VerifyEmail verificationLink={verificationLink} />,
    subject: "Verify your email",
    toast: {
      success: "Verification email sent",
      fail: "Failed to send verification email",
    },
  });
}

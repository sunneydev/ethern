"use server";

import * as schema from "@ethern/db";
import { GENERIC_ERROR_MESSAGE } from "@ethern/utils/consts";
import { hashPassword } from "@ethern/web/utils/crypto";
import { render } from "@react-email/render";
import { eq } from "drizzle-orm";
import { resolveError } from "~/lib/utils";
import { getSession } from "~/server";
import { db } from "~/server/db";
import { getEnv } from "~/server/env";

export async function skipOnboarding() {
  const { user } = await getSession();

  await db
    .update(schema.users)
    .set({ onboarded: true })
    .where(eq(schema.users.id, user.id));

  return { success: true };
}

export async function getUser() {
  return getSession();
}

export async function getProjects() {
  return db.query.projects.findMany();
}

export async function changeEmail({ newEmail }: { newEmail: string }) {
  try {
    const { user } = await getSession();

    if (user.email === newEmail) {
      return { success: false, message: "Email is the same." };
    }

    const userExists = await db.query.users.findFirst({
      where: eq(schema.users.email, newEmail),
    });

    if (userExists) {
      return { success: false, message: GENERIC_ERROR_MESSAGE };
    }

    await db
      .update(schema.users)
      .set({ email: newEmail, verified: false })
      .where(eq(schema.users.id, user.id));
  } catch (e) {
    return { success: false, message: resolveError(e).message };
  }

  return {
    success: true,
    message: "Email updated, please verify your new email address.",
  };
}

export async function changeUsername({
  newUsername,
  password,
}: {
  password: string;
  newUsername: string;
}) {
  try {
    const { user } = await getSession();

    const existingPassword = await hashPassword({
      username: user.username,
      password,
    });

    if (existingPassword !== user.password) {
      return { success: false, message: "Invalid password." };
    }

    const updatedPassword = await hashPassword({
      username: newUsername,
      password,
    });

    await db
      .update(schema.users)
      .set({ username: newUsername, password: updatedPassword })
      .where(eq(schema.users.id, user.id));
  } catch (e) {
    return { success: false, message: resolveError(e).message };
  }

  return { success: true, message: "Username updated." };
}

export async function changePassword({
  password,
  newPassword,
}: {
  password: string;
  newPassword: string;
}) {
  try {
    const { user } = await getSession();

    const existingPassword = await hashPassword({
      username: user.username,
      password,
    });

    if (existingPassword !== user.password) {
      return { success: false, message: "Invalid password." };
    }

    const updatedPassword = await hashPassword({
      username: user.username,
      password: newPassword,
    });

    await db
      .update(schema.users)
      .set({ password: updatedPassword })
      .where(eq(schema.users.id, user.id));
  } catch (e) {
    return { success: false, message: resolveError(e).message };
  }

  return { success: true, message: "Password updated." };
}

export async function sendEmail({
  email,
  body,
  subject,
  toast,
}: {
  subject: string;
  toast?: { success?: string; fail?: string } | false;
  body: React.ReactElement;
  email: string;
}) {
  console.log(`Sending email to ${email}`);

  const html = render(body);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getEnv().RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Ethern <onboarding@ethern.dev>",
      to: email,
      subject,
      html,
    }),
  }).catch((err) => {
    // logger.error(`Failed to send email: ${err.message}`, err)
    return null;
  });

  if (!response) {
    return { ok: false, message: "Failed to send email" };
  }

  if (!response.ok) {
    // logger.error('Failed to send email', {
    // 	subject,
    // 	email,
    // 	'response.status': response.status,
    // 	'response.body': await response.text()
    // })
  }

  // logger.info('Email sent', { subject, email })

  if (typeof toast === "boolean") {
    return { ok: response.ok };
  }

  const result = response.ok
    ? { ok: true, message: toast?.success ?? "Email sent" }
    : { ok: false, message: toast?.fail ?? "Failed to send email" };

  console.log(result);

  return result;
}

export async function sendContactMessage({
  email,
  message,
}: {
  email: string;
  message: string;
}) {
  const encodeForEmail = (text: string) => {
    return text.replace(/%/g, "%25").replace(/\n/g, "%0A").replace(/ /g, "%20");
  };

  const emailBody = encodeForEmail(message);

  const subject = encodeURIComponent("Re: Your contact form submission");
  const mailtoLink = `mailto:${email}?subject=${subject}&body=${emailBody}`;

  const encodedMailtoLink = encodeURIComponent(mailtoLink);

  const redirectUrl = `https://redirect-roan.vercel.app/?url=${encodedMailtoLink}`;

  const discordMessage = {
    content: "New contact form submission!",
    embeds: [
      {
        title: "Contact Form Submission",
        fields: [
          { name: "Email", value: email },
          {
            name: "Message",
            value:
              message.length > 1000
                ? `${message.substring(0, 997)}...`
                : message,
          },
          {
            name: "Reply",
            value: `[Click here to reply via email](${redirectUrl})`,
          },
        ],
        footer: {
          text: "Click the link above to open a pre-formatted email reply in your Apple Mail app.",
        },
      },
    ],
  };

  const response = await fetch(
    "https://discord.com/api/webhooks/1261720338845270028/1suTnvOyJaAVkyLYDRNDX2jToRmrSImP8RC3O3kmufcMhUhr2c8df1QJ-VGlDVJLm6S9",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordMessage),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Discord API Error: ${response.status} ${response.statusText}`,
    );
    throw new Error(`Failed to send the contact form, ${errorText}`);
  }

  return { message: "Message sent successfully" };
}

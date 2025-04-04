import "server-only";

export async function hashPassword({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  return crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(`${password}:${username}`))
    .then((buf) => Buffer.from(buf).toString("base64"));
}

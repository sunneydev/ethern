import fs from "fs/promises";
import crypto from "node:crypto";
import p from "node:path";
import prompts from "prompts";

export async function readJsonFile<T>(path: string): Promise<T> {
  const data = await fs.readFile(p.resolve(process.cwd(), path), "utf-8");

  return JSON.parse(data);
}

export async function writeJsonFile(
  path: string,
  data: unknown,
): Promise<void> {
  await fs.writeFile(path, JSON.stringify(data, null, 2), "utf-8");
}

export async function ask(
  question: string,
  after?: () => Promise<unknown> | unknown,
  initial = true,
): Promise<boolean> {
  const result = (
    await prompts({
      type: "confirm",
      name: "value",
      message: question,
      initial,
    })
  ).value;

  if (result && after) {
    await after();
  }

  return result;
}

export function hash(content: string | Buffer, algorithm = "sha256") {
  return {
    hex: crypto.createHash(algorithm).update(content).digest("hex"),
    base64: crypto.createHash(algorithm).update(content).digest("base64url"),
  };
}

export function log(message: string) {
  console.log(message);
}

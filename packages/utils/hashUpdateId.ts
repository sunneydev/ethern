import { sha256 } from "./crypto/sha256";

export function hashUpdateId(updateId: string) {
  const td = new TextDecoder();
  const te = new TextEncoder();

  const hash = sha256(te.encode(updateId));

  const hex = Array.from(hash)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 6);

  return hex;
}

import { unzipSync } from "fflate";
import { Buffer } from "node:buffer";
import crypto from "node:crypto";

export function stringToUUID(str: string): string {
  const hash = crypto.createHash("md5").update(str).digest("hex");

  // Position 16 is fixed to either 8, 9, a, or b in the uuid v4 spec (10xx in binary)
  // RFC 4122 section 4.4
  const v4variant = ["8", "9", "a", "b"][
    hash.substring(16, 17).charCodeAt(0) % 4
  ] as string;

  return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-4${hash.substring(
    13,
    16,
  )}-${v4variant}${hash.substring(17, 20)}-${hash.substring(20)}`.toLowerCase();
}

export function hashesToPayload(hashes: string[]) {
  return hashes.sort().join(",");
}

export async function unzipBlob(blob: File | Blob) {
  const zipBuffer = Buffer.from(await blob.arrayBuffer());

  return unzipSync(zipBuffer);
}

export function generateCode(length = 8) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}

export function secondsLeftBeforeEndOfMonth() {
  const currentDate = new Date();

  // Get the current year and month
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const nextMonth = new Date(currentYear, currentMonth + 1, 1);

  const millisLeft = Number(nextMonth) - Number(currentDate);

  const secondsLeft = Math.floor(millisLeft / 1000);

  return secondsLeft;
}

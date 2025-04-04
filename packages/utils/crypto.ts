export async function sign(
  payload: string,
  secretKey: string,
  encoding: "base64" | "hex" = "base64",
) {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

  const timestamp = Date.now();

  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${payload}:${timestamp}`),
  );

  const encodedMac =
    encoding === "base64"
      ? btoa(String.fromCharCode(...new Uint8Array(mac)))
      : Array.from(new Uint8Array(mac))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

  return {
    mac: encodedMac,
    timestamp,
  };
}

export async function verify(
  payload: string,
  mac: string,
  secretKey: string,
  timestamp: string | number,
  expiryMinutes = 5,
  encoding: "base64" | "hex" = "base64",
) {
  if (!isTimestampFresh(+timestamp, expiryMinutes * 60)) {
    return false;
  }

  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

  const macBuffer =
    encoding === "base64"
      ? Uint8Array.from(atob(mac), (c) => c.charCodeAt(0))
      : new Uint8Array(
          mac.match(/.{2}/g)?.map((byte) => Number.parseInt(byte, 16)) || [],
        );

  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    macBuffer,
    encoder.encode(`${payload}:${timestamp}`),
  );

  return isValid;
}

export async function shortenHash(hash: string, length = 32) {
  const urlSafeCharset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_~.";

  const te = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", te.encode(hash));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  let hashNumber = BigInt(`0x${hashHex}`);

  let shortHash = "";
  while (shortHash.length < length) {
    const index = Number(hashNumber % BigInt(urlSafeCharset.length));
    shortHash += urlSafeCharset[index];
    hashNumber /= BigInt(urlSafeCharset.length);
  }

  return shortHash;
}

export async function encrypt(payload: string, secretKey: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    "AES-GCM",
    false,
    ["encrypt", "decrypt"],
  );

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv.buffer as ArrayBuffer,
    },
    key,
    encoder.encode(payload),
  );

  return {
    iv,
    encrypted,
  };
}

export async function decrypt(
  iv: Uint8Array,
  encrypted: ArrayBuffer,
  secretKey: string,
) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    "AES-GCM",
    false,
    ["encrypt", "decrypt"],
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv.buffer as ArrayBuffer,
    },
    key,
    encrypted,
  );

  return decoder.decode(decrypted);
}

export async function hash(
  payload: string,
  encoding: "base64" | "hex" = "base64",
) {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(payload));

  return encoding === "base64"
    ? btoa(String.fromCharCode(...new Uint8Array(hash)))
    : Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export function isTimestampFresh(
  timestamp: number,
  toleranceInSeconds: number,
): boolean {
  if (Number.isNaN(timestamp)) {
    return false;
  }

  const now = Date.now();
  return Math.abs(now - timestamp) <= toleranceInSeconds * 1000;
}

import { DurableObject } from "cloudflare:workers";
import { match, P } from "ts-pattern";

export type CliAuthStub = DurableObjectNamespace<CliAuth>;

export function generateCode(length = 8) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

export class CliAuth extends DurableObject {
  code = generateCode();
  userId: number | null = null;
  status: "pending" | "verified" | "expired" = "pending";

  async check(code?: string, userId?: number | null) {
    if (code && userId) {
      return this.validateCode(code, userId);
    }

    return match(this.status)
      .with(
        "pending",
        () => ({ ok: true, status: 202, message: "Pending" }) as const,
      )
      .with(
        "verified",
        () =>
          ({
            ok: true,
            status: 200,
            message: "Verified",
            userId: this.userId,
          }) as const,
      )
      .with(
        "expired",
        () =>
          ({
            ok: false,
            status: 410,
            message: "Code expired",
          }) as const,
      )
      .with(
        P.any,
        () =>
          ({
            ok: false,
            status: 500,
            message:
              "Unexpected error occured. Please try again later, or contact support",
          }) as const,
      )
      .exhaustive();
  }

  async getCode() {
    this.checkAndSetAlarm();
    return this.code;
  }

  async validateCode(code: string, userId: number) {
    if (this.status === "expired") {
      return { ok: false, message: "Expired" };
    }

    if (code !== this.code) {
      return { ok: false, message: "Invalid code" };
    }

    this.status = "verified";
    this.userId = userId;

    return { ok: true };
  }

  async checkAndSetAlarm() {
    const currentAlarm = await this.ctx.storage.getAlarm();

    if (!currentAlarm) {
      await this.ctx.storage.setAlarm(Date.now() + 60 * 1000);
    }
  }

  async alarm() {
    this.status = "expired";
  }
}

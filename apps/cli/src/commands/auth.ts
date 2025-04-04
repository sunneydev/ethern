import c from "chalk";
import logSymbols from "log-symbols";
import open from "open";
import ora from "ora";
import * as readline from "readline";
import { api } from "~/api";
import { config, store } from "~/config";
import { Log } from "~/tools/others";
import { ask } from "~/utils";

export async function auth(flags?: Record<string, string | boolean>) {
  if (flags?.withAsk) {
    const yes = await ask(
      "You need to authenticate before deploying updates. Do you want to authenticate now?",
    );

    if (!yes) {
      Log.warn("You need to authenticate before deploying updates.");
      process.exit(1);
    }
  }

  const { code, token: otpToken } = await api.generateAuthCode();

  if (!code || !otpToken) {
    Log.errorExit("Failed to generate auth code");
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const spinner = ora("Authenticating...");

  rl.question(
    `${logSymbols.info} First copy your one-time code: ${c.bold(code)}
${c.bold("Press enter")} to open ethern.dev in your browser...`,
    () => {
      open(`${config.APP_URL}/auth/cli?token=${otpToken}`);
      spinner.start();
      rl.close();
    },
  );

  const interval = setInterval(async () => {
    const result = await api
      .checkAuth({ code, token: otpToken })
      .then((r) => r.data);

    if (!result.ok) {
      spinner.fail(result.message);
      clearInterval(interval);
      process.exit(1);
    }

    const token = result.token;

    if (!token) {
      return;
    }

    const user = await api.auth(token).then((r) => {
      if (r.ok) {
        return r.json().then((r) => (r as { user: typeof config.user }).user);
      }

      return null;
    });

    if (!user) {
      spinner.fail("Failed to authenticate");
      clearInterval(interval);
      process.exit(1);
    }

    store.set("token", token);

    spinner.succeed(`Authenticated as @${user.username}`);
    clearInterval(interval);
    process.exit(0);
  }, 2000);

  return;
}

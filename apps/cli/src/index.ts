#!/usr/bin/env node
import minimist from "minimist";
import { commands } from "~/commands";
import { auth } from "~/commands/auth";
import { config } from "~/config";
import { Log } from "~/tools/others";

async function main() {
  await config.init();

  if (!config.user) {
    await auth({ withAsk: true });
    return;
  }

  const { _: args, dev, ...flags } = minimist(process.argv.slice(2));

  const path = flags.path || flags.p;

  if (path) {
    console.log(`Changing directory to ${path}`);
    process.chdir(path);
  }

  const [command] = args;

  const cmd = !command
    ? "update"
    : !commands[command] || flags.help || flags.h
      ? "help"
      : command;

  await commands[cmd]?.action(flags);
}

main().catch((error) => {
  Log.error(error);
  console.error(error);
  process.exit(1);
});

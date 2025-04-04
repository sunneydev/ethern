import { commands } from ".";
import c from "chalk";
import { Log } from "~/tools/others";

export async function help() {
  Log.withInfo("Available commands:");
  for (const [name, { description }] of Object.entries(commands)) {
    Log.log(`   ${c.bold(name)}: ${description}`);
  }
  return;
}

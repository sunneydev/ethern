import { auth } from "~/commands/auth";
import { help } from "~/commands/help";
import { update } from "~/commands/update";
import { whoami } from "~/commands/whoami";

export const commands: {
  [key: string]: {
    description: string;
    action: (flags?: Record<string, string | boolean>) => Promise<void>;
  };
} = {
  auth: {
    description: "Authenticate with ethern.dev",
    action: auth,
  },
  update: {
    description: "Upload a new version of your app",
    action: update,
  },
  whoami: {
    description: "Show the currently authenticated user",
    action: whoami,
  },
  help: {
    description: "Help",
    action: help,
  },
} as const;

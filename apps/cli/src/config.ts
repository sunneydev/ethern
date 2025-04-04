import Conf from "conf";
import minimist from "minimist";
import { api } from "~/api";

export const store = new Conf({
  projectName: "ethern-cli",
  projectSuffix: "",
  schema: {
    token: {
      type: ["string", "null"],
      default: "",
    },
    user: {
      default: null,
    },
  },
});

export const config = {
  R2_BASE_URL: "https://u.ethern.dev",
  API_TOKEN: store.get("token", null) as string | null,
  API_URL: process.env.API_URL ?? "https://api.ethern.dev",
  APP_URL: process.env.APP_URL ?? "https://ethern.dev",
  user: null as unknown as {
    username: string;
    email: string;
  } | null,
  async init() {
    if (!this.API_TOKEN) {
      return;
    }

    const response = await api.auth(this.API_TOKEN).catch((e) => {
      console.error(`Failed to authenticate: ${e.message}`);
    });

    if (response && !response.ok) {
      store.set("token", null);
      this.API_TOKEN = null;
      return;
    }

    this.user = (await response?.json()) as typeof this.user;
  },
  isDev: minimist(process.argv.slice(2)).dev != null,
};

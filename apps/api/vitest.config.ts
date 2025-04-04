import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineWorkersConfig({
  plugins: [tsconfigPaths({ ignoreConfigErrors: true })],
  esbuild: { target: "es2022" },
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.toml" },
        miniflare: {
          d1Databases: { DB: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" },
          durableObjects: { CLI_AUTH: { className: "CliAuth" } },
          compatibilityFlags: ["nodejs_compat"],
          compatibilityDate: "2024-04-03",
        },
      },
    },
  },
});

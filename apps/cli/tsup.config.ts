import { defineConfig, type Options } from "tsup";

export default defineConfig((flags) => {
  const buildOptions: Options = {
    minify: true,
    clean: true,
    format: ["esm"],
  };

  return {
    entry: ["src/index.ts"],
    outDir: "dist",
    ...buildOptions,
  };
});

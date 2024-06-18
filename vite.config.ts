import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],

  build: {
    lib: {
      entry: "./src/index.ts",
      name: "PostcssRelativeRem",
      fileName: "index",
    },
  },
});

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    cssCodeSplit: false,
    outDir: "dist",
    lib: {
      entry: "src/index.ts",
      name: "rcs",
    },
  },
});

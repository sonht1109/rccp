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
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: 'React'
        }
      }
    },
    cssCodeSplit: false,
    outDir: "dist",
    lib: {
      entry: "src/index.ts",
      name: "rcs",
      formats: ["es", "cjs"],
    },
  },
});

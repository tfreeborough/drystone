import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import { resolve } from "path";
import svgr from "vite-plugin-svgr";

export default (appPath: string) =>
  defineConfig({
    root: appPath,
    plugins: [svgr({ include: "**/*.svg?react" }), react(), mkcert()],
    build: {
      outDir: "./dist",
    },
    resolve: {
      alias: {
        "@shared/types": resolve(__dirname, "./shared/types"),
        "@shared/functions": resolve(__dirname, "./shared/functions"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler", // or "modern"
        },
      },
    },
  });

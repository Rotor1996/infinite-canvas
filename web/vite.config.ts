import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

import { parseChangelog } from "./src/lib/release";

const webDir = dirname(fileURLToPath(import.meta.url));
const localVersion = readFileSync(resolve(webDir, "../VERSION"), "utf8").trim() || "dev";
const localChangelog = readFileSync(resolve(webDir, "../CHANGELOG.md"), "utf8");

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, webDir, "");
    const sub2apiProxyTarget = (process.env.VITE_SUB2API_PROXY_TARGET || env.VITE_SUB2API_PROXY_TARGET || "").trim().replace(/\/+$/, "");

    return {
        base: process.env.VITE_BASE || env.VITE_BASE || "/",
        plugins: [react()],
        resolve: {
            alias: {
                "@": resolve(webDir, "src"),
            },
        },
        define: {
            __APP_VERSION__: JSON.stringify(localVersion),
            __APP_RELEASES__: JSON.stringify(parseChangelog(localChangelog)),
        },
        server: sub2apiProxyTarget
            ? {
                  proxy: {
                      "/sub2api": {
                          target: sub2apiProxyTarget,
                          changeOrigin: true,
                          rewrite: (path) => path.replace(/^\/sub2api/, ""),
                      },
                  },
              }
            : undefined,
    };
});

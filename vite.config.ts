import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: process.env.CF_PAGES ? {
    preset: "cloudflare-pages",
    output: {
      dir: "dist",
      publicDir: "dist/client",
    }
  } : {},
  tanstackStart: {
    server: { entry: "server" },
  },
});

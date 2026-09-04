import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: process.env.CF_PAGES
    ? {
        preset: "cloudflare-pages",
        output: {
          dir: "dist",
          publicDir: "dist/client",
        },
      }
    : {},
  tanstackStart: {
    server: { entry: "server" },
  },
});

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Force-on Nitro with the Vercel preset so `vite build` produces the
  // `.vercel/output` directory Vercel auto-detects. Without this, the default
  // Lovable build targets Cloudflare Workers and Vercel serves nothing → 404.
  nitro: {
    preset: "vercel",
  },
});

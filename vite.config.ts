import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Force-on Nitro with the Vercel preset AND Vercel Build Output API paths.
  // The Lovable helper defaults Nitro output back to `dist`, so the output
  // paths must be explicit or Vercel keeps looking at the wrong directory.
  nitro: {
    preset: "vercel",
    output: {
      dir: ".vercel/output",
      serverDir: ".vercel/output/functions/__server.func",
      publicDir: ".vercel/output/static",
    },
  },
});

// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Force-on Nitro with the Vercel preset so `vite build` emits the
// Vercel Build Output API v3 layout at `.vercel/output`. This makes
// Vercel deployments work out of the box (SSR, SPA fallback, nested
// routes, refresh-safe URLs, static asset hashing) without a custom
// vercel.json routes table.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: process.env.NITRO_PRESET ?? "vercel",
  },
});

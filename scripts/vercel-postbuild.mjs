#!/usr/bin/env node
// Transform Nitro's `dist/` output into Vercel Build Output API v3
// at `.vercel/output/`, which Vercel auto-detects on deploy.
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");
const out = resolve(root, ".vercel/output");

if (!existsSync(dist)) {
  console.error("[vercel-postbuild] dist/ not found — run `vite build` first");
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// 1) config.json — Nitro already emits a BOA v3-compatible one
copyFileSync(resolve(dist, "config.json"), resolve(out, "config.json"));

// 2) Static assets → .vercel/output/static
cpSync(resolve(dist, "client"), resolve(out, "static"), { recursive: true });

// 3) SSR function → .vercel/output/functions/__server.func
const fnDir = resolve(out, "functions/__server.func");
mkdirSync(fnDir, { recursive: true });
cpSync(resolve(dist, "server"), fnDir, { recursive: true });

writeFileSync(
  resolve(fnDir, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs22.x",
      handler: "index.mjs",
      launcherType: "Nodejs",
      shouldAddHelpers: false,
      supportsResponseStreaming: true,
    },
    null,
    2,
  ),
);

console.log("[vercel-postbuild] Wrote .vercel/output (Build Output API v3)");

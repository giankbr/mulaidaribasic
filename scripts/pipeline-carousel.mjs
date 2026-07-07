#!/usr/bin/env node
/**
 * Full carousel pipeline: generate → render → upload.
 *
 * Usage:
 *   node scripts/pipeline-carousel.mjs "Git basic 3 command wajib pemula"
 *   node scripts/pipeline-carousel.mjs --from-md microblog/2026-07-07-git-basic.md --queue
 */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith("--"));
const fromMdIdx = args.indexOf("--from-md");
const fromMd = fromMdIdx >= 0 ? args[fromMdIdx + 1] : null;
const topic = args.find((a) => !a.startsWith("--"));

function run(cmd, cmdArgs) {
  console.log(`\n$ ${cmd} ${cmdArgs.join(" ")}`);
  const result = spawnSync(cmd, cmdArgs, { cwd: ROOT, stdio: "inherit", env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const uploadFlags = flags.filter((f) => ["--queue", "--draft", "--dry-run"].includes(f));
const scheduleVal = args[args.indexOf("--schedule") + 1];
if (scheduleVal) uploadFlags.push("--schedule", scheduleVal);

let mdPath;

if (fromMd) {
  mdPath = fromMd;
} else if (topic) {
  run("node", ["scripts/generate-microblog.mjs", topic]);
  const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const date = new Date().toISOString().slice(0, 10);
  mdPath = `microblog/${date}-${slug}.md`;
} else {
  console.error('Usage: node scripts/pipeline-carousel.mjs "topic"');
  console.error("       node scripts/pipeline-carousel.mjs --from-md microblog/xxx.md [--queue]");
  process.exit(1);
}

if (!existsSync(join(ROOT, mdPath))) {
  console.error(`Microblog not found: ${mdPath}`);
  process.exit(1);
}

run("node", ["scripts/render-microblog.mjs", mdPath]);
run("node", ["scripts/upload-tiktok.mjs", "carousel", mdPath, ...uploadFlags]);

console.log("\n✓ Carousel pipeline complete");

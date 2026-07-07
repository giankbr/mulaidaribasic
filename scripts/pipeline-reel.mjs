#!/usr/bin/env node
/**
 * Full reel pipeline: generate → render → upload.
 *
 * Usage:
 *   node scripts/pipeline-reel.mjs "Apa itu HTTP request"
 *   node scripts/pipeline-reel.mjs --from-script scripts/2026-07-07-apa-itu-http.md
 *   node scripts/pipeline-reel.mjs --from-script scripts/xxx.md --queue
 */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith("--"));
const fromScriptIdx = args.indexOf("--from-script");
const fromScript = fromScriptIdx >= 0 ? args[fromScriptIdx + 1] : null;
const topic = fromScript ? null : args.find((a) => !a.startsWith("--"));

function run(cmd, cmdArgs) {
  console.log(`\n$ ${cmd} ${cmdArgs.join(" ")}`);
  const result = spawnSync(cmd, cmdArgs, { cwd: ROOT, stdio: "inherit", env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const uploadFlags = flags.filter((f) => ["--queue", "--draft", "--dry-run"].includes(f));
const scheduleIdx = args.indexOf("--schedule");
if (scheduleIdx >= 0) {
  uploadFlags.push("--schedule", args[scheduleIdx + 1]);
}

let scriptPath;

if (fromScript) {
  scriptPath = fromScript;
  if (!existsSync(join(ROOT, scriptPath)) && !existsSync(fromScript)) {
    console.error(`Script not found: ${fromScript}`);
    process.exit(1);
  }
} else if (topic) {
  run("node", ["scripts/generate-script.mjs", topic]);
  const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const date = new Date().toISOString().slice(0, 10);
  scriptPath = `scripts/${date}-${slug}.md`;
} else {
  console.error('Usage: node scripts/pipeline-reel.mjs "topic"');
  console.error("       node scripts/pipeline-reel.mjs --from-script scripts/xxx.md [--queue]");
  process.exit(1);
}

run("node", ["scripts/render-reel.mjs", scriptPath]);
run("node", ["scripts/upload-tiktok.mjs", "reel", scriptPath, ...uploadFlags]);

console.log("\n✓ Reel pipeline complete");

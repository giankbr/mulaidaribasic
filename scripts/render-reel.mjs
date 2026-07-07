import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { parseReelScript } from "./lib/copy.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REPO_ROOT = join(ROOT, "..");
const REMOTION = join(ROOT, "remotion");

function resolveInputPath(scriptPath) {
  if (scriptPath.startsWith("/")) return scriptPath;
  const candidates = [
    join(ROOT, scriptPath),
    join(REPO_ROOT, scriptPath),
    scriptPath,
  ];
  for (const p of candidates) {
    try {
      readFileSync(p);
      return p;
    } catch {
      /* try next */
    }
  }
  return join(ROOT, scriptPath);
}

const scriptArg = process.argv[2];
if (!scriptArg) {
  console.error("Usage: node scripts/render-reel.mjs <script.md> [output.mp4]");
  process.exit(1);
}

const absScript = resolveInputPath(scriptArg);
const slug = basename(scriptArg, ".md");
const output = process.argv[3]
  ? join(ROOT, process.argv[3])
  : join(ROOT, "output", "reels", `${slug}.mp4`);

const raw = readFileSync(absScript, "utf8");
const parsed = parseReelScript(raw);

const props = {
  title: parsed.title,
  hook: parsed.hook,
  ...(parsed.hookSubtitle ? { hookSubtitle: parsed.hookSubtitle } : {}),
  points: parsed.points,
  cta: parsed.cta,
  thumbnailText: parsed.thumbnailText,
};

const propsPath = join(REMOTION, ".render-props.json");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(propsPath, JSON.stringify(props, null, 2));

console.log(`→ Rendering ${slug}`);
console.log(`  Hook: ${props.hook}`);
console.log(`  Out:  ${output}`);

const result = spawnSync(
  "npx",
  ["remotion", "render", "src/index.ts", "BasicReel", output, `--props=${propsPath}`],
  { cwd: REMOTION, stdio: "inherit", env: process.env }
);

rmSync(propsPath, { force: true });
if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`✓ Done: ${output}`);

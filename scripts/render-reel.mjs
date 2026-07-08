import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { parseReelScript } from "./lib/copy.mjs";
import {
  ensureReelVisuals,
  syncExistingReelVisuals,
} from "./lib/visual-assets.mjs";
import { generateVoiceover } from "./lib/voiceover.mjs";

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
const flags = new Set(process.argv.slice(3).filter((a) => a.startsWith("--")));
if (!scriptArg) {
  console.error(
    "Usage: node scripts/render-reel.mjs <script.md> [output.mp4] [--ai] [--force-ai] [--no-voice]"
  );
  process.exit(1);
}

const absScript = resolveInputPath(scriptArg);
const slug = basename(scriptArg, ".md");
const positional = process.argv.slice(3).filter((a) => !a.startsWith("--"));
const output = positional[0]
  ? join(ROOT, positional[0])
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

const useAi = flags.has("--ai") || flags.has("--force-ai");
const forceAi = flags.has("--force-ai");
const withVoice = !flags.has("--no-voice");
const visualAssets = useAi
  ? await ensureReelVisuals(slug, parsed, { force: forceAi })
  : syncExistingReelVisuals(slug);
if (Object.keys(visualAssets).length > 0) {
  props.visualAssets = visualAssets;
}

if (withVoice) {
  console.log("→ Generating voiceover + karaoke captions…");
  try {
    const voice = await generateVoiceover(slug, parsed, {
      workDir: join(ROOT, "output", "voiceovers", slug),
      publicDir: join(REMOTION, "public", "voiceovers"),
    });
    props.voiceoverSrc = voice.voiceoverSrc;
    props.captions = voice.captions;
    console.log(`  Voice: ${voice.audioPath}`);
    console.log(`  Captions: ${voice.captions.length} tokens`);
  } catch (err) {
    console.warn(`  Voiceover skipped: ${err.message}`);
  }
}

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

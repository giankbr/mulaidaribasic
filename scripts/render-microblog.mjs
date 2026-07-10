#!/usr/bin/env node
/**
 * Render IG microblog carousel slides (PNG, 4:5) for @mulaidaribasic.
 *
 * Usage:
 *   node scripts/render-microblog.mjs microblog/2026-07-07-topic.md
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { parseMicroblog } from "./lib/microblog-parse.mjs";
import { MICROBLOG_HEIGHT, MICROBLOG_WIDTH } from "./lib/dimensions.mjs";
import {
  ensureMicroblogVisuals,
  syncExistingMicroblogVisuals,
} from "./lib/visual-assets.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REPO_ROOT = join(ROOT, "..");
const REMOTION = join(ROOT, "remotion");

const COMPOSITION_WIDTH = MICROBLOG_WIDTH;
const COMPOSITION_HEIGHT = MICROBLOG_HEIGHT;
const RENDER_SCALE = Math.max(1, Number(process.env.MICROBLOG_SCALE) || 1);
const RENDER_FRAME = Math.max(0, Number(process.env.MICROBLOG_FRAME) || 24);

function resolveInputPath(input) {
  if (input.startsWith("/")) return input;
  const candidates = [join(ROOT, input), join(REPO_ROOT, input), input];
  for (const p of candidates) {
    try {
      readFileSync(p);
      return p;
    } catch {
      /* try next */
    }
  }
  return join(ROOT, input);
}

const input = process.argv[2];
const flags = new Set(process.argv.slice(3).filter((a) => a.startsWith("--")));
if (!input) {
  console.error("Usage: node scripts/render-microblog.mjs microblog/<file>.md [--ai] [--force-ai]");
  process.exit(1);
}

const mdPath = resolveInputPath(input);
const slug = basename(input, ".md");
const outDir = join(ROOT, "output", "microblog", slug);
const md = readFileSync(mdPath, "utf8");
const { title, slides, caption } = parseMicroblog(md);

if (slides.length === 0) {
  console.error("No slides parsed — check markdown format");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
if (caption) {
  writeFileSync(join(outDir, "caption.txt"), caption + "\n");
}

console.log(`→ Rendering microblog: ${title}`);
console.log(`  Slides: ${slides.length}`);
console.log(
  `  Size:   ${COMPOSITION_WIDTH * RENDER_SCALE}×${COMPOSITION_HEIGHT * RENDER_SCALE} (@${RENDER_SCALE}x)`
);
console.log(`  Out:    ${outDir}/`);

const useAi = flags.has("--ai") || flags.has("--force-ai");
const forceAi = flags.has("--force-ai");
const slideAssets = useAi
  ? await ensureMicroblogVisuals(slug, slides, { force: forceAi })
  : syncExistingMicroblogVisuals(slug, slides.length);

for (const slide of slides) {
  const num = String(slide.slideIndex).padStart(2, "0");
  const outFile = join(outDir, `${num}.png`);
  const propsPath = join(REMOTION, `.slide-${num}.json`);
  const props = {
    ...slide,
    visualSeed: slug,
    ...(slideAssets[slide.slideIndex] ? { assetPath: slideAssets[slide.slideIndex] } : {}),
  };
  writeFileSync(propsPath, JSON.stringify(props));

  const result = spawnSync(
    "npx",
    [
      "remotion",
      "still",
      "src/index.ts",
      "MicroblogSlide",
      outFile,
      `--props=${propsPath}`,
      `--scale=${RENDER_SCALE}`,
      `--frame=${RENDER_FRAME}`,
    ],
    { cwd: REMOTION, stdio: "inherit", env: process.env }
  );

  rmSync(propsPath, { force: true });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`✓ Done: ${outDir}/`);
console.log(`  caption.txt — paste ke TikTok`);

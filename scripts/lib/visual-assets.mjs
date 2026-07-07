import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { buildImagePrompt, generateGeminiImage } from "./gemini-image.mjs";
import { loadEnv, ROOT } from "./env.mjs";

const ASSET_ROOT = join(ROOT, "assets", "generated");
const PUBLIC_ROOT = join(ROOT, "remotion", "public", "generated");

function assetPath(slug, filename) {
  return join(ASSET_ROOT, slug, filename);
}

function publicRel(slug, filename) {
  return `generated/${slug}/${filename}`;
}

export function syncAssetToPublic(slug, filename) {
  const src = assetPath(slug, filename);
  if (!existsSync(src)) return null;

  const destDir = join(PUBLIC_ROOT, slug);
  mkdirSync(destDir, { recursive: true });
  copyFileSync(src, join(destDir, filename));
  return publicRel(slug, filename);
}

async function ensureOne({ apiKey, slug, filename, description, force }) {
  const out = assetPath(slug, filename);
  if (!force && existsSync(out)) {
    console.log(`  ✓ cached ${slug}/${filename}`);
    return syncAssetToPublic(slug, filename);
  }

  const prompt = buildImagePrompt(description);
  console.log(`  → generating ${slug}/${filename}`);
  await generateGeminiImage(apiKey, prompt, out);
  console.log(`  ✓ saved assets/generated/${slug}/${filename}`);
  return syncAssetToPublic(slug, filename);
}

function sceneDescription(title, body) {
  return [title, body].filter(Boolean).join(". ").slice(0, 280);
}

/**
 * Generate reel scene illustrations (hook + 3 points). Skips CTA.
 * Returns map of scene key → remotion public path.
 */
export async function ensureReelVisuals(slug, parsed, { force = false } = {}) {
  loadEnv();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.startsWith("your-")) {
    console.warn("⚠ GEMINI_API_KEY missing — using SVG fallback visuals");
    return {};
  }

  const scenes = [
    { key: "hook", file: "hook.png", desc: sceneDescription(parsed.hook, parsed.hookSubtitle) },
    { key: "p1", file: "p1.png", desc: sceneDescription(parsed.points[0]?.title, parsed.points[0]?.body) },
    { key: "p2", file: "p2.png", desc: sceneDescription(parsed.points[1]?.title, parsed.points[1]?.body) },
    { key: "p3", file: "p3.png", desc: sceneDescription(parsed.points[2]?.title, parsed.points[2]?.body) },
  ];

  console.log(`→ Gemini visuals for reel: ${slug}`);
  const visualAssets = {};

  for (const scene of scenes) {
    if (!scene.desc) continue;
    try {
      const rel = await ensureOne({
        apiKey,
        slug,
        filename: scene.file,
        description: scene.desc,
        force,
      });
      if (rel) visualAssets[scene.key] = rel;
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      console.warn(`  ⚠ ${scene.file} failed: ${err.message}`);
    }
  }

  return visualAssets;
}

/**
 * Generate microblog slide illustrations. Skips CTA slides with visual none.
 */
export async function ensureMicroblogVisuals(slug, slides, { force = false } = {}) {
  loadEnv();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.startsWith("your-")) {
    console.warn("⚠ GEMINI_API_KEY missing — using SVG fallback visuals");
    return {};
  }

  console.log(`→ Gemini visuals for microblog: ${slug}`);
  const slideAssets = {};

  for (const slide of slides) {
    if (slide.variant === "cta" && slide.visual === "none") continue;

    const num = String(slide.slideIndex).padStart(2, "0");
    const filename = `slide-${num}.png`;
    const desc = sceneDescription(slide.headline, slide.subtitle);

    try {
      const rel = await ensureOne({ apiKey, slug, filename, description: desc, force });
      if (rel) slideAssets[slide.slideIndex] = rel;
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      console.warn(`  ⚠ slide-${num} failed: ${err.message}`);
    }
  }

  return slideAssets;
}

/** Sync existing PNGs from assets/generated to remotion/public without generating. */
export function syncExistingReelVisuals(slug) {
  const visualAssets = {};
  for (const [key, file] of [
    ["hook", "hook.png"],
    ["p1", "p1.png"],
    ["p2", "p2.png"],
    ["p3", "p3.png"],
  ]) {
    const rel = syncAssetToPublic(slug, file);
    if (rel) visualAssets[key] = rel;
  }
  return visualAssets;
}

export function syncExistingMicroblogVisuals(slug, slideCount) {
  const slideAssets = {};
  for (let i = 1; i <= slideCount; i++) {
    const num = String(i).padStart(2, "0");
    const rel = syncAssetToPublic(slug, `slide-${num}.png`);
    if (rel) slideAssets[i] = rel;
  }
  return slideAssets;
}

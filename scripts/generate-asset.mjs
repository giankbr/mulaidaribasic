#!/usr/bin/env node
/**
 * Generate minimalist IT illustration via Gemini API.
 *
 * Usage:
 *   node scripts/generate-asset.mjs "HTTP request response concept"
 *   node scripts/generate-asset.mjs "Git branch merge concept" --slug git-branch
 *
 * Output: assets/generated/<slug>.png
 * Requires: GEMINI_API_KEY in .env
 */

import { join } from "node:path";
import { loadEnv, requireEnv, ROOT } from "./lib/env.mjs";
import { buildImagePrompt, generateGeminiImage } from "./lib/gemini-image.mjs";

loadEnv();

const args = process.argv.slice(2);
const slugFlag = args.indexOf("--slug");
const slugOverride = slugFlag >= 0 ? args[slugFlag + 1] : undefined;
const topic = args.find((a, i) => a !== "--slug" && i !== slugFlag + 1);

if (!topic) {
  console.error('Usage: node scripts/generate-asset.mjs "topic description" [--slug custom-slug]');
  process.exit(1);
}

const apiKey = requireEnv("GEMINI_API_KEY");

const slug =
  slugOverride ??
  topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

const outPath = join(ROOT, "assets", "generated", `${slug}.png`);
const imagePrompt = buildImagePrompt(topic);

try {
  await generateGeminiImage(apiKey, imagePrompt, outPath);
  console.log(`✓ Asset saved: assets/generated/${slug}.png`);
} catch (err) {
  console.error("✗", err.message);
  process.exit(1);
}

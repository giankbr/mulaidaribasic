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

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REPO_ROOT = join(ROOT, "..");

function loadEnv() {
  for (const envPath of [join(ROOT, ".env"), join(REPO_ROOT, ".env")]) {
    if (!existsSync(envPath)) continue;
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) {
        process.env[m[1].trim()] = m[2].trim();
      }
    }
  }
}

loadEnv();

const args = process.argv.slice(2);
const slugFlag = args.indexOf("--slug");
const slugOverride = slugFlag >= 0 ? args[slugFlag + 1] : undefined;
const topic = args.find((a, i) => a !== "--slug" && i !== slugFlag + 1);

if (!topic) {
  console.error('Usage: node scripts/generate-asset.mjs "topic description" [--slug custom-slug]');
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Missing GEMINI_API_KEY — add to mulaidaribasic/.env or root .env");
  process.exit(1);
}

const slug =
  slugOverride ??
  topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

const outDir = join(ROOT, "assets", "generated");
const outPath = join(outDir, `${slug}.png`);
mkdirSync(outDir, { recursive: true });

const imagePrompt = `Minimalist flat illustration of ${topic}, soft light blue (#DBEAFE) and white palette, clean educational style for IT beginners, watercolor-soft edges, no text, no letters, transparent-friendly light background, nuclaratx-inspired editorial illustration`;

const model = "gemini-2.0-flash-preview-image-generation";
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [{ parts: [{ text: imagePrompt }] }],
    generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
  }),
});

if (!res.ok) {
  const errText = await res.text();
  console.error("Gemini API error:", res.status, errText);
  process.exit(1);
}

const data = await res.json();
const parts = data.candidates?.[0]?.content?.parts ?? [];
const imagePart = parts.find((p) => p.inlineData?.data);

if (!imagePart?.inlineData?.data) {
  console.error("No image in Gemini response:", JSON.stringify(data, null, 2).slice(0, 500));
  process.exit(1);
}

const buffer = Buffer.from(imagePart.inlineData.data, "base64");
writeFileSync(outPath, buffer);
console.log(`✓ Asset saved: assets/generated/${slug}.png`);

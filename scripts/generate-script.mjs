#!/usr/bin/env node
/**
 * Generate caption + script draft via Z.ai API for @mulaidaribasic.
 *
 * Usage:
 *   node scripts/generate-script.mjs "Apa itu HTTP request"
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
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

const topic = process.argv[2];
if (!topic) {
  console.error('Usage: node scripts/generate-script.mjs "topic"');
  process.exit(1);
}

const apiKey = process.env.ZAI_CODING_API_KEY;
if (!apiKey) {
  console.error("Missing ZAI_CODING_API_KEY — copy .env.example to .env and fill it in.");
  process.exit(1);
}

const brief = readFileSync(join(ROOT, "content/brief.md"), "utf8");
const copyRules = readFileSync(join(ROOT, "content/copy-rules.md"), "utf8");
const template = readFileSync(join(ROOT, "templates/script-template.md"), "utf8");

const slug = topic
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 40);

const date = new Date().toISOString().slice(0, 10);
const outPath = join(ROOT, "scripts", `${date}-${slug}.md`);

const prompt = `Kamu educator IT personal brand @mulaidaribasic (Mulai Dari Basic / virgian.tech).
Tone: humble, edukatif, jelas — BUKAN agency speak. Target: pemula IT.

COPY RULES (WAJIB):
${copyRules}

BRAND BRIEF:
${brief}

TEMPLATE:
${template}

Topik: "${topic}"

Setiap hook WAJIB pakai **Headline:** dan **Subtitle:** terpisah.
Setiap poin WAJIB pakai **Judul:** (6-10 kata) dan **Isi:** (2-3 kalimat, 24-40 kata) terpisah.
Visual notes: light background, biru #3B82F6, match virgian.tech.
Thumbnail text: uppercase singkat (e.g. HTTP BASIC).
CTA: Follow @mulaidaribasic / Save buat belajar nanti / Share ke temen yang baru mulai.
Jangan pakai asterisk untuk italic. Kalimat pakai koma/titik biasa. Dilarang em dash (—), --, dan ---.
Output hanya markdown file, tanpa penjelasan.`;

const res = await fetch("https://api.z.ai/api/coding/paas/v4/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: "glm-5.2",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.55,
    max_tokens: 4096,
  }),
});

if (!res.ok) {
  console.error("API error:", res.status, await res.text());
  process.exit(1);
}

const data = await res.json();
const content = data.choices?.[0]?.message?.content ?? "";

writeFileSync(outPath, content.trim() + "\n");
console.log(`✓ Script saved: scripts/${date}-${slug}.md`);

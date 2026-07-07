#!/usr/bin/env node
/**
 * Generate IG microblog carousel (markdown) via Z.ai API for @mulaidaribasic.
 *
 * Usage:
 *   node scripts/generate-microblog.mjs "Git basic: 3 command wajib pemula"
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
  console.error('Usage: node scripts/generate-microblog.mjs "topic"');
  process.exit(1);
}

const apiKey = process.env.ZAI_CODING_API_KEY;
if (!apiKey) {
  console.error("Missing ZAI_CODING_API_KEY");
  process.exit(1);
}

const brief = readFileSync(join(ROOT, "content/brief.md"), "utf8");
const copyRules = readFileSync(join(ROOT, "content/copy-rules.md"), "utf8");
const template = readFileSync(join(ROOT, "templates/microblog-template.md"), "utf8");

const slug = topic
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 48);

const date = new Date().toISOString().slice(0, 10);
const outPath = join(ROOT, "microblog", `${date}-${slug}.md`);

const prompt = `Kamu educator IT personal brand @mulaidaribasic (Mulai Dari Basic / virgian.tech).
Tone: humble, edukatif, jelas — BUKAN agency speak. Target: pemula IT.

COPY RULES (WAJIB):
${copyRules}

BRAND BRIEF:
${brief}

TEMPLATE:
${template}

Topik: "${topic}"

Tulis IG microblog carousel 6 slide. Setiap slide: **Headline** + **Subtitle** (2-3 kalimat, 24-40 kata) + **Detail** (2 bullet, 10-16 kata).
Opsional: **Visual** (api|layers|code|grid|nodes|monolith|pipeline|cloud|wireframe|product|none) dan **Code** (2-4 baris jika visual code).
Slide 1 hook: pakai **Visual:** api atau code. Slide CTA: **Visual:** none.
**CTA:** rotate (Save buat belajar nanti, Follow @mulaidaribasic, Share ke temen yang baru mulai, Link di bio → virgian.tech).
Pakai pipe (|) untuk pecah baris headline. Pakai **accent** pada kata kunci di headline.
Hashtags: #MulaiDariBasic #BelajarIT #WebDev #ProgrammingIndonesia
Kalimat pakai koma/titik biasa. Dilarang em dash (—), --, dan ---.
Detail panjang hanya di caption IG.`;

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
console.log(`✓ Microblog saved: microblog/${date}-${slug}.md`);

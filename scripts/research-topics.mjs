#!/usr/bin/env node
/**
 * Turn TikTok trend data into topic ideas for @mulaidaribasic.
 *
 * Input: JSON from Apify TikTok Scraper or Hermes MCP export.
 * Output: calendar/next-topics.json
 *
 * Usage:
 *   node scripts/research-topics.mjs calendar/raw-trends.json
 *   node scripts/research-topics.mjs --hashtags BelajarIT,BelajarCoding,WebDev
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv, ROOT } from "./lib/env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnv();

const EDU_KEYWORDS = [
  "belajar", "coding", "programming", "developer", "web", "api", "git",
  "database", "backend", "frontend", "tutorial", "pemula", "basic", "http",
  "javascript", "python", "tips", "roadmap", "junior",
];

const PILLARS = [
  "Web Basic", "Backend Basic", "Database Basic",
  "Git & Tools", "Konsep Fundamental", "Belajar IT",
];

function scoreItem(item) {
  const text = [
    item.text, item.desc, item.description, item.title,
    item.hashtag, ...(item.hashtags || []),
  ].filter(Boolean).join(" ").toLowerCase();

  let score = 0;
  for (const kw of EDU_KEYWORDS) {
    if (text.includes(kw)) score += 2;
  }
  score += Math.min(10, Math.log10((item.playCount || item.views || item.diggCount || item.likes || 1) + 1));
  if (/indonesia|indonesian|id\b|gue|kamu|pemula/i.test(text)) score += 3;
  if (/drama|gossip|prank|giveaway/i.test(text)) score -= 10;
  return score;
}

function itemToTopic(item) {
  const text = (item.text || item.desc || item.description || "").trim();
  const hook = text.split(/[.!?\n]/)[0]?.slice(0, 120) || "Konsep IT basic untuk pemula";
  return {
    topic: hook,
    source: item.webVideoUrl || item.url || item.id || "unknown",
    engagement: item.playCount || item.views || item.diggCount || 0,
    score: scoreItem(item),
  };
}

function guessPillar(topic) {
  const t = topic.toLowerCase();
  if (/git|terminal|tool/i.test(t)) return "Git & Tools";
  if (/database|sql|postgres|mongo/i.test(t)) return "Database Basic";
  if (/api|backend|server|nestjs|express/i.test(t)) return "Backend Basic";
  if (/http|rest|html|css|browser|web/i.test(t)) return "Web Basic";
  if (/roadmap|mindset|belajar|junior|pemula/i.test(t)) return "Belajar IT";
  return "Konsep Fundamental";
}

async function fetchApifyHashtags(hashtags) {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) {
    console.error("APIFY_API_TOKEN not set — use Hermes + Apify MCP to export calendar/raw-trends.json");
    process.exit(1);
  }

  const runRes = await fetch(
    `https://api.apify.com/v2/acts/clockworks~tiktok-scraper/runs?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hashtags,
        resultsPerPage: 30,
        shouldDownloadVideos: false,
        shouldDownloadCovers: false,
      }),
    }
  );
  const run = await runRes.json();
  const runId = run.data?.id;
  if (!runId) throw new Error("Apify run failed: " + JSON.stringify(run));

  console.log(`→ Apify run started: ${runId}`);
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
    const status = await statusRes.json();
    if (status.data?.status === "SUCCEEDED") {
      const dsId = status.data.defaultDatasetId;
      const dataRes = await fetch(`https://api.apify.com/v2/datasets/${dsId}/items?token=${token}`);
      return dataRes.json();
    }
    if (status.data?.status === "FAILED") throw new Error("Apify run failed");
    process.stdout.write(".");
  }
  throw new Error("Apify run timed out");
}

async function main() {
  const args = process.argv.slice(2);
  let items = [];

  if (args[0] === "--hashtags") {
    const tags = (args[1] || "BelajarIT,BelajarCoding,WebDev").split(",").map((t) => t.trim());
    items = await fetchApifyHashtags(tags);
  } else {
    const inputPath = args[0] || join(ROOT, "calendar", "raw-trends.json");
    if (!existsSync(inputPath)) {
      console.error(`Input not found: ${inputPath}`);
      console.error("Export TikTok data via Hermes + Apify MCP, or run with --hashtags");
      process.exit(1);
    }
    items = JSON.parse(readFileSync(inputPath, "utf8"));
    if (!Array.isArray(items)) items = items.items || items.data || [];
  }

  const ranked = items
    .map(itemToTopic)
    .filter((t) => t.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const output = {
    generated_at: new Date().toISOString(),
    brand: "@mulaidaribasic",
    topics: ranked.slice(0, 5).map((t, i) => ({
      rank: i + 1,
      topic: t.topic,
      pillar: guessPillar(t.topic),
      engagement: t.engagement,
      score: Math.round(t.score * 10) / 10,
      source: t.source,
      suggested_format: i % 2 === 0 ? "reel" : "carousel",
    })),
  };

  const outPath = join(ROOT, "calendar", "next-topics.json");
  mkdirSync(join(ROOT, "calendar"), { recursive: true });
  writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n");

  console.log(`✓ ${output.topics.length} topics → ${outPath}`);
  for (const t of output.topics) {
    console.log(`  ${t.rank}. [${t.suggested_format}] ${t.topic.slice(0, 60)}`);
  }
}

main().catch((err) => {
  console.error("✗", err.message);
  process.exit(1);
});

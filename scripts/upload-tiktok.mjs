#!/usr/bin/env node
/**
 * Upload rendered content to TikTok via Upload-Post.
 *
 * Usage:
 *   node scripts/upload-tiktok.mjs reel <script.md|output/reels/slug.mp4>
 *   node scripts/upload-tiktok.mjs carousel <microblog.md|output/microblog/slug>
 *
 * Options:
 *   --queue              Add to Upload-Post queue (uses schedule.json slots)
 *   --schedule ISO_DATE  Schedule for specific time (e.g. 2026-07-08T12:00:00)
 *   --draft              TikTok draft mode (MEDIA_UPLOAD)
 *   --dry-run            Print payload summary without uploading
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv, requireEnv, ROOT } from "./lib/env.mjs";
import { captionFromReelScript, captionFromMicroblog } from "./lib/caption.mjs";
import { uploadReelVideo, uploadPhotoCarousel } from "./lib/upload-post.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnv();

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const positional = args.filter((a) => !a.startsWith("--"));

const type = positional[0];
const input = positional[1];

if (!type || !input || !["reel", "carousel"].includes(type)) {
  console.error(`Usage: node scripts/upload-tiktok.mjs <reel|carousel> <path> [--queue] [--schedule ISO] [--draft] [--dry-run]`);
  process.exit(1);
}

function resolvePath(p) {
  if (p.startsWith("/")) return p;
  return resolve(ROOT, p);
}

function sortedPngs(dir) {
  return readdirSync(dir)
    .filter((f) => /^\d+\.png$/.test(f))
    .sort()
    .map((f) => join(dir, f));
}

async function main() {
  const dryRun = flags.has("--dry-run");
  const apiKey = dryRun ? (process.env.UPLOAD_POST_API_KEY || "dry-run") : requireEnv("UPLOAD_POST_API_KEY");
  const profile = process.env.UPLOAD_POST_PROFILE || "mulaidaribasic";
  const timezone = process.env.TZ || "Asia/Jakarta";

  const options = {
    timezone,
    addToQueue: flags.has("--queue"),
    scheduledDate: args.find((a, i) => args[i - 1] === "--schedule"),
    postMode: flags.has("--draft") ? "MEDIA_UPLOAD" : "DIRECT_POST",
    idempotencyKey: `${type}-${basename(input).replace(/\.[^.]+$/, "")}-${Date.now()}`,
  };

  if (type === "reel") {
    let videoPath;
    let caption;

    if (input.endsWith(".mp4")) {
      videoPath = resolvePath(input);
      const slug = basename(input, ".mp4");
      const scriptPath = join(ROOT, "scripts", `${slug}.md`);
      caption = existsSync(scriptPath)
        ? captionFromReelScript(readFileSync(scriptPath, "utf8"))
        : slug;
    } else {
      const scriptPath = resolvePath(input);
      const slug = basename(input, ".md");
      videoPath = join(ROOT, "output", "reels", `${slug}.mp4`);
      caption = captionFromReelScript(readFileSync(scriptPath, "utf8"));
    }

    if (!existsSync(videoPath)) {
      console.error(`Video not found: ${videoPath}\nRun: npm run render:reel -- ${input}`);
      process.exit(1);
    }
    if (!caption) {
      console.error("No caption found in script (## Caption block)");
      process.exit(1);
    }

    console.log(`→ Upload reel: ${basename(videoPath)}`);
    console.log(`  Profile: ${profile}`);
    console.log(`  Caption: ${caption.slice(0, 80)}…`);

    if (flags.has("--dry-run")) {
      console.log(JSON.stringify({ type, videoPath, captionLength: caption.length, options }, null, 2));
      return;
    }

    const result = await uploadReelVideo({ apiKey, profile, videoPath, caption, options });
    console.log("✓ Upload queued:", result.request_id || result.job_id || JSON.stringify(result));
    return;
  }

  // carousel
  let photoDir;
  let caption;
  const resolved = resolvePath(input);

  if (resolved.endsWith(".md")) {
    const slug = basename(input, ".md");
    photoDir = join(ROOT, "output", "microblog", slug);
    caption = captionFromMicroblog(resolved, ROOT);
  } else if (existsSync(resolved) && !resolved.endsWith(".png")) {
    photoDir = resolved;
    const slug = basename(resolved);
    const mdPath = join(ROOT, "microblog", `${slug}.md`);
    caption = existsSync(join(photoDir, "caption.txt"))
      ? readFileSync(join(photoDir, "caption.txt"), "utf8").trim()
      : existsSync(mdPath)
        ? captionFromMicroblog(mdPath, ROOT)
        : "";
  } else {
    console.error("Invalid carousel path — pass microblog .md or output directory");
    process.exit(1);
  }

  const photos = sortedPngs(photoDir);
  if (photos.length === 0) {
    console.error(`No PNG slides in ${photoDir}\nRun: npm run render:microblog -- microblog/<file>.md`);
    process.exit(1);
  }
  if (!caption) {
    console.error("No caption found");
    process.exit(1);
  }

  console.log(`→ Upload carousel: ${basename(photoDir)} (${photos.length} slides)`);
  console.log(`  Profile: ${profile}`);
  console.log(`  Caption: ${caption.slice(0, 80)}…`);

  if (flags.has("--dry-run")) {
    console.log(JSON.stringify({ type, photoDir, slideCount: photos.length, options }, null, 2));
    return;
  }

  const result = await uploadPhotoCarousel({ apiKey, profile, photoPaths: photos, caption, options });
  console.log("✓ Upload queued:", result.request_id || result.job_id || JSON.stringify(result));
}

main().catch((err) => {
  console.error("✗", err.message);
  process.exit(1);
});

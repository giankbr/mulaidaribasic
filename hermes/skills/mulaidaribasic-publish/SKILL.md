---
name: mulaidaribasic-publish
description: Generate, render, and publish @mulaidaribasic TikTok content via the local pipeline.
---

# Mulai Dari Basic — Publish Pipeline

Generate, render, and upload TikTok content for @mulaidaribasic.

## Project path

```
MULAI_DARI_BASIC_ROOT=/Users/gian/Documents/dev/mulaidaribasic
```

## Prerequisites

`.env` must have:

- `ZAI_CODING_API_KEY` — script generation
- `GEMINI_API_KEY` — asset generation (optional)
- `UPLOAD_POST_API_KEY` — TikTok upload
- `UPLOAD_POST_PROFILE=mulaidaribasic`

## Commands

### Full reel pipeline (generate → render → upload)

```bash
cd $MULAI_DARI_BASIC_ROOT
npm run pipeline:reel -- "Apa itu HTTP request dan response" --queue
```

### Full carousel pipeline

```bash
npm run pipeline:carousel -- "Git basic 3 command wajib pemula" --queue
```

### Upload existing render only

```bash
npm run upload:tiktok -- reel scripts/2026-07-07-apa-itu-http-request-dan-response.md --queue
npm run upload:tiktok -- carousel microblog/2026-07-07-git-basic-3-command-wajib-pemula.md --queue
```

### Dry run (no upload)

```bash
npm run upload:tiktok -- reel scripts/xxx.md --dry-run
```

## Flags

| Flag | Effect |
|------|--------|
| `--queue` | Add to Upload-Post queue (uses configured TikTok slots) |
| `--schedule ISO_DATE` | Schedule for specific datetime |
| `--draft` | TikTok draft mode (MEDIA_UPLOAD — publish from phone) |
| `--dry-run` | Preview without uploading |

## Via n8n webhook

```bash
# Publish reel
curl -X POST http://localhost:5678/webhook/mulaidaribasic \
  -H "Content-Type: application/json" \
  -d '{"action":"reel","topic":"Apa itu REST API","queue":true}'

# Publish carousel
curl -X POST http://localhost:5678/webhook/mulaidaribasic \
  -H "Content-Type: application/json" \
  -d '{"action":"carousel","topic":"3 error HTTP yang sering ketemu pemula","queue":true}'
```

## Posting schedule (WIB)

From `config/schedule.json`:

| Format | Days | Time |
|--------|------|------|
| Reel | Tue, Thu, Sat | 12:00 |
| Carousel | Mon, Wed | 12:00 |

Use `--queue` to let Upload-Post assign the next available slot.

## Error recovery

| Error | Fix |
|-------|-----|
| Video not found | Run `npm run render:reel -- scripts/xxx.md` first |
| Missing API key | Fill `.env` from `.env.example` |
| Upload failed | Check Upload-Post dashboard, retry with `--dry-run` |

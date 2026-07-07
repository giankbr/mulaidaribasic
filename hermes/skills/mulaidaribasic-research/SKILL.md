---
name: mulaidaribasic-research
description: Research TikTok trends and generate topic ideas for @mulaidaribasic content pipeline.
---

# Mulai Dari Basic — Content Research

Research trending TikTok edu content and output topic ideas for the content pipeline.

## Project path

```
MULAI_DARI_BASIC_ROOT=/Users/gian/Documents/dev/mulaidaribasic
```

## Workflow

### Step 1 — Scrape TikTok trends

Use **Apify TikTok Scraper** MCP (`clockworks/tiktok-scraper`) to collect videos from these hashtags:

- `BelajarIT`
- `BelajarCoding`
- `WebDev`
- `ProgrammingIndonesia`
- `JuniorDeveloper`

Query example:

> Collect top TikTok videos from #BelajarIT and #BelajarCoding from the last 7 days, sorted by play count. Return structured JSON.

Save the raw dataset to:

```
calendar/raw-trends.json
```

### Step 2 — Filter and rank topics

```bash
cd $MULAI_DARI_BASIC_ROOT
node scripts/research-topics.mjs calendar/raw-trends.json
```

Or with Apify API directly (if `APIFY_API_TOKEN` is in `.env`):

```bash
npm run research:topics -- --hashtags BelajarIT,BelajarCoding,WebDev
```

Output: `calendar/next-topics.json` with 5 ranked topics (reel + carousel mix).

### Step 3 — Notify n8n (optional)

Trigger the webhook to refresh topics in the automation queue:

```bash
curl -X POST http://localhost:5678/webhook/mulaidaribasic \
  -H "Content-Type: application/json" \
  -d '{"action":"research","input":"calendar/raw-trends.json"}'
```

## Filtering rules

Keep topics that match @mulaidaribasic brand:

- Edukasi IT fundamental (web, backend, database, git, konsep)
- Bahasa Indonesia natural, tone humble & jelas
- Satu konsep per konten

Reject:

- Drama, gossip, giveaway, non-tech viral bait
- Advanced/senior-only topics without basic angle

## Output format

`calendar/next-topics.json` example:

```json
{
  "topics": [
    {
      "rank": 1,
      "topic": "Apa itu REST API untuk pemula",
      "pillar": "Web Basic",
      "suggested_format": "reel"
    }
  ]
}
```

## Cron schedule (Hermes)

Run every **Sunday 09:00 WIB** to prepare topics for the week:

```
0 2 * * 0  →  research-topics  →  next-topics.json ready for n8n Mon–Sat
```

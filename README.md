# Mulai Dari Basic — Content Pipeline

Personal brand content pipeline untuk [@mulaidaribasic](https://www.tiktok.com/@mulaidaribasic).

Format native **TikTok 9:16** (1080×1920) — video reels + photo carousel.

## Quick start

```bash
cp .env.example .env
# Isi ZAI_CODING_API_KEY (GEMINI_API_KEY opsional — render default pakai SVG)

cd remotion && npm install && cd ..

# Generate script
npm run generate:script -- "Apa itu HTTP request dan response"

# Render reel
npm run render:reel -- scripts/2026-07-07-apa-itu-http-request-dan-response.md

# Generate microblog (TikTok carousel)
npm run generate:microblog -- "Git basic 3 command wajib pemula"

# Render microblog
npm run render:microblog -- microblog/2026-07-07-git-basic-3-command-wajib-pemula.md

# Render dengan AI image (opsional, butuh GEMINI_API_KEY + billing)
npm run render:reel -- scripts/xxx.md --ai

# Generate ilustrasi manual (Gemini)
npm run generate:asset -- "Git branches minimalist illustration"

# Preview
npm run studio
```

## Output

- Reels: `output/reels/*.mp4`
- Carousel: `output/microblog/<slug>/01-06.png` (upload sebagai photo slideshow TikTok)
- Assets: `assets/generated/*.png`

## Brand

- Handle: @mulaidaribasic
- Website: https://www.virgian.tech
- Visual: light minimalist, biru `#2563EB`

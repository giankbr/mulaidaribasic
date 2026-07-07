import { stripMarkdown, stripMarkdownKeepAccent } from "./copy.mjs";

const VISUAL_TYPES = new Set([
  "layers",
  "code",
  "grid",
  "wireframe",
  "security",
  "chart",
  "nodes",
  "monolith",
  "pipeline",
  "cloud",
  "api",
  "tracing",
  "product",
  "none",
]);

const COVER_LAYOUTS = new Set(["classic", "hero", "center"]);

function parseListBlock(block, label) {
  const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*|\\n## |$)`, "i");
  const match = block.match(re);
  if (!match) return [];

  return match[1]
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean)
    .map((line) => stripMarkdown(line));
}

export function parseMicroblog(md) {
  const pillar = md.match(/\*\*Pillar:\*\*\s*(.+)/)?.[1]?.trim();
  const slides = [];
  const blocks = md.split(/^## Slide \d+/m).slice(1);

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const isHook = /Hook/i.test(block.split("\n")[0] ?? "");
    const isCta = /CTA/i.test(block.split("\n")[0] ?? "");

    const rawHeadline = block.match(/\*\*Headline:\*\*\s*(.+)/)?.[1] ?? "";
    const headline = stripMarkdownKeepAccent(rawHeadline);
    const ctaLabel = stripMarkdown(block.match(/\*\*CTA:\*\*\s*(.+)/)?.[1] ?? "");
    const subtitle = stripMarkdown(block.match(/\*\*Subtitle:\*\*\s*(.+)/)?.[1] ?? "");
    const visualRaw = block.match(/\*\*Visual:\*\*\s*(\w+)/i)?.[1]?.toLowerCase();
    const visual = VISUAL_TYPES.has(visualRaw) ? visualRaw : undefined;
    const coverRaw = block.match(/\*\*Cover:\*\*\s*(\w+)/i)?.[1]?.toLowerCase();
    const coverLayout = COVER_LAYOUTS.has(coverRaw) ? coverRaw : undefined;
    const assetRaw = block.match(/\*\*Asset:\*\*\s*(.+)/i)?.[1]?.trim();
    const details = parseListBlock(block, "Detail");
    const codeLines = parseListBlock(block, "Code");

    slides.push({
      variant: isHook ? "hook" : isCta ? "cta" : "body",
      headline,
      slideIndex: i + 1,
      slideTotal: blocks.length,
      ...(pillar ? { pillar } : {}),
      ...(subtitle ? { subtitle } : {}),
      ...(details.length ? { details } : {}),
      ...(visual ? { visual } : {}),
      ...(isHook && coverLayout ? { coverLayout } : {}),
      ...(codeLines.length ? { codeLines } : {}),
      ...(isCta && ctaLabel ? { ctaLabel } : {}),
      ...(assetRaw ? { assetPath: assetRaw } : {}),
    });
  }

  const captionMatch = md.match(/## Caption \(IG feed\)\n```\n([\s\S]*?)```/);
  const caption = captionMatch?.[1]?.trim() ?? "";

  const titleMatch = md.match(/^# IG Microblog:\s*(.+)$/m);
  const title = titleMatch?.[1]?.trim() ?? "microblog";

  return { title, slides, caption, pillar };
}

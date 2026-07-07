import { readFileSync } from "node:fs";

function cleanQuote(text: string) {
  return text.replace(/^["']|["']$/g, "").trim();
}

export function parseScriptMarkdown(content: string) {
  const titleMatch = content.match(/^# Script:\s*(.+)$/m);
  const title = titleMatch?.[1]?.trim() ?? "Mulai Dari Basic";

  const hookMatch = content.match(/## Hook[\s\S]*?\n>\s*(.+)/);
  const hook = cleanQuote(hookMatch?.[1]?.trim() ?? title);

  const pointMatches = [...content.matchAll(/### Poin \d+\n>\s*(.+)/g)];
  const points = pointMatches.map((m) => cleanQuote(m[1].trim()));

  const ctaMatch = content.match(/## CTA[\s\S]*?\n>\s*(.+)/);
  const cta = cleanQuote(ctaMatch?.[1]?.trim() ?? "Follow @mulaidaribasic");

  const thumbMatch = content.match(/Thumbnail text:\s*["']?([^"'\n]+)/i);
  const thumbnailText = thumbMatch?.[1]?.trim() ?? title.toUpperCase();

  return {
    title,
    hook,
    points: points.length >= 3 ? points.slice(0, 3) : padPoints(points, hook),
    cta,
    thumbnailText,
  };
}

function padPoints(points: string[], hook: string): string[] {
  const fallback = [
    "Bangun produk digital dengan fondasi yang tepat.",
    "Skalakan tanpa utang teknis yang menumpuk.",
    "Partner engineering yang fokus ke hasil bisnis.",
  ];
  const merged = [...points];
  while (merged.length < 3) {
    merged.push(fallback[merged.length] ?? hook);
  }
  return merged.slice(0, 3);
}

export function parseScriptFile(path: string) {
  return parseScriptMarkdown(readFileSync(path, "utf8"));
}

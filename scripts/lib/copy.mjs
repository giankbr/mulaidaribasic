/**
 * Shared copy cleanup for generated content.
 */

/** Replace brochure-style dashes with normal punctuation. */
export function normalizePunctuation(text = "") {
  return text
    .replace(/\s*---\s*/g, ". ")
    .replace(/\s*--\s*/g, ", ")
    .replace(/\s*—\s*/g, ". ")
    .replace(/\s*\u2013\s*/g, ", ")
    .replace(/([,.])\s*\1+/g, "$1")
    .replace(/\.\s*\./g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

export function stripMarkdown(text = "") {
  return normalizePunctuation(
    text
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/^["']|["']$/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/** Keep **accent** markers for microblog headlines */
export function stripMarkdownKeepAccent(text = "") {
  return text.replace(/^["']|["']$/g, "").trim();
}

export function splitPoint(raw) {
  const text = stripMarkdown(raw);
  const parts = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);

  const titled = parts.find((l) => /^judul:/i.test(l));
  const bodied = parts.find((l) => /^isi:/i.test(l));

  if (titled || bodied) {
    return {
      title: stripMarkdown(titled?.replace(/^judul:\s*/i, "") ?? ""),
      body: stripMarkdown(bodied?.replace(/^isi:\s*/i, "") ?? ""),
    };
  }

  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  if (sentences.length >= 2 && sentences[0].length < 80) {
    return {
      title: stripMarkdown(sentences[0]),
      body: stripMarkdown(sentences.slice(1).join(" ")),
    };
  }

  const words = text.split(/\s+/);
  if (words.length > 10) {
    return {
      title: words.slice(0, 8).join(" "),
      body: words.slice(8).join(" "),
    };
  }

  return { title: text, body: undefined };
}

export function parseReelScript(content) {
  const titleMatch = content.match(/^# Script:\s*(.+)$/m);
  const title = stripMarkdown(titleMatch?.[1] ?? "Mulai Dari Basic");

  const hookBlock =
    content.match(/## Hook[\s\S]*?(?=\n## Body|\n## CTA|\n---|\n## On-screen|$)/)?.[0] ?? "";

  const hookHeadline = stripMarkdown(hookBlock.match(/\*\*Headline:\*\*\s*(.+)/i)?.[1] ?? "");
  const hookSubtitle = stripMarkdown(hookBlock.match(/\*\*Subtitle:\*\*\s*(.+)/i)?.[1] ?? "");

  const hookQuote = stripMarkdown(
    hookBlock.match(/>\s*([\s\S]*?)(?=\n##|\n---|$)/)?.[1]?.split("\n").map((l) => l.replace(/^>\s*/, "").trim()).filter(Boolean)[0] ?? ""
  );

  const hook = hookHeadline || hookQuote || title;

  const pointBlocks = [...content.matchAll(/### Poin \d+[\s\S]*?(?=\n### |\n## CTA|\n---|\n## On-screen|$)/g)];
  const points = pointBlocks.map((m) => {
    const block = m[0];
    const judul = block.match(/\*\*Judul:\*\*\s*(.+)/i)?.[1];
    const isi = block.match(/\*\*Isi:\*\*\s*(.+)/i)?.[1];
    if (judul) {
      return {
        title: stripMarkdown(judul),
        body: isi ? stripMarkdown(isi) : undefined,
      };
    }
    const quote = block.match(/>\s*([\s\S]+)/)?.[1] ?? "";
    return splitPoint(quote);
  });

  while (points.length < 3) {
    points.push({ title: "Fokus ke satu masalah dulu.", body: undefined });
  }

  const cta = stripMarkdown(
    content.match(/## CTA[\s\S]*?\n>\s*(.+)/)?.[1] ?? "Follow @mulaidaribasic"
  );

  const thumbnailText = stripMarkdown(
    content.match(/Thumbnail text:\s*["']?([^"'\n]+)/i)?.[1] ?? title
  ).toUpperCase();

  return {
    title,
    hook,
    ...(hookSubtitle ? { hookSubtitle } : {}),
    points: points.slice(0, 3),
    cta,
    thumbnailText,
  };
}

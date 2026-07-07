import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/** Extract TikTok caption from reel script markdown. */
export function captionFromReelScript(content) {
  const match = content.match(/## Caption\n```\n([\s\S]*?)```/);
  return match?.[1]?.trim() ?? "";
}

/** Read caption from rendered microblog output or source markdown. */
export function captionFromMicroblog(mdPath, root) {
  const slug = mdPath.replace(/^.*\//, "").replace(/\.md$/, "");
  const captionPath = join(root, "output", "microblog", slug, "caption.txt");
  if (existsSync(captionPath)) {
    return readFileSync(captionPath, "utf8").trim();
  }
  const md = readFileSync(mdPath, "utf8");
  const match = md.match(/## Caption \(IG feed\)\n```\n([\s\S]*?)```/);
  return match?.[1]?.trim() ?? "";
}

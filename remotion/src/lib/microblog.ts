export type MicroblogVisualType =
  | "layers"
  | "code"
  | "grid"
  | "wireframe"
  | "security"
  | "chart"
  | "nodes"
  | "monolith"
  | "pipeline"
  | "cloud"
  | "api"
  | "tracing"
  | "product"
  | "none";

export type MicroblogCoverLayout = "classic" | "hero" | "center";

export type MicroblogSlideProps = {
  variant: "hook" | "body" | "cta";
  headline: string;
  subtitle?: string;
  details?: string[];
  slideIndex: number;
  slideTotal: number;
  ctaLabel?: string;
  pillar?: string;
  visual?: MicroblogVisualType;
  visualSeed?: string;
  codeLines?: string[];
  coverLayout?: MicroblogCoverLayout;
  assetPath?: string;
};

export const MICROBLOG_WIDTH = 1080;
export const MICROBLOG_HEIGHT = 1920; // 9:16 TikTok feed / photo carousel

export const MICROBLOG_RENDER_SCALE = 2;

const HOOK_VISUALS: MicroblogVisualType[] = ["code", "layers", "api", "cloud", "pipeline"];
const BODY_VISUALS: MicroblogVisualType[] = [
  "code",
  "grid",
  "wireframe",
  "nodes",
  "monolith",
  "pipeline",
  "cloud",
  "api",
  "tracing",
  "layers",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function pickMicroblogVisual(
  variant: MicroblogSlideProps["variant"],
  slideIndex: number,
  seed: string,
  explicit?: MicroblogVisualType
): MicroblogVisualType {
  if (explicit) return explicit;
  if (variant === "cta") return "none";
  const pool = variant === "hook" ? HOOK_VISUALS : BODY_VISUALS;
  const key = `${seed}:${variant}:${slideIndex}`;
  return pool[hashString(key) % pool.length];
}

export const MICROBLOG_CTA_POOL = [
  "Save buat belajar nanti →",
  "Follow @mulaidaribasic",
  "Share ke temen yang baru mulai",
  "Link di bio → virgian.tech",
] as const;

const COVER_LAYOUTS: MicroblogCoverLayout[] = ["center"];

export function pickCoverLayout(
  seed: string,
  explicit?: MicroblogCoverLayout
): MicroblogCoverLayout {
  if (explicit) return explicit;
  return COVER_LAYOUTS[hashString(`cover:${seed}`) % COVER_LAYOUTS.length];
}

export function bodyEyebrow(pillar: string | undefined, slideIndex: number): string {
  const n = slideIndex - 1;
  const p = (pillar ?? "").toLowerCase();
  if (p.includes("web")) return `Web #${n}`;
  if (p.includes("backend")) return `Backend #${n}`;
  if (p.includes("database")) return `DB #${n}`;
  if (p.includes("git") || p.includes("tool")) return `Tools #${n}`;
  if (p.includes("konsep") || p.includes("fundamental")) return `Konsep #${n}`;
  if (p.includes("belajar")) return `Tips #${n}`;
  return `Basic #${n}`;
}

export function hookEyebrow(pillar: string | undefined): string {
  if (!pillar) return "IT Basic";
  return pillar;
}

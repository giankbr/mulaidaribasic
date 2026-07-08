export type ReelPoint = {
  title: string;
  body?: string;
};

export type ReelVisualAssets = {
  hook?: string;
  p1?: string;
  p2?: string;
  p3?: string;
};

export type ReelCaption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};

export type ReelProps = {
  title: string;
  hook: string;
  hookSubtitle?: string;
  points: ReelPoint[];
  cta: string;
  thumbnailText: string;
  visualAssets?: ReelVisualAssets;
  voiceoverSrc?: string;
  captions?: ReelCaption[];
};

export const REEL_FPS = 30;
export const REEL_DURATION_SEC = 52;
export const REEL_DURATION_FRAMES = REEL_FPS * REEL_DURATION_SEC;

export const BRAND = {
  bg: "#EEF1FD",
  surface: "#FFFFFF",
  primary: "#6981ED",
  primaryDeep: "#4453C6",
  primaryLight: "#E4E8FC",
  primarySoft: "#C3CCF7",
  text: "#0F172A",
  muted: "#475569",
  border: "#C3CCF7",
  // aliases for shared animation code
  indigo: "#6981ED",
  indigoLight: "#8B9BF2",
  violet: "#A5B4F5",
  sky: "#6981ED",
} as const;

export const BRAND_HANDLE = "@mulaidaribasic";
export const BRAND_TAGLINE = "MULAI DARI BASIC";
export const BRAND_WEBSITE = "virgian.tech";

/** TikTok feed native 9:16 (video + photo carousel) */
export const FEED_WIDTH = 1080;
export const FEED_HEIGHT = 1920;

// Scene timing (frames @ 30fps)
export const SCENES = {
  hook: { from: 0, duration: 120 },
  p1: { from: 120, duration: 405 },
  p2: { from: 525, duration: 435 },
  p3: { from: 960, duration: 405 },
  cta: { from: 1365, duration: 195 },
} as const;

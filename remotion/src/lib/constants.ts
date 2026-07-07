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

export type ReelProps = {
  title: string;
  hook: string;
  hookSubtitle?: string;
  points: ReelPoint[];
  cta: string;
  thumbnailText: string;
  visualAssets?: ReelVisualAssets;
};

export const REEL_FPS = 30;
export const REEL_DURATION_SEC = 52;
export const REEL_DURATION_FRAMES = REEL_FPS * REEL_DURATION_SEC;

export const BRAND = {
  bg: "#EFF6FF",
  surface: "#FFFFFF",
  primary: "#3B82F6",
  primaryLight: "#DBEAFE",
  primarySoft: "#BFDBFE",
  text: "#0F172A",
  muted: "#475569",
  border: "#BFDBFE",
  // aliases for shared animation code
  indigo: "#3B82F6",
  indigoLight: "#60A5FA",
  violet: "#93C5FD",
  sky: "#3B82F6",
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

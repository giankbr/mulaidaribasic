export type ReelPoint = {
  title: string;
  body?: string;
};

export type ReelProps = {
  title: string;
  hook: string;
  hookSubtitle?: string;
  points: ReelPoint[];
  cta: string;
  thumbnailText: string;
};

export const REEL_FPS = 30;
export const REEL_DURATION_SEC = 52;
export const REEL_DURATION_FRAMES = REEL_FPS * REEL_DURATION_SEC;

export const BRAND = {
  bg: "#F4F8FF",
  surface: "#FFFFFF",
  primary: "#2563EB",
  primaryLight: "#DBEAFE",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  // aliases for shared animation code
  indigo: "#2563EB",
  indigoLight: "#3B82F6",
  violet: "#93C5FD",
  sky: "#2563EB",
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

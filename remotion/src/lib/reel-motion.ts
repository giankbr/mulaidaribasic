import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Frames of overlap between consecutive scenes for crossfade. */
export const SCENE_TRANSITION_FRAMES = 20;

export const SPRING_SMOOTH = { damping: 34, stiffness: 62, mass: 0.95 };
export const SPRING_SNAPPY = { damping: 26, stiffness: 90, mass: 0.85 };

export function useSceneTransition(durationInFrames: number, enterDelay = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = SCENE_TRANSITION_FRAMES;
  const local = frame - enterDelay;

  const enter = spring({
    frame: Math.max(0, local),
    fps,
    config: SPRING_SMOOTH,
    durationInFrames: t,
  });

  const exitStart = durationInFrames - t;
  const exit = spring({
    frame: Math.max(0, frame - exitStart),
    fps,
    config: SPRING_SMOOTH,
    durationInFrames: t,
  });

  const enterOpacity = local < 0 ? 0 : interpolate(enter, [0, 1], [0, 1]);
  const exitOpacity = frame >= exitStart ? interpolate(exit, [0, 1], [1, 0]) : 1;
  const opacity = Math.min(enterOpacity, exitOpacity);

  const enterY = local < 0 ? 40 : interpolate(enter, [0, 1], [40, 0], {
    easing: Easing.out(Easing.cubic),
  });
  const exitY =
    frame >= exitStart
      ? interpolate(exit, [0, 1], [0, -28], { easing: Easing.in(Easing.cubic) })
      : 0;
  const y = enterY + exitY;

  const scale =
    (local < 0 ? 0.95 : interpolate(enter, [0, 1], [0.95, 1], { easing: Easing.out(Easing.cubic) })) *
    (frame >= exitStart
      ? interpolate(exit, [0, 1], [1, 0.96], { easing: Easing.in(Easing.cubic) })
      : 1);

  return { opacity, y, scale };
}

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND } from "../lib/constants";
import { ReelHookEyebrow, ReelPointBadge, ReelTopTagline, REEL_SCENE_SHELL } from "./reel-ui";
import { ReelSceneDecoration } from "./ReelSceneDecoration";
import { pickReelVisual } from "../lib/reel-visual";

const { padX: REEL_PAD_X, padTop: REEL_PAD_TOP, padBottom: REEL_PAD_BOTTOM } = REEL_SCENE_SHELL;
const REEL_CARD_MIN_HEIGHT = 1140;

export const reelCardStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  minHeight: REEL_CARD_MIN_HEIGHT,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  borderRadius: 28,
  border: `1px solid ${BRAND.border}`,
  background: BRAND.surface,
  boxShadow: "0 20px 48px rgba(37,99,235,0.08), 0 1px 0 rgba(255,255,255,0.8) inset",
};

type TextSceneProps = {
  eyebrow?: string;
  headline: string;
  body?: string;
  step?: string;
};

function bodySize(text: string) {
  const len = text.length;
  if (len > 160) return 28;
  if (len > 120) return 30;
  return 32;
}

function headlineSize(text: string, isHook: boolean) {
  const len = text.length;
  if (isHook) return len > 56 ? 58 : 66;
  return len > 64 ? 46 : len > 48 ? 50 : 54;
}

export const TextScene: React.FC<TextSceneProps> = ({
  eyebrow,
  headline,
  body,
  step,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 22, stiffness: 120 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [36, 0]);

  const isHook = !step;
  const titleSize = headlineSize(headline, isHook);
  const detailSize = body ? bodySize(body) : 32;

  return (
    <AbsoluteFill>
      <ReelTopTagline />

      {step ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "12%",
            right: REEL_PAD_X - 8,
            fontFamily: "var(--font-heading)",
            fontSize: 220,
            fontWeight: 700,
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            color: "rgba(37,99,235,0.04)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {step}
        </div>
      ) : null}

      <AbsoluteFill
        style={{
          justifyContent: "center",
          padding: `${REEL_PAD_TOP + 24}px ${REEL_PAD_X}px ${REEL_PAD_BOTTOM}px`,
          opacity,
          transform: `translateY(${y}px)`,
        }}
      >
        <div
          style={{
            ...reelCardStyle,
            padding: isHook ? "48px 36px 52px" : "44px 34px 52px",
          }}
        >
          {step ? <ReelPointBadge step={step} /> : null}

          {eyebrow ? <ReelHookEyebrow label={eyebrow} /> : null}

          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
              color: BRAND.text,
              width: "100%",
            }}
          >
            {headline}
          </div>

          {body ? (
            <div
              style={{
                marginTop: isHook ? 22 : 24,
                fontFamily: "var(--font-body)",
                fontSize: isHook ? 32 : detailSize,
                lineHeight: 1.48,
                fontWeight: 600,
                color: BRAND.muted,
                width: "100%",
              }}
            >
              {body}
            </div>
          ) : null}

          <ReelSceneDecoration visual={step ? pickReelVisual(headline, body) : "hook"} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

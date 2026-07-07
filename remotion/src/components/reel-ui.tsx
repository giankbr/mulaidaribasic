import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BRAND, BRAND_HANDLE, SCENES } from "../lib/constants";

export const REEL_PAD_X = 52;
export const REEL_PAD_TOP = 72;
export const REEL_PAD_BOTTOM = 196;

export const REEL_SCENE_SHELL = {
  padX: REEL_PAD_X,
  padTop: REEL_PAD_TOP,
  padBottom: REEL_PAD_BOTTOM,
} as const;

/** IG-story style segmented progress bar, one segment per scene. */
export const ReelProgress: React.FC = () => {
  const frame = useCurrentFrame();
  const segments = [
    SCENES.hook,
    SCENES.p1,
    SCENES.p2,
    SCENES.p3,
    SCENES.cta,
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 96,
        left: REEL_PAD_X,
        right: REEL_PAD_X,
        display: "flex",
        gap: 8,
        zIndex: 3,
      }}
    >
      {segments.map((s, i) => {
        const fill = interpolate(
          frame,
          [s.from, s.from + s.duration],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 5,
              borderRadius: 999,
              background: "rgba(255,255,255,0.28)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${fill * 100}%`,
                height: "100%",
                borderRadius: 999,
                background: "#FFFFFF",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export const ReelWatermark: React.FC = () => (
  <div
    aria-hidden
    style={{
      position: "absolute",
      top: -64,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: "var(--font-heading)",
      fontSize: 200,
      fontWeight: 900,
      lineHeight: 0.86,
      letterSpacing: "-0.032em",
      color: "rgba(59,130,246,0.07)",
      pointerEvents: "none",
      userSelect: "none",
      whiteSpace: "nowrap",
    }}
  >
    {BRAND_HANDLE}
  </div>
);

export type WatermarkVariant = "badge" | "glass" | "dot" | "handle";

// Change this to switch the watermark style across all reels.
export const WATERMARK_VARIANT: WatermarkVariant = "handle";

const wmWrap: React.CSSProperties = {
  position: "absolute",
  top: 44,
  left: REEL_SCENE_SHELL.padX,
  display: "flex",
  alignItems: "center",
  gap: 12,
  zIndex: 3,
};

export const ReelBrandMark: React.FC<{ variant?: WatermarkVariant }> = ({
  variant = WATERMARK_VARIANT,
}) => {
  if (variant === "glass") {
    return (
      <div
        style={{
          ...wmWrap,
          gap: 10,
          padding: "8px 16px 8px 8px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.16)",
          border: "1px solid rgba(255,255,255,0.35)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: "#FFFFFF",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-heading)",
            fontSize: 18,
            fontWeight: 800,
            color: BRAND.primary,
          }}
        >
          m
        </div>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 21,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "#FFFFFF",
          }}
        >
          mulaidaribasic
        </span>
      </div>
    );
  }

  if (variant === "dot") {
    return (
      <div style={{ ...wmWrap, gap: 10 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#FFFFFF",
            boxShadow: "0 0 0 4px rgba(255,255,255,0.25)",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 23,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "#FFFFFF",
          }}
        >
          mulaidaribasic
        </span>
      </div>
    );
  }

  if (variant === "handle") {
    return (
      <div style={wmWrap}>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 23,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "#FFFFFF",
          }}
        >
          <span style={{ opacity: 0.6 }}>@</span>mulaidaribasic
        </span>
      </div>
    );
  }

  // badge (default)
  return (
    <div style={wmWrap}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 11,
          background: "#FFFFFF",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-heading)",
          fontSize: 22,
          fontWeight: 800,
          color: BRAND.primary,
          boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
        }}
      >
        m
      </div>
      <span
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: "#FFFFFF",
        }}
      >
        mulaidaribasic
      </span>
    </div>
  );
};

/** @deprecated kept for compatibility — use ReelBrandMark */
export const ReelTopTagline = ReelBrandMark;

export const ReelFooter: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 36,
      left: REEL_SCENE_SHELL.padX,
      right: REEL_SCENE_SHELL.padX,
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      zIndex: 4,
    }}
  >
    <span
      style={{
        fontFamily: "var(--font-body)",
        fontSize: 20,
        fontWeight: 700,
        color: "#FFFFFF",
        opacity: 0.9,
        letterSpacing: "0.01em",
      }}
    >
      {BRAND_HANDLE}
    </span>
  </div>
);

export const ReelPointBadge: React.FC<{ step: string }> = ({ step }) => (
  <div
    style={{
      width: 54,
      height: 54,
      borderRadius: 14,
      border: `1px solid ${BRAND.primary}55`,
      background: `linear-gradient(165deg, ${BRAND.primaryLight}, ${BRAND.surface})`,
      display: "grid",
      placeItems: "center",
      marginBottom: 28,
      alignSelf: "flex-start",
      fontFamily: "var(--font-heading)",
      fontSize: 22,
      fontWeight: 700,
      color: BRAND.primary,
      boxShadow: "0 4px 12px rgba(59,130,246,0.16)",
    }}
  >
    {step}
  </div>
);

export const ReelHookEyebrow: React.FC<{ label: string }> = ({ label }) => (
  <span
    style={{
      display: "inline-flex",
      alignSelf: "flex-start",
      padding: "8px 18px",
      marginBottom: 24,
      borderRadius: 999,
      border: `1px solid ${BRAND.primarySoft}`,
      background: BRAND.primaryLight,
      fontFamily: "var(--font-heading)",
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: BRAND.primary,
    }}
  >
    {label}
  </span>
);

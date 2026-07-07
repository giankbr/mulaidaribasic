import React from "react";
import { BRAND, BRAND_HANDLE, BRAND_TAGLINE } from "../lib/constants";

export const REEL_PAD_X = 52;
export const REEL_PAD_TOP = 72;
export const REEL_PAD_BOTTOM = 196;

export const REEL_SCENE_SHELL = {
  padX: REEL_PAD_X,
  padTop: REEL_PAD_TOP,
  padBottom: REEL_PAD_BOTTOM,
} as const;

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

export const ReelTopTagline: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: REEL_SCENE_SHELL.padTop,
      left: REEL_SCENE_SHELL.padX,
      right: REEL_SCENE_SHELL.padX,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 3,
    }}
  >
    {BRAND_TAGLINE.split(" ").map((word) => (
      <span
        key={word}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.14em",
          color: BRAND.primary,
          opacity: 0.85,
        }}
      >
        {word}
      </span>
    ))}
  </div>
);

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
        fontWeight: 600,
        color: BRAND.primary,
        opacity: 0.75,
        letterSpacing: "0.01em",
      }}
    >
      {BRAND_HANDLE}
    </span>
  </div>
);

export const ReelPointBadge: React.FC<{ step: string }> = ({ step }) => {
  const n = parseInt(step, 10);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 28,
        alignSelf: "flex-start",
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 14,
          border: `1px solid ${BRAND.primary}55`,
          background: `linear-gradient(165deg, ${BRAND.primaryLight}, ${BRAND.surface})`,
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-heading)",
          fontSize: 22,
          fontWeight: 700,
          color: BRAND.primary,
          boxShadow: "0 4px 12px rgba(59,130,246,0.16)",
        }}
      >
        {step}
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: BRAND.primary,
          }}
        >
          Poin #{n}
        </div>
        <div
          style={{
            marginTop: 8,
            width: 56,
            height: 2,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${BRAND.primary}, transparent)`,
          }}
        />
      </div>
    </div>
  );
};

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

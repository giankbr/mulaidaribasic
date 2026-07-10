import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BRAND } from "../lib/constants";

const WALLPAPER = "backgrounds/ai-bg-021.jpg";

export const BrandBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame % 900, [0, 450, 900], [0, 18, 0]);
  const scale = interpolate(frame % 1560, [0, 780, 1560], [1.03, 1.06, 1.03]);

  return (
    <AbsoluteFill
      style={{
        background: BRAND.primaryDeep,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translateY(${drift * 0.2}px)`,
        }}
      >
        <img
          src={staticFile(WALLPAPER)}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 35%",
          }}
        />
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${staticFile("noise.svg")})`,
          opacity: 0.04,
          mixBlendMode: "overlay",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 32%, rgba(8,18,56,0.35) 72%, rgba(6,12,40,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

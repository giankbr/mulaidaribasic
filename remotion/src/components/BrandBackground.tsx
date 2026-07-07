import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BRAND } from "../lib/constants";

export const BrandBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame % 900, [0, 450, 900], [0, 24, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${staticFile("noise.svg")})`,
          opacity: 0.04,
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `${8 + drift * 0.06}%`,
          left: "50%",
          transform: "translateX(-50%)",
          width: "90vw",
          height: "40vh",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${BRAND.primaryLight}88 0%, transparent 70%)`,
          filter: "blur(64px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `${-10 + drift * 0.15}%`,
          right: `${-8 - drift * 0.06}%`,
          width: "55vw",
          height: "55vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND.primary}18 0%, transparent 68%)`,
          filter: "blur(72px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: `${-12 + drift * 0.1}%`,
          left: "12%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND.violet}33 0%, transparent 72%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(244,248,255,0.2) 50%, rgba(219,234,254,0.35) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BRAND } from "../lib/constants";

export const BrandBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame % 900, [0, 450, 900], [0, 24, 0]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(165deg, ${BRAND.primaryLight} 0%, ${BRAND.bg} 38%, ${BRAND.primarySoft}88 100%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${staticFile("noise.svg")})`,
          opacity: 0.035,
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `${6 + drift * 0.06}%`,
          left: "50%",
          transform: "translateX(-50%)",
          width: "95vw",
          height: "45vh",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${BRAND.primary}44 0%, transparent 68%)`,
          filter: "blur(56px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `${-8 + drift * 0.15}%`,
          right: `${-6 - drift * 0.06}%`,
          width: "58vw",
          height: "58vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND.indigoLight}55 0%, transparent 65%)`,
          filter: "blur(64px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: `${-10 + drift * 0.1}%`,
          left: "8%",
          width: "52vw",
          height: "52vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND.violet}66 0%, transparent 70%)`,
          filter: "blur(56px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${BRAND.primaryLight}55 0%, transparent 42%, ${BRAND.primary}18 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

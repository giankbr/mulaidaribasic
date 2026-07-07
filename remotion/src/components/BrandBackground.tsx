import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BRAND } from "../lib/constants";

export const BrandBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame % 900, [0, 450, 900], [0, 24, 0]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(165deg, ${BRAND.primary} 0%, ${BRAND.indigo} 45%, ${BRAND.primaryDeep} 100%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${staticFile("noise.svg")})`,
          opacity: 0.05,
          mixBlendMode: "overlay",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `${4 + drift * 0.06}%`,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: "48vh",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${BRAND.indigoLight}88 0%, transparent 66%)`,
          filter: "blur(64px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `${-8 + drift * 0.15}%`,
          right: `${-6 - drift * 0.06}%`,
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND.indigoLight}66 0%, transparent 64%)`,
          filter: "blur(72px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: `${-12 + drift * 0.1}%`,
          left: "6%",
          width: "56vw",
          height: "56vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND.primaryDeep}99 0%, transparent 70%)`,
          filter: "blur(64px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 40%, ${BRAND.primaryDeep}55 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

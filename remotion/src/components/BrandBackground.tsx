import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BRAND } from "../lib/constants";

export const BrandBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame % 900, [0, 450, 900], [0, 24, 0]);

  return (
    <AbsoluteFill
      style={{
        // Closer to virgian.tech hero tone: vivid blue to deep navy.
        background:
          "linear-gradient(165deg, #5F88F4 0%, #4E74E7 42%, #3550B8 74%, #1E2F75 100%)",
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
          background: "radial-gradient(ellipse, rgba(170, 195, 255, 0.58) 0%, transparent 66%)",
          filter: "blur(72px)",
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
          background: "radial-gradient(circle, rgba(139, 171, 255, 0.42) 0%, transparent 64%)",
          filter: "blur(76px)",
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
          background: "radial-gradient(circle, rgba(25, 42, 114, 0.78) 0%, transparent 70%)",
          filter: "blur(68px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 38%, rgba(16,30,88,0.48) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

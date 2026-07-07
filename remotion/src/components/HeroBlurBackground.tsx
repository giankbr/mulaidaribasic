import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../lib/constants";

const BLOB_LOOP_SEC = 10;

function blobTransform(frame: number, fps: number, delaySec: number, width: number) {
  const blobSize = width * 0.75;
  const t = (((frame / fps - delaySec) % BLOB_LOOP_SEC) + BLOB_LOOP_SEC) % BLOB_LOOP_SEC;
  const phase = t / BLOB_LOOP_SEC;

  const x = interpolate(phase, [0, 0.33, 0.66, 1], [0, 24, -16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(phase, [0, 0.33, 0.66, 1], [0, -36, 16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(phase, [0, 0.33, 0.66, 1], [1, 1.08, 0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return { x, y, scale, blobSize };
}

const Blob: React.FC<{
  color: string;
  style: React.CSSProperties;
  delaySec: number;
}> = ({ color, style, delaySec }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const { x, y, scale, blobSize } = blobTransform(frame, fps, delaySec, width);

  return (
    <div
      style={{
        position: "absolute",
        width: blobSize,
        height: blobSize,
        borderRadius: "50%",
        backgroundColor: color,
        filter: "blur(72px)",
        willChange: "transform",
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        ...style,
      }}
    />
  );
};

export const HeroBlurBackground: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: BRAND.bg,
      backgroundImage: `linear-gradient(180deg, ${BRAND.primaryLight} 0%, ${BRAND.bg} 45%, ${BRAND.primarySoft}99 100%)`,
      overflow: "hidden",
    }}
  >
    <Blob color="rgba(59, 130, 246, 0.18)" delaySec={0} style={{ top: "-18%", left: "-12%" }} />
    <Blob color="rgba(96, 165, 250, 0.14)" delaySec={2} style={{ top: "-14%", right: "-10%" }} />
    <Blob color="rgba(147, 197, 253, 0.22)" delaySec={4} style={{ bottom: -140, left: "18%" }} />
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile("noise.svg")})`,
        opacity: 0.03,
        mixBlendMode: "multiply",
        pointerEvents: "none",
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage:
          "linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)",
        backgroundSize: "96px 96px",
        opacity: 0.5,
        maskImage: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 72%)",
        pointerEvents: "none",
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(70% 42% at 50% 90%, ${BRAND.primaryLight}66 0%, transparent 80%)`,
        pointerEvents: "none",
      }}
    />
  </AbsoluteFill>
);

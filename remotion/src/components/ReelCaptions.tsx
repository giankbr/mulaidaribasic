import React, { useMemo } from "react";
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../lib/constants";

type ReelCaptionsProps = {
  captions: Caption[];
};

export const ReelCaptions: React.FC<ReelCaptionsProps> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;

  const pages = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions,
        combineTokensWithinMilliseconds: 900,
      }).pages,
    [captions]
  );

  const page = pages.find(
    (entry) =>
      currentTimeMs >= entry.startMs &&
      currentTimeMs < entry.startMs + entry.durationMs
  );

  if (!page) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 300,
        display: "flex",
        justifyContent: "center",
        padding: "0 40px",
        zIndex: 6,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: "92%",
          borderRadius: 16,
          padding: "14px 22px",
          background: "rgba(15, 23, 42, 0.82)",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.35)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-body)",
            fontSize: 38,
            fontWeight: 700,
            lineHeight: 1.35,
            textAlign: "center",
            letterSpacing: "-0.01em",
          }}
        >
          {page.tokens.map((token) => {
            const active =
              currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;

            return (
              <span
                key={`${token.fromMs}-${token.text}`}
                style={{
                  color: active ? "#FFE566" : "#FFFFFF",
                  opacity: active ? 1 : 0.88,
                  textShadow: active
                    ? `0 0 18px ${BRAND.primarySoft}`
                    : undefined,
                }}
              >
                {token.text}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
};

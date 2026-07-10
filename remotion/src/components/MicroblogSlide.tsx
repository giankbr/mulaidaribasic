import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadPlusJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { BrandBackground } from "./BrandBackground";
import { MicroblogVisual } from "./MicroblogVisual";
import { MicroblogHookCover } from "./MicroblogHookCover";
import { BRAND } from "../lib/constants";
import type { MicroblogSlideProps } from "../lib/microblog";
import { bodyEyebrow, hookEyebrow, pickCoverLayout, pickMicroblogVisual } from "../lib/microblog";
import {
  CtaPill,
  DetailList,
  Headline,
  MicroblogGhostWatermark,
  MicroblogProgress,
  MicroblogTopTagline,
  SlideCounter,
  Subtitle,
  VisualFrame,
} from "./microblog-ui";
import { reelCardStyle } from "./TextScene";

const { fontFamily: headingFont } = loadPlusJakarta("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});
const { fontFamily: bodyFont } = loadPlusJakarta("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const microblogCardStyle: React.CSSProperties = {
  ...reelCardStyle,
  minHeight: 0,
  width: "100%",
};

export const MicroblogSlide: React.FC<MicroblogSlideProps> = ({
  variant,
  headline,
  subtitle,
  details,
  slideIndex,
  slideTotal,
  ctaLabel,
  pillar,
  visual,
  visualSeed,
  codeLines,
  coverLayout,
  assetPath,
}) => {
  const isHook = variant === "hook";
  const isCta = variant === "cta";
  const hasDetails = Boolean(details && details.length > 0);
  const seed = visualSeed ?? "mulaidaribasic";
  const resolvedVisual = pickMicroblogVisual(variant, slideIndex, seed, visual);
  const showVisual = resolvedVisual !== "none" || Boolean(assetPath);
  const headlineSize = isHook ? (hasDetails ? 58 : 64) : isCta ? 44 : 46;
  const hookLayout = pickCoverLayout(seed, coverLayout);

  return (
    <AbsoluteFill
      style={
        {
          "--font-heading": headingFont,
          "--font-body": bodyFont,
          fontFamily: bodyFont,
          WebkitFontSmoothing: "antialiased",
        } as React.CSSProperties
      }
    >
      <BrandBackground />
      <MicroblogGhostWatermark />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "36px 48px 80px",
          zIndex: 2,
        }}
      >
        <MicroblogTopTagline />

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            marginTop: 18,
            minHeight: 0,
          }}
        >
          <div
            style={{
              ...microblogCardStyle,
              padding: isHook ? "40px 32px 44px" : "36px 30px 44px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {isHook ? (
              <MicroblogHookCover
                layout={hookLayout}
                eyebrow={hookEyebrow(pillar)}
                headline={headline}
                subtitle={subtitle}
                details={details}
                slideIndex={slideIndex}
                slideTotal={slideTotal}
                visual={resolvedVisual}
                visualSeed={seed}
                assetPath={assetPath}
                hasDetails={hasDetails}
              />
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginBottom: 28,
                  }}
                >
                  <SlideCounter slideIndex={slideIndex} slideTotal={slideTotal} />
                </div>

                {!isCta ? (
                  <div style={{ fontSize: 14, color: BRAND.muted, marginBottom: 16, fontWeight: 600 }}>
                    {bodyEyebrow(pillar, slideIndex)}
                  </div>
                ) : null}

                <Headline headline={headline} size={headlineSize} cover={false} />

                {subtitle ? <Subtitle text={subtitle} compact={hasDetails} /> : null}
                {hasDetails ? <DetailList items={details!} compact={hasDetails} /> : null}

                {isCta && ctaLabel && !showVisual ? (
                  <div style={{ marginTop: 32 }}>
                    <CtaPill label={ctaLabel} />
                  </div>
                ) : null}

                {showVisual ? (
                  <div style={{ flex: "0 0 auto", marginTop: 14, zIndex: 1 }}>
                    <VisualFrame height={hasDetails ? 280 : 300}>
                      <MicroblogVisual
                        slideIndex={slideIndex}
                        variant={variant}
                        visual={resolvedVisual}
                        visualSeed={seed}
                        codeLines={codeLines}
                        assetPath={assetPath}
                      />
                    </VisualFrame>
                  </div>
                ) : null}

                {isCta && ctaLabel && showVisual ? (
                  <div style={{ marginTop: 24 }}>
                    <CtaPill label={ctaLabel} />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </AbsoluteFill>

      <MicroblogProgress slideIndex={slideIndex} slideTotal={slideTotal} />
    </AbsoluteFill>
  );
};

export const defaultMicroblogSlideProps: MicroblogSlideProps = {
  variant: "hook",
  headline: "Git basic:|3 command|**wajib**",
  subtitle: "Belum perlu hafal puluhan command. Tiga ini sudah cukup buat mulai version control.",
  slideIndex: 1,
  slideTotal: 6,
};

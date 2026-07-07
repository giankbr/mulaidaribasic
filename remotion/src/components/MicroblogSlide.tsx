import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadPlusJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { HeroBlurBackground } from "./HeroBlurBackground";
import { MicroblogVisual } from "./MicroblogVisual";
import { MicroblogHookCover } from "./MicroblogHookCover";
import { BRAND, BRAND_HANDLE } from "../lib/constants";
import type { MicroblogSlideProps } from "../lib/microblog";
import { bodyEyebrow, hookEyebrow, pickCoverLayout, pickMicroblogVisual } from "../lib/microblog";
import {
  CtaPill,
  DetailList,
  Headline,
  SlideCounter,
  Subtitle,
  TopTagline,
} from "./microblog-ui";

const { fontFamily: bodyFont } = loadPlusJakarta("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

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
  const showFooterCta = isCta && Boolean(ctaLabel) && showVisual;
  const headlineSize = isHook ? (hasDetails ? 68 : 76) : isCta ? 50 : 52;
  const hookLayout = pickCoverLayout(seed, coverLayout);

  return (
    <AbsoluteFill style={{ fontFamily: bodyFont, backgroundColor: BRAND.bg, WebkitFontSmoothing: "antialiased" }}>
      <HeroBlurBackground />

      <AbsoluteFill
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          padding: "48px 52px",
          paddingBottom: showFooterCta ? 128 : 96,
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column" }}>
          <TopTagline />

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
                <div
                  style={{
                    flex: "0 0 auto",
                    height: hasDetails ? 520 : 480,
                    position: "relative",
                    marginTop: 14,
                    zIndex: 1,
                  }}
                >
                  <MicroblogVisual
                    slideIndex={slideIndex}
                    variant={variant}
                    visual={resolvedVisual}
                    visualSeed={seed}
                    codeLines={codeLines}
                    assetPath={assetPath}
                  />
                </div>
              ) : null}
            </>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 52,
            right: 52,
            zIndex: 4,
          }}
        >
          {isCta && ctaLabel && showVisual ? (
            <div style={{ marginBottom: 10 }}>
              <CtaPill label={ctaLabel} />
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: bodyFont,
                fontSize: 20,
                fontWeight: 600,
                color: BRAND.muted,
                letterSpacing: "0.01em",
              }}
            >
              {BRAND_HANDLE}
            </span>
          </div>
        </div>
      </AbsoluteFill>
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

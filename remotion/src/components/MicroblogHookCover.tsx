import React from "react";
import { MicroblogVisual } from "./MicroblogVisual";
import type { MicroblogCoverLayout } from "../lib/microblog";
import type { MicroblogVisualType } from "../lib/microblog";
import {
  DetailList,
  Headline,
  HookEyebrow,
  SlideCounter,
  Subtitle,
  VisualFrame,
} from "./microblog-ui";

type HookCoverProps = {
  layout: MicroblogCoverLayout;
  eyebrow: string;
  headline: string;
  subtitle?: string;
  details?: string[];
  slideIndex: number;
  slideTotal: number;
  visual: MicroblogVisualType;
  visualSeed?: string;
  assetPath?: string;
  hasDetails: boolean;
};

const HeaderRow: React.FC<{
  slideIndex: number;
  slideTotal: number;
  compact?: boolean;
}> = ({ slideIndex, slideTotal, compact }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      marginBottom: compact ? 14 : 28,
      position: "relative",
    }}
  >
    <SlideCounter slideIndex={slideIndex} slideTotal={slideTotal} />
  </div>
);

const VisualSlot: React.FC<{
  height?: number;
  slideIndex: number;
  visual: MicroblogVisualType;
  visualSeed?: string;
  assetPath?: string;
  framed?: boolean;
  scale?: number;
  emphasis?: "normal" | "hero";
  fill?: boolean;
}> = ({ height = 290, slideIndex, visual, visualSeed, assetPath, framed, scale = 1, emphasis = "normal", fill }) => {
  const inner = (
    <MicroblogVisual
      slideIndex={slideIndex}
      variant="hook"
      visual={visual}
      visualSeed={visualSeed}
      emphasis={emphasis}
      assetPath={assetPath}
    />
  );

  const scaled = (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "center center",
        zIndex: 1,
      }}
    >
      {inner}
    </div>
  );

  if (framed) {
    return (
      <VisualFrame height={fill ? undefined : height} fill={fill}>
        <div style={{ position: "relative", height: "100%", width: "100%" }}>{scaled}</div>
      </VisualFrame>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: fill ? "100%" : height,
        flex: fill ? "1 1 0" : "0 0 auto",
        minHeight: fill ? 0 : undefined,
        overflow: "hidden",
      }}
    >
      {scaled}
    </div>
  );
};

const ClassicCover: React.FC<HookCoverProps> = (props) => {
  const { eyebrow, headline, subtitle, details, hasDetails, slideIndex, slideTotal, visual, visualSeed } =
    props;
  const headlineSize = hasDetails ? 68 : 76;

  return (
    <>
      <HeaderRow slideIndex={slideIndex} slideTotal={slideTotal} />
      <HookEyebrow label={eyebrow} />
      <Headline headline={headline} size={headlineSize} cover />
      {subtitle ? <Subtitle text={subtitle} compact={hasDetails} /> : null}
      {hasDetails ? <DetailList items={details!} compact={hasDetails} /> : null}
      <div style={{ marginTop: 20 }}>
        <VisualSlot
          height={hasDetails ? 300 : 280}
          slideIndex={slideIndex}
          visual={visual}
          visualSeed={visualSeed}
          assetPath={props.assetPath}
        />
      </div>
    </>
  );
};

/** Nexavest-style: teaser line, big headline, visual hero di bawah */
const HeroCover: React.FC<HookCoverProps> = (props) => {
  const { eyebrow, headline, subtitle, details, hasDetails, slideIndex, slideTotal, visual, visualSeed } =
    props;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <HeaderRow slideIndex={slideIndex} slideTotal={slideTotal} />
      <HookEyebrow label={eyebrow} />
      {subtitle ? (
        <p
          style={{
            margin: "0 0 14px",
            fontFamily: "inherit",
            fontSize: 20,
            fontWeight: 500,
            lineHeight: 1.4,
            color: "rgba(100,116,139,0.95)",
            maxWidth: 680,
          }}
        >
          {subtitle.match(/^[^.!?]+[.!?]/)?.[0] ?? subtitle}
        </p>
      ) : null}
      <Headline headline={headline} size={70} cover maxWidth={820} />
      {hasDetails ? <DetailList items={details!} compact /> : null}
      <div style={{ flex: 1, marginTop: 12, minHeight: 340, position: "relative" }}>
        <VisualSlot
          height={340}
          slideIndex={slideIndex}
          visual={visual}
          visualSeed={visualSeed}
          assetPath={props.assetPath}
        />
      </div>
    </div>
  );
};

/** Nexavest center: headline tengah, subtitle, lalu visual di bawahnya */
const CenterCover: React.FC<HookCoverProps> = (props) => {
  const { eyebrow, headline, subtitle, details, hasDetails, slideIndex, slideTotal, visual, visualSeed } =
    props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <HeaderRow slideIndex={slideIndex} slideTotal={slideTotal} compact />
      <div style={{ textAlign: "left", width: "100%", flexShrink: 0, marginTop: 12 }}>
        <div style={{ marginBottom: 14 }}>
          <span
            style={{
              display: "inline-flex",
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid #E2E8F0",
              background: "#DBEAFE",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#3B82F6",
            }}
          >
            {eyebrow}
          </span>
        </div>
        <Headline headline={headline} size={68} cover maxWidth={1020} />
        {subtitle ? <Subtitle text={subtitle} size="sm" dense /> : null}
        {hasDetails ? <DetailList items={details!} compact /> : null}
      </div>
      <div style={{ width: "100%", marginTop: 16, flexShrink: 0 }}>
        <VisualFrame height={450}>
          <div style={{ position: "relative", height: "100%", width: "100%" }}>
            <MicroblogVisual
              slideIndex={slideIndex}
              variant="hook"
              visual={visual}
              visualSeed={visualSeed}
              emphasis="hero"
              assetPath={props.assetPath}
            />
          </div>
        </VisualFrame>
      </div>
    </div>
  );
};

export const MicroblogHookCover: React.FC<HookCoverProps> = (props) => {
  switch (props.layout) {
    case "hero":
      return <HeroCover {...props} />;
    case "center":
      return <CenterCover {...props} />;
    default:
      return <ClassicCover {...props} />;
  }
};

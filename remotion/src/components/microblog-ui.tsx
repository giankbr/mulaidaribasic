import React from "react";
import { loadFont as loadPlusJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { BRAND } from "../lib/constants";

const { fontFamily: headingFont } = loadPlusJakarta("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});
const { fontFamily: bodyFont } = loadPlusJakarta("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export { headingFont, bodyFont };

function parseAccentParts(line: string) {
  const parts: { text: string; accent: boolean }[] = [];
  const re = /\*\*([^*]+)\*\*|([^*]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m[1]) parts.push({ text: m[1], accent: true });
    else if (m[2]) parts.push({ text: m[2], accent: false });
  }
  return parts.filter((p) => p.text.trim().length > 0);
}

export const Headline: React.FC<{
  headline: string;
  size: number;
  cover?: boolean;
  align?: "left" | "center";
  maxWidth?: number;
}> = ({ headline, size, cover, align = "left", maxWidth }) => {
  const lines = headline.split("|").map((l) => l.trim()).filter(Boolean);

  return (
    <div style={{ maxWidth: maxWidth ?? (cover ? 960 : 900), textAlign: align }}>
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            fontFamily: headingFont,
            fontSize: size,
            fontWeight: cover ? 700 : 800,
            lineHeight: cover ? 1.03 : 1.08,
            letterSpacing: cover ? "-0.043em" : "-0.035em",
            color: BRAND.text,
            marginBottom: li < lines.length - 1 ? (cover ? 10 : 8) : 0,
          }}
        >
          {parseAccentParts(line).map((part, i) => (
            <span
              key={i}
              style={{
                color: part.accent ? BRAND.primary : BRAND.text,
                fontWeight: part.accent && cover ? 800 : undefined,
              }}
            >
              {part.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export const DetailList: React.FC<{ items: string[]; compact?: boolean }> = ({ items, compact }) => (
  <ul style={{ marginTop: compact ? 14 : 18, paddingLeft: 0, listStyle: "none", maxWidth: 760 }}>
    {items.map((item, i) => (
      <li
        key={i}
        style={{
          display: "flex",
          gap: 10,
          marginBottom: compact ? 8 : 10,
          fontFamily: bodyFont,
          fontSize: compact ? 18 : 20,
          lineHeight: 1.45,
          fontWeight: 600,
          color: BRAND.text,
        }}
      >
        <span style={{ color: BRAND.primary, fontWeight: 700 }}>→</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export const Subtitle: React.FC<{
  text: string;
  compact?: boolean;
  align?: "left" | "center";
  size?: "sm" | "md";
  dense?: boolean;
}> = ({ text, compact, align = "left", size = "md", dense }) => (
  <p
    style={{
      marginTop: dense ? 14 : compact ? 16 : 22,
      marginBottom: dense ? 12 : undefined,
      maxWidth: align === "center" ? 800 : 940,
      marginLeft: align === "center" ? "auto" : undefined,
      marginRight: align === "center" ? "auto" : undefined,
      fontFamily: bodyFont,
      fontSize: size === "sm" ? 23 : compact ? 25 : dense ? 23 : 25,
      fontWeight: 600,
      lineHeight: dense ? 1.42 : 1.46,
      color: BRAND.muted,
      letterSpacing: "-0.01em",
      textAlign: align,
    }}
  >
    {text}
  </p>
);

export const TopWatermark: React.FC = () => (
  <div
    aria-hidden
    style={{
      position: "absolute",
      top: -78,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: headingFont,
      fontSize: 180,
      fontWeight: 900,
      lineHeight: 0.86,
      letterSpacing: "-0.02em",
      color: "rgba(37, 99, 235, 0.04)",
      pointerEvents: "none",
      userSelect: "none",
      whiteSpace: "nowrap",
    }}
  >
    @mulaidaribasic
  </div>
);

export const TopTagline: React.FC = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 12 }}>
    <span
      style={{
        fontFamily: bodyFont,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.16em",
        color: BRAND.primary,
        textTransform: "uppercase",
      }}
    >
      Mulai Dari Basic
    </span>
  </div>
);

/** Small centered brand pill — nexavest-style header mark. */
export const MicroblogTopTagline: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
      paddingTop: 2,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 18px",
        borderRadius: 999,
        background: "rgba(15,23,42,0.28)",
        border: "1px solid rgba(255,255,255,0.22)",
        backdropFilter: "blur(8px)",
      }}
    >
      <span
        style={{
          fontFamily: headingFont,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "rgba(255,255,255,0.95)",
        }}
      >
        mulaidaribasic
      </span>
    </div>
  </div>
);

/** Huge ghost brand wordmark — nexavest-style edge watermark. */
export const MicroblogGhostWatermark: React.FC = () => (
  <>
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: -36,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: headingFont,
        fontSize: 148,
        fontWeight: 800,
        lineHeight: 0.82,
        letterSpacing: "-0.05em",
        color: "rgba(255,255,255,0.10)",
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      mulaidaribasic
    </div>
    <div
      aria-hidden
      style={{
        position: "absolute",
        bottom: -28,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: headingFont,
        fontSize: 148,
        fontWeight: 800,
        lineHeight: 0.82,
        letterSpacing: "-0.05em",
        color: "rgba(255,255,255,0.08)",
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      mulaidaribasic
    </div>
  </>
);

/** Story-style progress for carousel slides (static per slide). */
export const MicroblogProgress: React.FC<{
  slideIndex: number;
  slideTotal: number;
}> = ({ slideIndex, slideTotal }) => (
  <div
    style={{
      position: "absolute",
      bottom: 72,
      left: 48,
      right: 48,
      display: "flex",
      gap: 8,
      zIndex: 3,
      pointerEvents: "none",
    }}
  >
    {Array.from({ length: slideTotal }, (_, i) => {
      const filled = i < slideIndex;
      return (
        <div
          key={i}
          style={{
            flex: 1,
            height: 5,
            borderRadius: 999,
            background: "rgba(255,255,255,0.28)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: filled ? "100%" : "0%",
              height: "100%",
              borderRadius: 999,
              background: "#FFFFFF",
            }}
          />
        </div>
      );
    })}
  </div>
);

export const CtaPill: React.FC<{ label: string }> = ({ label }) => {
  const l = label.toLowerCase();
  const icon = l.includes("save") || l.includes("simpan") ? "🔖" : l.includes("follow") ? "+" : "↗";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 22px 12px 14px",
        borderRadius: 999,
        border: `1px solid ${BRAND.border}`,
        background: BRAND.surface,
        boxShadow: "0 4px 16px rgba(37,99,235,0.1)",
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          background: BRAND.primaryLight,
          display: "grid",
          placeItems: "center",
          fontSize: 13,
          color: BRAND.primary,
          fontWeight: 700,
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontFamily: headingFont,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: BRAND.text,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const AccentBadge: React.FC<{ label: string }> = ({ label }) => {
  const text = label.length > 32 ? `${label.slice(0, 30)}…` : label;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 999,
        border: `1px solid ${BRAND.primary}44`,
        background: BRAND.primaryLight,
        fontFamily: bodyFont,
        fontSize: 12,
        fontWeight: 600,
        color: BRAND.primary,
        whiteSpace: "nowrap",
      }}
    >
      <span>{text}</span>
    </div>
  );
};

export const SlideCounter: React.FC<{ slideIndex: number; slideTotal: number }> = ({
  slideIndex,
  slideTotal,
}) => (
  <span style={{ fontSize: 13, color: BRAND.muted, fontWeight: 500 }}>
    {slideIndex}/{slideTotal}
  </span>
);

export const HookEyebrow: React.FC<{ label: string }> = ({ label }) => (
  <div
    style={{
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: BRAND.primary,
      marginBottom: 20,
    }}
  >
    {label}
  </div>
);

export const VisualFrame: React.FC<{
  children: React.ReactNode;
  height?: number;
  fill?: boolean;
}> = ({ children, height = 320, fill }) => (
  <div
    style={{
      width: "100%",
      height: fill ? "100%" : height,
      position: "relative",
      borderRadius: 28,
      border: `1px solid ${BRAND.primarySoft}`,
      background: `linear-gradient(165deg, ${BRAND.surface} 0%, ${BRAND.primaryLight} 100%)`,
      boxShadow: "0 12px 32px rgba(59,130,246,0.12), 0 1px 0 rgba(255,255,255,0.9) inset",
      overflow: "hidden",
      padding: "16px 18px",
    }}
  >
    {children}
  </div>
);

import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { BRAND } from "../lib/constants";
import {
  type MicroblogVisualType,
  pickMicroblogVisual,
} from "../lib/microblog";
import { AiIllustration } from "./AiIllustration";

type Props = {
  slideIndex: number;
  variant: "hook" | "body" | "cta";
  visual?: MicroblogVisualType;
  visualSeed?: string;
  codeLines?: string[];
  emphasis?: "normal" | "hero";
  assetPath?: string;
};

const glow = (color: string) => `drop-shadow(0 0 32px ${color}99)`;

function useFloat(offset = 0, amplitude = 8) {
  const frame = useCurrentFrame();
  return interpolate(
    (frame + offset) % 90,
    [0, 45, 90],
    [0, -amplitude, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}

function useEnter(delay = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 90 },
  });
}

export const MicroblogVisual: React.FC<Props> = ({
  slideIndex,
  variant,
  visual: explicitVisual,
  visualSeed = "mulaidaribasic",
  codeLines,
  emphasis = "normal",
  assetPath,
}) => {
  const visual = pickMicroblogVisual(
    variant,
    slideIndex,
    visualSeed,
    explicitVisual
  );
  if (visual === "none" && !assetPath) return null;
  const enter = useEnter(slideIndex * 2);
  const floatY = useFloat(slideIndex * 11, variant === "hook" ? 4 : 6);
  const isHero = emphasis === "hero";
  const baseScale = isHero ? 1.02 : 0.96;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: enter,
        transform: `translateY(${floatY}px) scale(${baseScale + enter * 0.06})`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          maxWidth: isHero ? 980 : 920,
          borderRadius: assetPath ? 18 : undefined,
          overflow: assetPath ? "hidden" : undefined,
          border: assetPath ? `1px solid ${BRAND.border}` : undefined,
        }}
      >
        {assetPath ? (
          <AiIllustration src={assetPath} />
        ) : (
          <>
            {visual === "layers" && <ProductLayers seed={visualSeed} />}
            {visual === "code" && <CodeVisual lines={codeLines} seed={slideIndex} />}
            {visual === "grid" && <FeatureGridVisual seed={slideIndex} />}
            {visual === "wireframe" && <WireframeVisual seed={slideIndex} />}
            {visual === "security" && <SecurityVisual />}
            {visual === "chart" && <ChartVisual />}
            {visual === "product" && <ProductFlowVisual seed={slideIndex} hero={isHero} />}
            {visual === "nodes" && <NodesVisual seed={slideIndex} hero={isHero} />}
            {visual === "monolith" && <MonolithVisual seed={slideIndex} />}
            {visual === "pipeline" && <PipelineVisual seed={slideIndex} />}
            {visual === "cloud" && <CloudVisual seed={slideIndex} />}
            {visual === "api" && <ApiVisual seed={slideIndex} />}
            {visual === "tracing" && <TracingVisual seed={slideIndex} />}
          </>
        )}
      </div>
    </div>
  );
};

function seeded(n: number, seed: number) {
  return ((n * 17 + seed * 13) % 10) / 10;
}

/** Floating product layers */
const ProductLayers: React.FC<{ seed: string }> = ({ seed }) => {
  const h = seed.length;
  return (
    <>
      {[
        { left: `${4 + seeded(1, h) * 4}%`, top: "8%", width: 340, height: 200, rotate: -5 - seeded(2, h) * 4, opacity: 0.55 },
        { left: `${14 + seeded(3, h) * 6}%`, top: "2%", width: 380, height: 220, rotate: seeded(4, h) * 3, opacity: 0.8 },
        { left: `${24 + seeded(5, h) * 5}%`, top: "12%", width: 420, height: 240, rotate: 4 + seeded(6, h) * 3, opacity: 1 },
      ].map((card, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: card.left,
            top: card.top,
            width: card.width,
            height: card.height,
            borderRadius: 18,
            border: "1px solid rgba(165,195,255,0.3)",
            background: `linear-gradient(165deg, rgba(219,234,254,${0.5 + i * 0.1}), rgba(255,255,255,0.96))`,
            transform: `rotate(${card.rotate}deg)`,
            opacity: card.opacity,
            boxShadow: `0 12px 28px rgba(37,99,235,0.08)`,
            padding: 20,
          }}
        >
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {[BRAND.indigo, BRAND.sky, "rgba(255,255,255,0.2)"].map((c, j) => (
              <div key={j} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <div style={{ height: 10, width: "45%", borderRadius: 5, background: "rgba(255,255,255,0.1)", marginBottom: 10 }} />
          <div style={{ height: 56, borderRadius: 10, background: `linear-gradient(90deg, ${BRAND.indigo}44, ${BRAND.sky}22)` }} />
        </div>
      ))}
    </>
  );
};

const CODE_THEME = {
  bg: "rgba(8,19,54,0.88)",
  border: "rgba(156,191,255,0.28)",
  keyword: "#9fb9ff",
  fn: "#70c1ff",
  ident: "#f8fafc",
  op: "#8cd6ff",
  comment: "#7f91ba",
  string: "#c5ddff",
} as const;

const CODE_KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "if",
  "else",
  "return",
  "function",
  "async",
  "await",
  "import",
  "export",
  "from",
  "new",
  "typeof",
]);

function highlightCodeLine(line: string): React.ReactNode {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//")) {
    return <span style={{ color: CODE_THEME.comment }}>{line}</span>;
  }

  const commentAt = line.indexOf("//");
  const code = commentAt >= 0 ? line.slice(0, commentAt) : line;
  const trailComment = commentAt >= 0 ? line.slice(commentAt) : null;

  const tokenRe =
    /(\s+)|(\b(?:const|let|var|if|else|return|function|async|await|import|export|from|new|typeof)\b)|([a-zA-Z_$][\w$]*)(?=\s*\()|([a-zA-Z_$][\w$]*)|([(){};,.=!&|?:+\-*/<>])|('[^']*'|"[^"]*")/g;

  const nodes: React.ReactNode[] = [];
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = tokenRe.exec(code)) !== null) {
    const token = match[0];
    if (/^\s+$/.test(token)) {
      nodes.push(token);
      continue;
    }
    if (CODE_KEYWORDS.has(token)) {
      nodes.push(
        <span key={key++} style={{ color: CODE_THEME.keyword }}>
          {token}
        </span>
      );
      continue;
    }
    if (match[3]) {
      nodes.push(
        <span key={key++} style={{ color: CODE_THEME.fn }}>
          {token}
        </span>
      );
      continue;
    }
    if (match[5]) {
      nodes.push(
        <span key={key++} style={{ color: CODE_THEME.op }}>
          {token}
        </span>
      );
      continue;
    }
    if (match[6]) {
      nodes.push(
        <span key={key++} style={{ color: CODE_THEME.string }}>
          {token}
        </span>
      );
      continue;
    }
    nodes.push(
      <span key={key++} style={{ color: CODE_THEME.ident }}>
        {token}
      </span>
    );
  }

  return (
    <>
      {nodes}
      {trailComment ? <span style={{ color: CODE_THEME.comment }}>{trailComment}</span> : null}
    </>
  );
}

const CodeVisual: React.FC<{ lines?: string[]; seed: number }> = ({ lines, seed }) => {
  const defaultLines = [
    "// split service belum perlu?",
    "if (!domain) stayModular();",
    "const app = monolith();",
  ];
  const rendered =
    lines && lines.length > 0
      ? lines
      : (() => {
          const start = seed % defaultLines.length;
          return [...defaultLines.slice(start), ...defaultLines.slice(0, start)];
        })();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "0 4%",
        paddingTop: 4,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 820,
          borderRadius: 16,
          border: `1px solid ${CODE_THEME.border}`,
          background: CODE_THEME.bg,
          boxShadow: "0 20px 46px rgba(3,10,30,0.48), inset 0 1px 0 rgba(214,230,255,0.18)",
          padding: "20px 28px 22px",
        }}
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div
              key={c}
              style={{ width: 12, height: 12, borderRadius: "50%", background: c, opacity: 0.95 }}
            />
          ))}
        </div>
        {rendered.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: '"SF Mono", "Fira Code", "JetBrains Mono", ui-monospace, monospace',
              fontSize: 26,
              fontWeight: 600,
              lineHeight: 1.7,
              whiteSpace: "pre",
            }}
          >
            {highlightCodeLine(line)}
          </div>
        ))}
      </div>
    </div>
  );
};

const FeatureGridVisual: React.FC<{ seed: number }> = ({ seed }) => (
  <div
    style={{
      position: "absolute",
      inset: "10% 6%",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 14,
      alignContent: "center",
    }}
  >
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        style={{
          height: 72,
          borderRadius: 12,
          border: `1px solid ${i < 3 + (seed % 2) ? BRAND.sky + "66" : "rgba(255,255,255,0.06)"}`,
          background: i < 3 + (seed % 2) ? `${BRAND.indigo}44` : "rgba(255,255,255,0.03)",
          opacity: i > 8 - (seed % 3) ? 0.3 : 1,
        }}
      />
    ))}
  </div>
);

const WireframeVisual: React.FC<{ seed: number }> = ({ seed }) => (
  <div
    style={{
      position: "absolute",
      right: `${6 + seeded(3, seed) * 6}%`,
      top: "8%",
      bottom: "8%",
      width: 320,
      borderRadius: 32,
      border: "1.5px solid rgba(255,255,255,0.1)",
      background: "linear-gradient(180deg, rgba(22,32,55,0.95), rgba(6,10,20,0.98))",
      padding: 22,
      boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
    }}
  >
    <div style={{ height: 24, width: "38%", borderRadius: 7, background: "rgba(255,255,255,0.08)", marginBottom: 18 }} />
    <div style={{ height: 90, borderRadius: 14, border: "1px dashed rgba(56,189,248,0.45)", marginBottom: 14 }} />
    {[80, 55, 65].map((w, i) => (
      <div key={i} style={{ height: 12, width: `${w - (seed % 3) * 5}%`, borderRadius: 5, background: "rgba(255,255,255,0.06)", marginBottom: 10 }} />
    ))}
  </div>
);

const SecurityVisual: React.FC = () => (
  <svg
    viewBox="0 0 400 320"
    preserveAspectRatio="xMidYMid meet"
    style={{ position: "absolute", inset: "5% 15%", width: "70%", height: "90%", filter: glow(BRAND.sky) }}
  >
    <path d="M200 24 L310 68 V148 C310 208 200 256 200 256 C200 256 90 208 90 148 V68 Z" fill="rgba(80,70,229,0.12)" stroke={BRAND.sky} strokeWidth="2.5" />
    <path d="M182 148 L194 162 L220 132" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const ChartVisual: React.FC = () => (
  <svg
    viewBox="0 0 900 380"
    preserveAspectRatio="none"
    style={{ position: "absolute", inset: "8% 0 12%", width: "100%", height: "80%", filter: glow(BRAND.sky) }}
  >
    <defs>
      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={BRAND.sky} stopOpacity="0.45" />
        <stop offset="100%" stopColor={BRAND.sky} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M0 300 C84 300, 128 300, 172 300 C218 300, 250 224, 306 224 C364 224, 386 224, 430 224 C474 224, 504 186, 560 172 C620 156, 662 220, 716 212 C770 204, 820 132, 900 70 L900 380 L0 380 Z" fill="url(#chartFill)" />
    <path d="M0 300 C84 300, 128 300, 172 300 C218 300, 250 224, 306 224 C364 224, 386 224, 430 224 C474 224, 504 186, 560 172 C620 156, 662 220, 716 212 C770 204, 820 132, 900 70" fill="none" stroke={BRAND.sky} strokeWidth="4" strokeLinecap="round" />
    <circle cx="900" cy="70" r="9" fill={BRAND.sky} stroke="#fff" strokeWidth="2" />
  </svg>
);

/** Product build journey — founder / MVP hooks */
const ProductFlowVisual: React.FC<{ seed: number; hero?: boolean }> = ({ seed, hero }) => {
  const stages = ["Research", "MVP", "UX", "Launch"].map((label, i) => ({
    label,
    x: 24 + i * 148 + (seed % 3) * 4,
    y: 80 + (i % 2) * 18,
  }));

  const boxW = hero ? 108 : 100;
  const boxH = hero ? 64 : 58;
  const fontSize = hero ? 17 : 16;

  return (
    <svg
      viewBox="0 0 640 260"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "100%", minHeight: hero ? 280 : 260 }}
    >
      {stages.slice(0, -1).map((stage, i) => {
        const next = stages[i + 1];
        return (
          <line
            key={`line-${i}`}
            x1={stage.x + boxW}
            y1={stage.y + boxH / 2}
            x2={next.x}
            y2={next.y + boxH / 2}
            stroke="rgba(56,189,248,0.35)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
        );
      })}
      {stages.map((stage, i) => (
        <g key={stage.label}>
          <rect
            x={stage.x}
            y={stage.y}
            width={boxW}
            height={boxH}
            rx={14}
            fill="#FFFFFF"
            stroke={i === 1 ? "rgba(56,189,248,0.75)" : "rgba(56,189,248,0.45)"}
            strokeWidth={i === 1 ? 2 : 1.5}
          />
          <text
            x={stage.x + boxW / 2}
            y={stage.y + boxH / 2 + 6}
            textAnchor="middle"
            fill="#fff"
            fontSize={fontSize}
            fontWeight={i === 1 ? 700 : 600}
            fontFamily="system-ui"
          >
            {stage.label}
          </text>
        </g>
      ))}
      <circle cx={stages[1].x + boxW / 2} cy={stages[1].y - 18} r={5} fill={BRAND.sky} opacity={0.9} />
    </svg>
  );
};

/** Microservices node graph */
const NodesVisual: React.FC<{ seed: number; hero?: boolean }> = ({ seed, hero }) => {
  const nodes = [
    { x: 80, y: 30, label: "API" },
    { x: 280, y: 10, label: "Auth" },
    { x: 480, y: 40, label: "Orders" },
    { x: 160, y: 200, label: "Pay" },
    { x: 380, y: 220, label: "Notify" },
  ].map((n, i) => ({ ...n, x: n.x + (seed % 3) * 10 - 10, y: n.y + (i % 2) * 8 }));

  const boxW = hero ? 110 : 104;
  const boxH = hero ? 68 : 64;
  const fontSize = hero ? 19 : 18;

  return (
    <svg
      viewBox="0 0 640 300"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "100%", minHeight: hero ? 300 : 280 }}
    >
      {[
        [0, 1], [1, 2], [0, 3], [2, 4], [3, 4],
      ].map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x + boxW / 2}
          y1={nodes[a].y + boxH / 2}
          x2={nodes[b].x + boxW / 2}
          y2={nodes[b].y + boxH / 2}
          stroke="rgba(56,189,248,0.35)"
          strokeWidth="2"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <rect
            x={n.x}
            y={n.y}
            width={boxW}
            height={boxH}
            rx={14}
            fill="#FFFFFF"
            stroke="rgba(56,189,248,0.55)"
            strokeWidth={hero ? 2 : 1.5}
          />
          <text
            x={n.x + boxW / 2}
            y={n.y + boxH / 2 + 7}
            textAnchor="middle"
            fill="#fff"
            fontSize={fontSize}
            fontWeight="600"
            fontFamily="system-ui"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

/** Single modular monolith block */
const MonolithVisual: React.FC<{ seed: number }> = ({ seed }) => (
  <div style={{ position: "absolute", left: "10%", right: "10%", top: 0, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
    {[0, 1, 2].map((layer) => (
      <div
        key={layer}
        style={{
          height: 88,
          marginBottom: 18,
          borderRadius: 18,
          border: `1px solid ${layer === 1 ? BRAND.sky + "88" : "rgba(255,255,255,0.08)"}`,
          background: layer === 1 ? "rgba(80,70,229,0.22)" : "rgba(255,255,255,0.04)",
          transform: `translateX(${(layer - 1) * (10 + (seed % 4))}px)`,
        }}
      />
    ))}
    <div style={{ textAlign: "center", color: BRAND.muted, fontSize: 15, marginTop: 12, letterSpacing: "0.1em", fontWeight: 600 }}>
      MODULAR MONOLITH
    </div>
  </div>
);

/** CI/CD pipeline arrows */
const PipelineVisual: React.FC<{ seed: number }> = ({ seed }) => (
  <div
    style={{
      position: "absolute",
      left: "4%",
      right: "4%",
      top: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
    }}
  >
    {["Build", "Test", "Deploy"].map((step, i) => (
      <React.Fragment key={step}>
        <div
          style={{
            padding: "24px 28px",
            borderRadius: 16,
            border: `1px solid ${i === (seed % 3) ? BRAND.sky : "rgba(255,255,255,0.1)"}`,
            background: i === (seed % 3) ? `${BRAND.indigo}33` : "rgba(0,0,0,0.25)",
            color: BRAND.text,
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          {step}
        </div>
        {i < 2 ? <span style={{ color: BRAND.sky, fontSize: 28 }}>→</span> : null}
      </React.Fragment>
    ))}
  </div>
);

const CloudVisual: React.FC<{ seed: number }> = ({ seed }) => (
  <svg
    viewBox="0 0 600 260"
    preserveAspectRatio="xMidYMid meet"
    style={{ position: "absolute", inset: "10% 5%", width: "90%", height: "80%", filter: glow(BRAND.sky) }}
  >
    <ellipse cx={300 + (seed % 5) * 4} cy={120} rx={180} ry={70} fill="rgba(80,70,229,0.15)" stroke={BRAND.sky} strokeWidth="2" />
    <ellipse cx={220} cy={130} rx={90} ry={45} fill="rgba(56,189,248,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
    <ellipse cx={380} cy={125} rx={100} ry={50} fill="rgba(56,189,248,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
  </svg>
);

/** Distributed tracing / observability spans */
const TracingVisual: React.FC<{ seed: number }> = ({ seed }) => {
  const spans = [
    { label: "gateway", w: 88, x: 4 },
    { label: "orders-svc", w: 62, x: 18 },
    { label: "postgres", w: 48, x: 32 },
    { label: "notify-q", w: 55, x: 22 },
  ];

  return (
    <div style={{ position: "absolute", left: "6%", right: "6%", top: 0, display: "flex", flexDirection: "column", gap: 16 }}>
      {spans.map((span, row) => (
        <div key={span.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 100, fontSize: 14, color: BRAND.muted, fontFamily: "monospace", textAlign: "right" }}>
            {span.label}
          </span>
          <div
            style={{
              marginLeft: `${span.x + (seed % 3) * 4}%`,
              width: `${span.w}%`,
              height: 36,
              borderRadius: 10,
              border: `1px solid ${row === (seed % 4) ? BRAND.sky : "rgba(255,255,255,0.12)"}`,
              background: row === (seed % 4) ? "rgba(80,70,229,0.2)" : "rgba(255,255,255,0.05)",
            }}
          />
        </div>
      ))}
    </div>
  );
};

const ApiVisual: React.FC<{ seed: number }> = ({ seed }) => (
  <div
    style={{
      position: "absolute",
      inset: "12% 8%",
      padding: "32px 36px",
      borderRadius: 22,
      border: "1px solid rgba(255,255,255,0.1)",
      background: "rgba(0,0,0,0.35)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    {["GET /health", "POST /orders", "GET /metrics"].map((route, i) => (
      <div
        key={route}
        style={{
          display: "flex",
          gap: 14,
          marginBottom: 16,
          opacity: i === seed % 3 ? 1 : 0.55,
        }}
      >
        <span style={{ color: BRAND.sky, fontFamily: "monospace", fontSize: 22 }}>{route.split(" ")[0]}</span>
        <span style={{ color: BRAND.muted, fontFamily: "monospace", fontSize: 22 }}>{route.split(" ")[1]}</span>
      </div>
    ))}
  </div>
);


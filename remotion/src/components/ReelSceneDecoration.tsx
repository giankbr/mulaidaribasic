import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../lib/constants";
import { pickReelVisual, type ReelVisual } from "../lib/reel-visual";

export { pickReelVisual, type ReelVisual };

type CtaIconKind = "save" | "follow" | "share" | "dm" | "link";

function ctaIconKind(label?: string): CtaIconKind {
  const l = (label ?? "").toLowerCase();
  if (l.includes("save") || l.includes("simpan")) return "save";
  if (l.includes("follow")) return "follow";
  if (l.includes("share")) return "share";
  if (l.includes("dm")) return "dm";
  return "link";
}

const CtaIcon: React.FC<{ kind: CtaIconKind; size?: number }> = ({ kind, size = 30 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (kind === "save") {
    return (
      <svg {...common} fill="currentColor" stroke="none">
        <path d="M6 3.5h12A1.5 1.5 0 0 1 19.5 5v16l-7.5-4.5L4.5 21V5A1.5 1.5 0 0 1 6 3.5Z" />
      </svg>
    );
  }

  if (kind === "follow") {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="16" y1="11" x2="22" y2="11" />
      </svg>
    );
  }

  if (kind === "share") {
    return (
      <svg {...common}>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
        <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
      </svg>
    );
  }

  if (kind === "dm") {
    return (
      <svg {...common}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
};

function floatAt(frame: number, offset = 0, amplitude = 10) {
  return interpolate(
    (frame + offset) % 100,
    [0, 50, 100],
    [0, -amplitude, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}

function useReveal(delay = 8) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 80 },
  });
}

const HookLayers: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = useReveal(6);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {[
        { left: "6%", top: "18%", w: 220, h: 130, rot: -6, delay: 0 },
        { left: "22%", top: "8%", w: 260, h: 150, rot: 2, delay: 12 },
        { left: "38%", top: "22%", w: 280, h: 160, rot: 5, delay: 24 },
      ].map((card, i) => {
        const floatY = floatAt(frame, i * 18, 8);
        const opacity = interpolate(reveal, [0, 1], [0, 0.55 + i * 0.15]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: card.left,
              top: card.top,
              width: card.w,
              height: card.h,
              borderRadius: 16,
              border: "1px solid rgba(37,99,235,0.2)",
              background: `linear-gradient(165deg, rgba(52,93,201,${0.14 + i * 0.06}), rgba(255,255,255,0.96))`,
              transform: `rotate(${card.rot}deg) translateY(${floatY}px) scale(${0.92 + reveal * 0.08})`,
              opacity,
              boxShadow: "0 18px 40px rgba(37,99,235,0.08)",
            }}
          >
            <div style={{ display: "flex", gap: 5, padding: 14 }}>
              {[BRAND.indigo, BRAND.sky, "rgba(255,255,255,0.2)"].map((c, j) => (
                <div key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div
              style={{
                margin: "0 14px",
                height: 8,
                width: "42%",
                borderRadius: 4,
                background: "rgba(255,255,255,0.1)",
              }}
            />
            <div
              style={{
                margin: "12px 14px 0",
                height: 44,
                borderRadius: 8,
                background: `linear-gradient(90deg, ${BRAND.indigo}44, ${BRAND.sky}22)`,
              }}
            />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          inset: "auto 0 0 0",
          height: 120,
          background: `linear-gradient(180deg, transparent, rgba(244,248,255,0.85))`,
        }}
      />
    </div>
  );
};

const NodesAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = useReveal(10);
  const nodes = [
    { x: 60, y: 40, label: "API" },
    { x: 220, y: 20, label: "Auth" },
    { x: 400, y: 50, label: "Data" },
    { x: 140, y: 150, label: "Queue" },
    { x: 320, y: 160, label: "Cache" },
  ];
  const pulse = interpolate(frame % 60, [0, 30, 60], [0.35, 0.7, 0.35]);

  return (
    <svg viewBox="0 0 520 220" style={{ width: "100%", height: "100%", opacity: 0.88 }}>
      {[
        [0, 1], [1, 2], [0, 3], [2, 4], [3, 4],
      ].map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x + 44}
          y1={nodes[a].y + 26}
          x2={nodes[b].x + 44}
          y2={nodes[b].y + 26}
          stroke={`rgba(56,189,248,${0.2 + pulse * 0.35})`}
          strokeWidth="2"
          strokeDasharray="6 4"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={n.label} opacity={interpolate(reveal, [0, 1], [0, 1]) * (0.7 + (i % 3) * 0.1)}>
          <rect
            x={n.x}
            y={n.y}
            width={88}
            height={52}
            rx={12}
            fill="#FFFFFF"
            stroke={`rgba(56,189,248,${0.4 + pulse * 0.3})`}
            strokeWidth="1.5"
          />
          <text
            x={n.x + 44}
            y={n.y + 31}
            textAnchor="middle"
            fill="#0F172A"
            fontSize="15"
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

const LayersAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = useReveal(8);
  const labels = ["Controller", "Service", "Database"];
  const pulse = interpolate(frame % 70, [0, 35, 70], [0.3, 0.8, 0.3]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        height: "100%",
        paddingTop: 16,
        opacity: interpolate(reveal, [0, 1], [0, 1]),
      }}
    >
      {labels.map((label, i) => (
        <React.Fragment key={label}>
          <div
            style={{
              padding: "16px 20px",
              minWidth: 118,
              borderRadius: 14,
              border: `1px solid rgba(56,189,248,${0.35 + (i === 1 ? pulse * 0.4 : 0)})`,
              background: `linear-gradient(135deg, rgba(24,64,196,${0.2 + i * 0.06}), rgba(255,255,255,0.96))`,
              fontFamily: "var(--font-heading)",
              fontSize: 15,
              fontWeight: 700,
              color: BRAND.text,
              textAlign: "center",
              transform: `translateY(${floatAt(frame, i * 12, 4)}px)`,
              boxShadow: i === 1 ? `0 0 28px rgba(52,120,203,${0.2 + pulse * 0.25})` : undefined,
            }}
          >
            {label}
          </div>
          {i < labels.length - 1 ? (
            <div style={{ fontSize: 22, color: BRAND.sky, opacity: 0.7 }}>→</div>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
};

const DiAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = useReveal(8);
  const pulse = interpolate(frame % 60, [0, 30, 60], [0.4, 1, 0.4]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        opacity: interpolate(reveal, [0, 1], [0, 1]),
      }}
    >
      <div
        style={{
          width: 260,
          padding: "22px 20px",
          borderRadius: 18,
          border: "1px solid rgba(37,99,235,0.25)",
          background: "rgba(255,255,255,0.96)",
          boxShadow: `0 0 32px rgba(52,120,203,${0.12 + pulse * 0.2})`,
        }}
      >
        <div style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: BRAND.sky, marginBottom: 14 }}>
          UsersService
        </div>
        {["UserRepository", "ConfigService"].map((dep, i) => (
          <div
            key={dep}
            style={{
              marginTop: i ? 10 : 0,
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(56,189,248,0.35)",
              background: "#FFFFFF",
              fontFamily: "var(--font-heading)",
              fontSize: 13,
              fontWeight: 600,
              color: BRAND.text,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: BRAND.sky, opacity: 0.5 + pulse * 0.5 }}>◂</span>
            {dep}
          </div>
        ))}
      </div>
      {[
        { top: "18%", left: "10%", label: "Provider" },
        { top: "22%", right: "8%", label: "Inject" },
      ].map((tag, i) => (
        <div
          key={tag.label}
          style={{
            position: "absolute",
            top: tag.top,
            left: tag.left,
            right: tag.right,
            padding: "6px 12px",
            borderRadius: 999,
            border: "1px solid rgba(56,189,248,0.3)",
            background: "#FFFFFF",
            fontFamily: "var(--font-heading)",
            fontSize: 11,
            fontWeight: 700,
            color: BRAND.muted,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            transform: `translateY(${floatAt(frame, i * 16, 5)}px)`,
          }}
        >
          {tag.label}
        </div>
      ))}
    </div>
  );
};

const DtoAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = useReveal(6);
  const cycle = frame % 120;
  const showInvalid = cycle > 60;
  const pulse = interpolate(cycle % 60, [0, 30, 60], [0.35, 0.9, 0.35]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        height: "100%",
        paddingTop: 12,
        opacity: interpolate(reveal, [0, 1], [0, 1]),
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          borderRadius: 12,
          border: `1px solid ${showInvalid ? "rgba(248,113,113,0.5)" : "rgba(56,189,248,0.35)"}`,
          background: "#FFFFFF",
          fontFamily: "ui-monospace, monospace",
          fontSize: 12,
          lineHeight: 1.6,
          color: showInvalid ? "#fca5a5" : BRAND.text,
          minWidth: 110,
        }}
      >
        <div style={{ color: BRAND.muted, marginBottom: 6, fontSize: 10, fontWeight: 700 }}>REQUEST</div>
        {showInvalid ? (
          <>
            <div>{"{ email: 123 }"}</div>
            <div style={{ color: "#f87171", marginTop: 6 }}>✕ invalid</div>
          </>
        ) : (
          <>
            <div>email: string</div>
            <div>name: string</div>
          </>
        )}
      </div>

      <div style={{ fontSize: 20, color: BRAND.sky, opacity: 0.75 }}>→</div>

      <div
        style={{
          padding: "16px 18px",
          borderRadius: 14,
          border: `1px solid rgba(56,189,248,${0.35 + pulse * 0.45})`,
          background: `linear-gradient(135deg, rgba(24,64,196,0.28), rgba(255,255,255,0.96))`,
          boxShadow: `0 0 24px rgba(52,120,203,${0.15 + pulse * 0.25})`,
          minWidth: 130,
        }}
      >
        <div style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700, color: BRAND.sky, letterSpacing: "0.1em", marginBottom: 8 }}>
          DTO
        </div>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: BRAND.text }}>
          CreateUserDto
        </div>
        <div style={{ marginTop: 10, fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 600, color: showInvalid ? "#f87171" : "#86efac" }}>
          {showInvalid ? "✕ rejected" : "✓ validated"}
        </div>
      </div>

      {!showInvalid ? (
        <>
          <div style={{ fontSize: 20, color: BRAND.sky, opacity: 0.75 }}>→</div>
          <div
            style={{
              padding: "14px 18px",
              borderRadius: 12,
              border: "1px solid rgba(37,99,235,0.2)",
              background: "rgba(255,255,255,0.96)",
              fontFamily: "var(--font-heading)",
              fontSize: 14,
              fontWeight: 700,
              color: BRAND.text,
            }}
          >
            Controller
          </div>
        </>
      ) : null}
    </div>
  );
};

const ApiAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = useReveal(8);
  const routes = ["GET /users", "POST /users", "PATCH /:id", "DELETE /:id"];
  const active = Math.floor((frame / 25) % routes.length);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        paddingTop: 16,
        opacity: interpolate(reveal, [0, 1], [0, 1]),
      }}
    >
      {routes.map((route, i) => (
        <div
          key={route}
          style={{
            width: 300,
            padding: "12px 16px",
            borderRadius: 12,
            border: `1px solid rgba(56,189,248,${i === active ? 0.55 : 0.22})`,
            background: i === active ? "rgba(24,64,196,0.28)" : "#FFFFFF",
            fontFamily: "ui-monospace, monospace",
            fontSize: 14,
            fontWeight: 600,
            color: i === active ? BRAND.text : BRAND.muted,
            transform: `translateX(${floatAt(frame, i * 8, 3)}px)`,
            boxShadow: i === active ? `0 0 20px rgba(52,120,203,0.3)` : undefined,
          }}
        >
          {route}
        </div>
      ))}
    </div>
  );
};

const StackAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = useReveal(8);
  const labels = ["UI", "Domain", "Data"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        paddingTop: 20,
      }}
    >
      {labels.map((label, i) => {
        const floatY = floatAt(frame, i * 14, 5);
        const width = 280 + i * 40;
        return (
          <div
            key={label}
            style={{
              width,
              height: 54,
              borderRadius: 14,
              border: "1px solid rgba(37,99,235,0.2)",
              background: `linear-gradient(90deg, rgba(219,234,254,${0.6 + i * 0.1}), rgba(255,255,255,0.95))`,
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-heading)",
              fontSize: 16,
              fontWeight: 700,
              color: BRAND.text,
              transform: `translateY(${floatY}px) scale(${0.9 + reveal * 0.1})`,
              opacity: interpolate(reveal, [0, 1], [0, 0.95]),
              boxShadow: `0 0 ${20 + frame % 30}px rgba(52,120,203,${0.08 + (i * 0.04)})`,
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

const PipelineAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = useReveal(6);
  const steps = ["Build", "Test", "Deploy"];
  const progress = interpolate(frame % 90, [0, 90], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        height: "100%",
        paddingTop: 24,
        opacity: interpolate(reveal, [0, 1], [0, 1]),
      }}
    >
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div
            style={{
              padding: "14px 22px",
              borderRadius: 14,
              border: "1px solid rgba(56,189,248,0.4)",
              background: "#FFFFFF",
              fontFamily: "var(--font-heading)",
              fontSize: 16,
              fontWeight: 700,
              color: BRAND.text,
              transform: `translateY(${floatAt(frame, i * 10, 4)}px)`,
              boxShadow: i === Math.floor(progress * 3) % 3 ? `0 0 24px ${BRAND.sky}55` : undefined,
            }}
          >
            {step}
          </div>
          {i < steps.length - 1 ? (
            <div
              style={{
                width: 36,
                height: 2,
                background: `linear-gradient(90deg, ${BRAND.sky}, rgba(56,189,248,0.15))`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -3,
                  left: `${((progress * 100 + i * 33) % 100)}%`,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: BRAND.sky,
                  boxShadow: `0 0 12px ${BRAND.sky}`,
                }}
              />
            </div>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
};

const CtaPulse: React.FC<{ label?: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame % 80, [0, 40, 80], [0.15, 0.35, 0.15]);
  const iconKind = ctaIconKind(label);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 120 + i * 70 + pulse * 20,
            height: 120 + i * 70 + pulse * 20,
            borderRadius: "50%",
            border: `1px solid rgba(56,189,248,${0.25 - i * 0.06})`,
            opacity: 0.8 - i * 0.2,
          }}
        />
      ))}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${BRAND.sky}, ${BRAND.indigo})`,
          display: "grid",
          placeItems: "center",
          color: "#fff",
        }}
      >
        <CtaIcon kind={iconKind} size={30} />
      </div>
    </div>
  );
};

export const ReelSceneDecoration: React.FC<{
  visual: ReelVisual;
  ctaLabel?: string;
}> = ({ visual, ctaLabel }) => (
  <div
    style={{
      flex: 1,
      width: "100%",
      minHeight: 300,
      marginTop: 28,
      position: "relative",
      overflow: "hidden",
      borderRadius: 18,
      border: "1px solid #E2E8F0",
      background: "linear-gradient(180deg, rgba(219,234,254,0.3) 0%, rgba(244,248,255,0.5) 100%)",
    }}
  >
    <div style={{ position: "absolute", inset: "8% 4% 4%", opacity: 0.92 }}>
      {visual === "hook" && <HookLayers />}
      {visual === "nodes" && <NodesAnim />}
      {visual === "stack" && <StackAnim />}
      {visual === "pipeline" && <PipelineAnim />}
      {visual === "layers" && <LayersAnim />}
      {visual === "di" && <DiAnim />}
      {visual === "dto" && <DtoAnim />}
      {visual === "api" && <ApiAnim />}
      {visual === "cta" && <CtaPulse label={ctaLabel} />}
    </div>
  </div>
);

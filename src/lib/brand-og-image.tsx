import type { ReactNode } from "react";

type BrandImageVariant = "og" | "icon" | "apple";

const NAVY = "#0b1d58";
const GOLD = "#f59e0b";
const CREAM = "#f0ede6";

function StarMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id="g" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#3060b8" />
          <stop offset="45%" stopColor={NAVY} />
          <stop offset="100%" stopColor="#010509" />
        </radialGradient>
      </defs>
      <path
        d="M50 6 L61 35 L91 35 L68 54 L77 82 L50 65 L23 82 L32 54 L9 35 L39 35 Z"
        fill="url(#g)"
      />
      <path d="M50 6 L61 35 L50 65 Z" fill="rgba(255,255,255,0.14)" />
      <circle cx="50" cy="50" r="17" fill="#fff" />
      <circle cx="50" cy="50" r="17" stroke={GOLD} strokeWidth="2.5" fill="none" />
      <path
        d="M41 50 L47 56 L59 44"
        fill="none"
        stroke={GOLD}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandShareImage({ variant }: { variant: BrandImageVariant }): ReactNode {
  if (variant === "og") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 96px",
          background: `linear-gradient(135deg, ${NAVY} 0%, #0a1628 55%, #010509 100%)`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 720 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: CREAM,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            EarnedStar
          </div>
          <div style={{ fontSize: 34, fontWeight: 500, color: "#a8b4c8", lineHeight: 1.35 }}>
            Reviews your customers actually earned.
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 22,
              fontWeight: 600,
              color: GOLD,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Verified · Fraud-scored · Real
          </div>
        </div>
        <StarMark size={280} />
      </div>
    );
  }

  const starSize = variant === "apple" ? 120 : 22;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: NAVY,
        borderRadius: variant === "icon" ? 6 : 36,
      }}
    >
      <StarMark size={starSize} />
    </div>
  );
}

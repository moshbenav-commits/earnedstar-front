/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import type { ReactNode } from "react";
import { HERO_TAGLINE } from "@/content/earnedstar-trust-copy";
import { ES_GOLD } from "@/lib/earnedstar-palette";

type BrandImageVariant = "og" | "icon" | "apple";

const NAVY = "#0b1d58";
const GOLD = ES_GOLD;
const CREAM = "#f0ede6";

/**
 * `bold`: the default navy-on-navy gradient star (subtle by design for the
 * large og/apple-touch images) collapses into unreadable blobs at favicon
 * size — confirmed visually (rendered PNG inspected at true pixel size, not
 * just read from source): only one point survives as a faint streak, two
 * render as solid black wedges, the sides vanish. There isn't enough
 * resolution at 32px for that subtlety to resolve. `bold` swaps the
 * gradient for a single solid, saturated fill so the star silhouette reads
 * unambiguously at tiny sizes — used for the `icon` favicon variant only;
 * apple-icon (120px+) keeps the original, already-verified-correct gradient.
 */
function StarMark({ size, bold = false }: { size: number; bold?: boolean }) {
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
        fill={bold ? GOLD : "url(#g)"}
      />
      {!bold && <path d="M50 6 L61 35 L50 65 Z" fill="rgba(255,255,255,0.14)" />}
      <circle cx="50" cy="50" r="17" fill="#fff" />
      <circle cx="50" cy="50" r="17" stroke={bold ? NAVY : GOLD} strokeWidth="2.5" fill="none" />
      <path
        d="M41 50 L47 56 L59 44"
        fill="none"
        stroke={bold ? NAVY : GOLD}
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
            {HERO_TAGLINE}
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
      <StarMark size={starSize} bold={variant === "icon"} />
    </div>
  );
}

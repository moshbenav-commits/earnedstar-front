import React from "react";

/**
 * EarnedStar Origami Mark — pentagonal star with concentric SVG gradients
 * and a circular medallion at center. Supports navy/gold/white variants.
 *
 * Adapted from the production logo system in the user's earnedstar-front repo
 * (preserves brand DNA: navy & gold + origami fold geometry).
 */
export default function EarnedStarMark({
  size = 40,
  variant = "navy",
  center = "check", // "check" | "es" | "logo" | "none"
  logoUrl = null,
  className = "",
  animated = false,
}) {
  const id = React.useId().replace(/:/g, "");
  const palette = {
    navy: {
      core1: "#1A3566", core2: "#1F3B72", core3: "#070F1E",
      shad: "#050A16", flare: "#FFFFFF",
      disk1: "#FFFFFF", disk2: "#F5F5FA", disk3: "#E5E7F0",
      ringStart: "#FDE68A", ringEnd: "#B45309",
      textPrimary: "#0F2044", textSecondary: "#B45309",
      outline1: "#B45309", outline2: "#FDE68A",
    },
    gold: {
      core1: "#FCD34D", core2: "#F59E0B", core3: "#7C2D12",
      shad: "#451A03", flare: "#FFFFFF",
      disk1: "#FFFFFF", disk2: "#FFF7E6", disk3: "#FDE68A",
      ringStart: "#FFFFFF", ringEnd: "#B45309",
      textPrimary: "#7C2D12", textSecondary: "#B45309",
      outline1: "#7C2D12", outline2: "#FDE68A",
    },
    white: {
      core1: "#FFFFFF", core2: "#FAFAF9", core3: "#E5E7F0",
      shad: "#94A3B8", flare: "#FFFFFF",
      disk1: "#0F2044", disk2: "#1A2F5B", disk3: "#0F2044",
      ringStart: "#FDE68A", ringEnd: "#B45309",
      textPrimary: "#FFFFFF", textSecondary: "#FDE68A",
      outline1: "#0F2044", outline2: "#FDE68A",
    },
  }[variant];

  const starPath = "M50.00,6.00L77.23,35.38L68.04,81.96L31.96,81.96L22.77,35.38Z";

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`${className} ${animated ? "animate-unfold" : ""}`}
      role="img"
      aria-label="EarnedStar mark"
    >
      <defs>
        <radialGradient id={`core-${id}`} cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor={palette.core1} />
          <stop offset="45%" stopColor={palette.core2} />
          <stop offset="100%" stopColor={palette.core3} />
        </radialGradient>
        <radialGradient id={`shad-${id}`} cx="62%" cy="58%" r="75%">
          <stop offset="0%" stopColor={palette.shad} stopOpacity="0" />
          <stop offset="70%" stopColor={palette.shad} stopOpacity="0" />
          <stop offset="100%" stopColor={palette.shad} stopOpacity="0.32" />
        </radialGradient>
        <radialGradient id={`flare-${id}`} cx="28%" cy="22%" r="45%">
          <stop offset="0%" stopColor={palette.flare} stopOpacity="0.16" />
          <stop offset="40%" stopColor={palette.flare} stopOpacity="0.04" />
          <stop offset="100%" stopColor={palette.flare} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`disk-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.disk1} />
          <stop offset="55%" stopColor={palette.disk2} />
          <stop offset="100%" stopColor={palette.disk3} />
        </radialGradient>
        <linearGradient id={`ring-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.ringStart} />
          <stop offset="100%" stopColor={palette.ringEnd} />
        </linearGradient>
        <clipPath id={`logoClip-${id}`}>
          <circle cx="50" cy="50" r="15" />
        </clipPath>
      </defs>

      {/* Pentagon body */}
      <path d={starPath} fill={`url(#core-${id})`} />
      <path d={starPath} fill={`url(#shad-${id})`} />
      <path d={starPath} fill={`url(#flare-${id})`} />

      {/* Origami fold facets */}
      <path d="M50,6 L61,35 L50,65 Z" fill="rgba(255,255,255,0.14)" />
      <path d="M50,6 L39,35 L50,65 Z" fill="rgba(0,0,0,0.11)" />
      <path d="M91,35 L68,54 L61,35 Z" fill="rgba(255,255,255,0.15)" />
      <path d="M9,35 L32,54 L39,35 Z" fill="rgba(0,0,0,0.09)" />
      <path d="M77,82 L50,65 L68,54 Z" fill="rgba(255,255,255,0.08)" />
      <path d="M23,82 L50,65 L32,54 Z" fill="rgba(0,0,0,0.07)" />
      <path d="M50,6 L61,35 L44,26 Z" fill="rgba(255,255,255,0.22)" />

      {/* Outlines */}
      <path d={starPath} fill="none" stroke={palette.outline1} strokeWidth={0.14} strokeOpacity="0.34" />
      <path d={starPath} fill="none" stroke={palette.outline2} strokeWidth={0.09} strokeOpacity="0.58" />

      {center !== "none" && (
        <>
          <circle cx="50" cy="50" r="17" fill={`url(#disk-${id})`} opacity="0.98" />
          <circle cx="50" cy="50" r="17" fill="none" stroke={`url(#ring-${id})`} strokeWidth="1.8" opacity="0.9" />
          <circle cx="49.8" cy="49.2" r="15.6" fill="rgba(255,255,255,0.18)" />

          {center === "check" && (
            <path
              d="M41 50 L47 56 L59 44"
              fill="none"
              stroke={palette.textPrimary}
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {center === "es" && (
            <>
              <text
                x="50"
                y="49"
                textAnchor="middle"
                fontFamily="Plus Jakarta Sans, sans-serif"
                fontSize={9.5}
                fontWeight={800}
                fill={palette.textPrimary}
                letterSpacing={-0.3}
              >
                ES
              </text>
              <text
                x="50"
                y="58"
                textAnchor="middle"
                fontFamily="Plus Jakarta Sans, sans-serif"
                fontSize={4.5}
                fontWeight={700}
                fill={palette.textSecondary}
                letterSpacing={0.6}
              >
                VERIFIED
              </text>
            </>
          )}
          {center === "logo" && logoUrl && (
            <image
              href={logoUrl}
              x={35}
              y={35}
              width={30}
              height={30}
              clipPath={`url(#logoClip-${id})`}
              preserveAspectRatio="xMidYMid slice"
            />
          )}
        </>
      )}
    </svg>
  );
}

export function EarnedStarWordmark({ variant = "navy", showTag = true, className = "" }) {
  const color = variant === "white" ? "#FFFFFF" : "#0F2044";
  const sub = variant === "white" ? "#FDE68A" : "#B45309";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <EarnedStarMark size={32} variant={variant === "white" ? "white" : "navy"} center="check" />
      <div className="flex flex-col leading-none">
        <span style={{ color, fontWeight: 800, letterSpacing: "-0.02em", fontSize: 19 }}>
          EarnedStar
        </span>
        {showTag && (
          <span
            className="font-body"
            style={{ color: sub, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", marginTop: 2 }}
          >
            VERIFIED · AUDITABLE
          </span>
        )}
      </div>
    </div>
  );
}

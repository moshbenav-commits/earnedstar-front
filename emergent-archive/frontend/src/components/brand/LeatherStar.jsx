import React from "react";

/**
 * LeatherStar — photorealistic-ish padded leather lucky-star SVG.
 * Recreates the puffy stitched leather star with oval medallion seen in the user's
 * existing brand artwork (navy/gold/white variants, center logo slot).
 */
export default function LeatherStar({
  size = 220,
  variant = "navy", // navy | gold | white
  center = "check", // check | rating | logo | none
  logoUrl = null,
  rating = "4.9",
  className = "",
  animated = false,
  showShadow = true,
}) {
  const id = React.useId().replace(/:/g, "");

  const palette = {
    navy: {
      base1: "#1F345E",
      base2: "#142552",
      base3: "#0A1736",
      shadow: "#020714",
      highlight: "#3D5A93",
      seam: "#FDE68A",
      seamDark: "#92400E",
      stitch: "#FBBF24",
      medallion1: "#FFFFFF",
      medallion2: "#FAF7F0",
      medallionRing: "#F59E0B",
      medallionRingDark: "#92400E",
    },
    gold: {
      base1: "#FDE68A",
      base2: "#F59E0B",
      base3: "#92400E",
      shadow: "#451A03",
      highlight: "#FEF3C7",
      seam: "#7C2D12",
      seamDark: "#451A03",
      stitch: "#FFFFFF",
      medallion1: "#FFFFFF",
      medallion2: "#FAF7F0",
      medallionRing: "#7C2D12",
      medallionRingDark: "#451A03",
    },
    white: {
      base1: "#FFFFFF",
      base2: "#F1ECDF",
      base3: "#D6CFBC",
      shadow: "#7C7766",
      highlight: "#FFFFFF",
      seam: "#F59E0B",
      seamDark: "#92400E",
      stitch: "#B45309",
      medallion1: "#0B1A38",
      medallion2: "#142552",
      medallionRing: "#F59E0B",
      medallionRingDark: "#7C2D12",
    },
  }[variant];

  // Pillowed star geometry — outer star with inset curves for puffy panels
  const starPath =
    "M100,12 C104,12 107,15 108,18 L121,55 C122,58 124,60 127,61 L165,67 C172,68 175,76 170,81 L143,108 C141,110 140,113 141,116 L148,154 C149,161 142,166 136,163 L102,144 C100,143 97,143 95,144 L61,163 C55,166 48,161 49,154 L56,116 C57,113 56,110 54,108 L27,81 C22,76 25,68 32,67 L70,61 C73,60 75,58 76,55 L89,18 C90,15 93,12 97,12 Z";

  // Five facet paths — each star arm split into a "lit" and "shadow" facet
  const facets = [
    // Top arm — two facets
    { d: "M100,12 L100,90 L121,55 Z", fill: "rgba(255,255,255,0.18)" },
    { d: "M100,12 L100,90 L79,55 Z", fill: "rgba(0,0,0,0.16)" },
    // Right arm
    { d: "M165,67 L100,90 L121,55 Z", fill: "rgba(255,255,255,0.10)" },
    { d: "M165,67 L100,90 L143,108 Z", fill: "rgba(0,0,0,0.10)" },
    // Bottom-right
    { d: "M148,154 L100,90 L143,108 Z", fill: "rgba(255,255,255,0.06)" },
    { d: "M148,154 L100,90 L102,144 Z", fill: "rgba(0,0,0,0.14)" },
    // Bottom-left
    { d: "M52,154 L100,90 L98,144 Z", fill: "rgba(0,0,0,0.13)" },
    { d: "M52,154 L100,90 L57,108 Z", fill: "rgba(255,255,255,0.05)" },
    // Left arm
    { d: "M35,67 L100,90 L57,108 Z", fill: "rgba(0,0,0,0.09)" },
    { d: "M35,67 L100,90 L79,55 Z", fill: "rgba(255,255,255,0.09)" },
  ];

  return (
    <svg
      viewBox="0 0 200 220"
      width={size}
      height={(size * 220) / 200}
      className={`${className} ${animated ? "animate-float" : ""}`}
      role="img"
      aria-label="EarnedStar leather lucky-star mark"
    >
      <defs>
        {/* leather grain noise */}
        <filter id={`grain-${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="3" stitchTiles="stitch" />
          <feColorMatrix
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.18 0"
          />
          <feComposite in2="SourceGraphic" operator="in" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>

        {/* puffy main body radial */}
        <radialGradient id={`body-${id}`} cx="42%" cy="32%" r="74%">
          <stop offset="0%" stopColor={palette.highlight} stopOpacity="0.95" />
          <stop offset="22%" stopColor={palette.base1} />
          <stop offset="58%" stopColor={palette.base2} />
          <stop offset="100%" stopColor={palette.base3} />
        </radialGradient>

        {/* inner shadow / volume */}
        <radialGradient id={`vol-${id}`} cx="58%" cy="68%" r="80%">
          <stop offset="0%" stopColor={palette.shadow} stopOpacity="0" />
          <stop offset="60%" stopColor={palette.shadow} stopOpacity="0" />
          <stop offset="100%" stopColor={palette.shadow} stopOpacity="0.55" />
        </radialGradient>

        {/* rim light */}
        <radialGradient id={`rim-${id}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={palette.highlight} stopOpacity="0" />
          <stop offset="92%" stopColor={palette.highlight} stopOpacity="0" />
          <stop offset="100%" stopColor={palette.highlight} stopOpacity="0.22" />
        </radialGradient>

        {/* gold seam piping gradient */}
        <linearGradient id={`seam-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.seam} />
          <stop offset="100%" stopColor={palette.seamDark} />
        </linearGradient>

        {/* medallion gradient */}
        <radialGradient id={`med-${id}`} cx="42%" cy="36%" r="68%">
          <stop offset="0%" stopColor={palette.medallion1} />
          <stop offset="80%" stopColor={palette.medallion2} />
          <stop offset="100%" stopColor={palette.medallion2} stopOpacity="0.92" />
        </radialGradient>

        {/* medallion ring gradient */}
        <linearGradient id={`ring-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.medallionRing} />
          <stop offset="50%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor={palette.medallionRingDark} />
        </linearGradient>

        {/* contact drop shadow */}
        <filter id={`shadow-${id}`} x="-30%" y="-30%" width="160%" height="180%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
          <feOffset dx="0" dy="8" result="off" />
          <feComponentTransfer in="off" result="alpha">
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <clipPath id={`starclip-${id}`}>
          <path d={starPath} />
        </clipPath>

        <clipPath id={`logoclip-${id}`}>
          <ellipse cx="100" cy="92" rx="22" ry="26" />
        </clipPath>
      </defs>

      {/* floor shadow */}
      {showShadow && (
        <ellipse cx="100" cy="190" rx="60" ry="6" fill="rgba(0,0,0,0.22)" filter={`blur(4px)`} />
      )}

      <g filter={`url(#shadow-${id})`}>
        {/* base puffy body */}
        <path d={starPath} fill={`url(#body-${id})`} />

        {/* leather grain overlay */}
        <g clipPath={`url(#starclip-${id})`} opacity="0.45">
          <rect x="0" y="0" width="200" height="220" filter={`url(#grain-${id})`} fill={palette.base2} />
        </g>

        {/* facet shading */}
        <g clipPath={`url(#starclip-${id})`}>
          {facets.map((f, i) => (
            <path key={i} d={f.d} fill={f.fill} />
          ))}
        </g>

        {/* inner volume shadow */}
        <path d={starPath} fill={`url(#vol-${id})`} />

        {/* rim highlight */}
        <path d={starPath} fill={`url(#rim-${id})`} />

        {/* gold piping/seam */}
        <path d={starPath} fill="none" stroke={`url(#seam-${id})`} strokeWidth="1.2" opacity="0.7" />

        {/* center-line seams from center to each tip */}
        <g stroke={`url(#seam-${id})`} strokeWidth="0.7" opacity="0.55" fill="none">
          <line x1="100" y1="90" x2="100" y2="14" />
          <line x1="100" y1="90" x2="163" y2="67" />
          <line x1="100" y1="90" x2="146" y2="152" />
          <line x1="100" y1="90" x2="54" y2="152" />
          <line x1="100" y1="90" x2="37" y2="67" />
        </g>

        {/* stitching along outer edge */}
        <path
          d={starPath}
          fill="none"
          stroke={palette.stitch}
          strokeWidth="0.7"
          strokeDasharray="2.4 2.4"
          opacity="0.85"
          transform="scale(0.93) translate(7,8)"
          style={{ transformOrigin: "100px 90px" }}
        />

        {/* top specular highlight blob */}
        <ellipse cx="80" cy="42" rx="22" ry="10" fill="rgba(255,255,255,0.32)" transform="rotate(-22,80,42)" filter={`blur(3px)`} />
      </g>

      {/* MEDALLION */}
      {center !== "none" && (
        <g>
          {/* outer gold ring */}
          <ellipse cx="100" cy="92" rx="28" ry="32" fill={`url(#ring-${id})`} opacity="0.95" />
          {/* inner medallion */}
          <ellipse cx="100" cy="92" rx="24" ry="28" fill={`url(#med-${id})`} />
          {/* inner highlight */}
          <ellipse cx="93" cy="84" rx="16" ry="16" fill="rgba(255,255,255,0.4)" />
          {/* gold inner ring */}
          <ellipse cx="100" cy="92" rx="24" ry="28" fill="none" stroke={`url(#ring-${id})`} strokeWidth="1.1" opacity="0.75" />

          {center === "check" && (
            <path
              d="M88 92 L96 100 L112 84"
              fill="none"
              stroke={variant === "white" ? "#FFFFFF" : palette.medallion1 === "#FFFFFF" ? "#0B1A38" : "#FFFFFF"}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {center === "rating" && (
            <>
              <text
                x="100"
                y="89"
                textAnchor="middle"
                fontFamily="Instrument Serif, serif"
                fontStyle="italic"
                fontSize="18"
                fontWeight="700"
                fill={palette.medallion1 === "#FFFFFF" ? "#0B1A38" : "#FFFFFF"}
              >
                {rating}
              </text>
              <text
                x="100"
                y="103"
                textAnchor="middle"
                fontFamily="Plus Jakarta Sans, sans-serif"
                fontSize="6"
                fontWeight="800"
                letterSpacing="1.6"
                fill={palette.medallionRingDark}
              >
                EARNED
              </text>
            </>
          )}

          {center === "logo" && logoUrl && (
            <image
              href={logoUrl}
              x="76"
              y="64"
              width="48"
              height="56"
              clipPath={`url(#logoclip-${id})`}
              preserveAspectRatio="xMidYMid slice"
            />
          )}

          {center === "logo" && !logoUrl && (
            <text
              x="100"
              y="96"
              textAnchor="middle"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontSize="7"
              fontWeight="800"
              letterSpacing="1.4"
              fill={palette.medallion1 === "#FFFFFF" ? "#0B1A38" : "#FFFFFF"}
            >
              YOUR
            </text>
          )}
        </g>
      )}
    </svg>
  );
}

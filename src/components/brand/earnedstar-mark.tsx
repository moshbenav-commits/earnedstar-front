import { cn } from "@/lib/utils";
import {
  type CenterStyle,
  type MarkColors,
  type StarStyle,
  DEFAULT_MARK_COLORS,
  getBodyGradientStops,
  getStarPath,
} from "@/lib/earnedstar-mark";

export interface EarnedStarMarkProps {
  size?: number;
  style?: StarStyle;
  centerStyle?: CenterStyle;
  colors?: MarkColors;
  logoUrl?: string | null;
  darkBg?: boolean;
  roundness?: number;
  className?: string;
  id?: string;
}

function OrigamiFacets() {
  return (
    <g>
      <path d="M50,6 L61,35 L50,65 Z" fill="rgba(255,255,255,0.10)" />
      <path d="M50,6 L39,35 L50,65 Z" fill="rgba(0,0,0,0.10)" />
      <path d="M91,35 L68,54 L61,35 Z" fill="rgba(255,255,255,0.12)" />
      <path d="M9,35 L32,54 L39,35 Z" fill="rgba(0,0,0,0.08)" />
      <path d="M77,82 L50,65 L68,54 Z" fill="rgba(255,255,255,0.07)" />
      <path d="M23,82 L50,65 L32,54 Z" fill="rgba(0,0,0,0.07)" />
      <path d="M50,6 L61,35 L44,26 Z" fill="rgba(255,255,255,0.22)" />
      <line x1="50" y1="6" x2="61" y2="35" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" />
      <line x1="50" y1="6" x2="39" y2="35" stroke="rgba(0,0,0,0.18)" strokeWidth="0.7" />
      <line x1="61" y1="35" x2="50" y2="65" stroke="rgba(0,0,0,0.12)" strokeWidth="0.7" />
      <line x1="91" y1="35" x2="68" y2="54" stroke="rgba(255,255,255,0.14)" strokeWidth="0.7" />
      <line x1="9" y1="35" x2="32" y2="54" stroke="rgba(0,0,0,0.10)" strokeWidth="0.7" />
    </g>
  );
}

function CenterBadge({
  centerStyle,
  colors,
  logoUrl,
  clipId,
}: {
  centerStyle: CenterStyle;
  colors: MarkColors;
  logoUrl?: string | null;
  clipId: string;
}) {
  const cx = 50;
  const cy = 50;
  const r = 17;

  if (centerStyle === "none") return null;

  const circle = (
    <>
      <circle cx={cx} cy={cy} r={r} fill="white" opacity={0.97} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.color1} strokeWidth={1.8} opacity={0.85} />
      <circle cx={cx} cy={cy} r={r - 3} fill="none" stroke={colors.color1} strokeWidth={0.6} opacity={0.3} />
    </>
  );

  if (centerStyle === "check") {
    return (
      <>
        {circle}
        <path
          d="M41 50 L47 56 L59 44"
          fill="none"
          stroke={colors.color1}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    );
  }

  if (centerStyle === "stars") {
    return (
      <>
        {circle}
        <text x={cx} y={47} textAnchor="middle" fontFamily="sans-serif" fontSize={11} fill={colors.color1}>
          ★★★
        </text>
        <text
          x={cx}
          y={57}
          textAnchor="middle"
          fontFamily="sans-serif"
          fontSize={5.5}
          fontWeight={700}
          fill={colors.color1}
          letterSpacing={0.3}
        >
          4.9
        </text>
      </>
    );
  }

  if (centerStyle === "logo" && logoUrl) {
    return (
      <>
        <defs>
          <clipPath id={clipId}>
            <circle cx={cx} cy={cy} r={r - 1} />
          </clipPath>
        </defs>
        {circle}
        <image
          href={logoUrl}
          x={cx - r + 2}
          y={cy - r + 2}
          width={(r - 2) * 2}
          height={(r - 2) * 2}
          clipPath={`url(#${clipId})`}
          preserveAspectRatio="xMidYMid slice"
        />
      </>
    );
  }

  return (
    <>
      {circle}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fontFamily="Plus Jakarta Sans, sans-serif"
        fontSize={9.5}
        fontWeight={800}
        fill={colors.color1}
        letterSpacing={-0.3}
      >
        ES
      </text>
      <text
        x={cx}
        y={cy + 7}
        textAnchor="middle"
        fontFamily="Plus Jakarta Sans, sans-serif"
        fontSize={5}
        fontWeight={700}
        fill={colors.color2}
        letterSpacing={0.6}
      >
        VERIFIED
      </text>
    </>
  );
}

export function EarnedStarMark({
  size = 32,
  style = "origami",
  centerStyle = "check",
  colors = DEFAULT_MARK_COLORS,
  logoUrl,
  darkBg = false,
  roundness = 4,
  className,
  id = "es-mark",
}: EarnedStarMarkProps) {
  const starPath = getStarPath(style, roundness);
  const grad = getBodyGradientStops(colors);
  const gradId = `bodyGrad-${id}`;
  const clipId = `logoClip-${id}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label="EarnedStar badge"
      className={cn("shrink-0", className)}
    >
      <defs>
        <radialGradient id={gradId} cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor={grad.light} />
          <stop offset="55%" stopColor={grad.mid} />
          <stop offset="100%" stopColor={grad.dark} />
        </radialGradient>
        {darkBg && style === "geometric" && (
          <filter id={`glow-${id}`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>
      <path
        d={starPath}
        fill={`url(#${gradId})`}
        filter={darkBg && style === "geometric" ? `url(#glow-${id})` : undefined}
      />
      {style === "origami" ? <OrigamiFacets /> : null}
      <path d={starPath} fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth={0.8} />
      <CenterBadge centerStyle={centerStyle} colors={colors} logoUrl={logoUrl} clipId={clipId} />
    </svg>
  );
}

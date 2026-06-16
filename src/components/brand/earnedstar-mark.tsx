import { cn } from "@/lib/utils";
import {
  type CenterStyle,
  type MarkColors,
  type StarStyle,
  DEFAULT_MARK_COLORS,
  getStarPath,
} from "@/lib/earnedstar-mark";
import { EarnedStarLuckyStar } from "./earnedstar-lucky-star";

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

function CenterBadge({
  centerStyle,
  colors,
  logoUrl,
  clipId,
  refined = false,
}: {
  centerStyle: CenterStyle;
  colors: MarkColors;
  logoUrl?: string | null;
  clipId: string;
  refined?: boolean;
}) {
  const cx = 50;
  const cy = 50;
  const r = 17;

  if (centerStyle === "none") return null;

  const medallion = refined ? (
    <>
      <ellipse cx={cx} cy={52.5} rx={14.5} ry={14.5} fill={`url(#inset-${clipId})`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#disk-${clipId})`} opacity={0.97} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#goldring-${clipId})`} strokeWidth={1.8} opacity={0.85} />
      <circle cx={49.8} cy={49.2} r={15.6} fill={`url(#ringhi-${clipId})`} />
    </>
  ) : (
    <>
      <circle cx={cx} cy={cy} r={r} fill="white" opacity={0.97} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.color1} strokeWidth={1.8} opacity={0.85} />
      <circle cx={cx} cy={cy} r={r - 3} fill="none" stroke={colors.color1} strokeWidth={0.6} opacity={0.3} />
    </>
  );

  const circle = medallion;

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
  if (style === "origami") {
    const showBadge = centerStyle !== "none";
    return (
      <EarnedStarLuckyStar
        size={size}
        variant="navy"
        showBadge={showBadge}
        logoUrl={centerStyle === "logo" ? logoUrl : null}
        className={className}
      />
    );
  }

  const starPath = getStarPath(style, roundness);
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
          <stop offset="0%" stopColor={colors.color1} />
          <stop offset="55%" stopColor={colors.color2} />
          <stop offset="100%" stopColor={colors.color3} />
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
      <path d={starPath} fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth={0.8} />
      <CenterBadge
        centerStyle={centerStyle}
        colors={colors}
        logoUrl={logoUrl}
        clipId={clipId}
        refined={false}
      />
    </svg>
  );
}

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  type CenterStyle,
  type MarkColors,
  type StarStyle,
  DEFAULT_MARK_COLORS,
  getStarPath,
  resolveRefinedOrigamiPalette,
} from "@/lib/earnedstar-mark";
import { getPhotoLogoForDisplay, MARK_3D_MIN_SIZE } from "@/lib/brand-assets";

export interface EarnedStarMarkProps {
  size?: number;
  style?: StarStyle;
  /** photo/3d = photoreal leather PNG+WEBP (default for origami). svg = vector fallback. */
  render?: "photo" | "3d" | "svg";
  /** Use hero-1600 asset (landing hero, large marketing). */
  preferHero?: boolean;
  centerStyle?: CenterStyle;
  colors?: MarkColors;
  logoUrl?: string | null;
  darkBg?: boolean;
  roundness?: number;
  className?: string;
  id?: string;
}

function RefinedOrigamiFacets() {
  return (
    <g>
      <path d="M50,6 L61,35 L50,65 Z" fill="rgba(255,255,255,0.14)" />
      <path d="M50,6 L39,35 L50,65 Z" fill="rgba(0,0,0,0.11)" />
      <path d="M91,35 L68,54 L61,35 Z" fill="rgba(255,255,255,0.15)" />
      <path d="M9,35 L32,54 L39,35 Z" fill="rgba(0,0,0,0.09)" />
      <path d="M77,82 L50,65 L68,54 Z" fill="rgba(255,255,255,0.08)" />
      <path d="M23,82 L50,65 L32,54 Z" fill="rgba(0,0,0,0.07)" />
      <path d="M50,6 L61,35 L44,26 Z" fill="rgba(255,255,255,0.22)" />
      <line x1="50" y1="6" x2="61" y2="35" stroke="rgba(26,53,102,0.25)" strokeWidth={0.35} strokeDasharray="0.6 1.2" />
      <line x1="50" y1="6" x2="39" y2="35" stroke="rgba(26,53,102,0.25)" strokeWidth={0.35} strokeDasharray="0.6 1.2" />
      <line x1="61" y1="35" x2="50" y2="65" stroke="rgba(26,53,102,0.20)" strokeWidth={0.35} strokeDasharray="0.6 1.2" />
      <line x1="91" y1="35" x2="68" y2="54" stroke="rgba(26,53,102,0.20)" strokeWidth={0.35} strokeDasharray="0.6 1.2" />
      <line x1="9" y1="35" x2="32" y2="54" stroke="rgba(26,53,102,0.20)" strokeWidth={0.35} strokeDasharray="0.6 1.2" />
    </g>
  );
}

function OrigamiFacets({ refined = false }: { refined?: boolean }) {
  if (refined) return <RefinedOrigamiFacets />;
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

function EarnedStarMarkPhoto({
  size,
  centerStyle,
  logoUrl,
  className,
  preferHero,
}: {
  size: number;
  centerStyle: CenterStyle;
  logoUrl?: string | null;
  className?: string;
  preferHero?: boolean;
}) {
  const asset = getPhotoLogoForDisplay(size, preferHero);
  const medallion = Math.round(size * 0.34);
  const medallionOffset = Math.round((size - medallion) / 2);

  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label="EarnedStar badge"
    >
      <picture>
        <source srcSet={asset.webp} type="image/webp" />
        <Image
          src={asset.png}
          alt=""
          width={size}
          height={size}
          className="h-full w-full object-contain"
          priority={size >= 120 || preferHero}
          unoptimized={asset.bucket === "hero"}
        />
      </picture>
      {centerStyle === "logo" && logoUrl ? (
        <Image
          src={logoUrl}
          alt=""
          width={medallion}
          height={medallion}
          className="absolute rounded-full object-cover ring-2 ring-gold/80"
          style={{ left: medallionOffset, top: medallionOffset }}
        />
      ) : null}
      {centerStyle === "check" ? (
        <span
          className="pointer-events-none absolute flex items-center justify-center rounded-full bg-white/95 ring-2 ring-gold/80"
          style={{ width: medallion, height: medallion, left: medallionOffset, top: medallionOffset }}
          aria-hidden
        >
          <svg viewBox="0 0 24 24" width={medallion * 0.55} height={medallion * 0.55}>
            <path
              d="M5 12 L10 17 L19 7"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </span>
  );
}

export function EarnedStarMark({
  size = 32,
  style = "origami",
  render,
  preferHero = false,
  centerStyle = "check",
  colors = DEFAULT_MARK_COLORS,
  logoUrl,
  darkBg = false,
  roundness = 4,
  className,
  id = "es-mark",
}: EarnedStarMarkProps) {
  const usePhoto =
    render === "photo" ||
    render === "3d" ||
    (render !== "svg" && style === "origami" && size >= MARK_3D_MIN_SIZE);

  if (usePhoto) {
    return (
      <EarnedStarMarkPhoto
        size={size}
        centerStyle={centerStyle}
        logoUrl={logoUrl}
        className={className}
        preferHero={preferHero}
      />
    );
  }

  const starPath = getStarPath(style, roundness);
  const refinedOrigami = style === "origami";
  const palette = refinedOrigami ? resolveRefinedOrigamiPalette(colors) : null;
  const gradId = `bodyGrad-${id}`;
  const shadId = `bodyShad-${id}`;
  const flareId = `bodyFlare-${id}`;
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
        {refinedOrigami && palette ? (
          <>
            <radialGradient id={gradId} cx="38%" cy="32%" r="68%">
              <stop offset="0%" stopColor={palette.hi} />
              <stop offset="45%" stopColor={palette.mid} />
              <stop offset="100%" stopColor={palette.shadow} />
            </radialGradient>
            <radialGradient id={shadId} cx="62%" cy="58%" r="75%">
              <stop offset="0%" stopColor={palette.dark} stopOpacity={0} />
              <stop offset="70%" stopColor={palette.dark} stopOpacity={0} />
              <stop offset="100%" stopColor={palette.shadow} stopOpacity={0.32} />
            </radialGradient>
            <radialGradient id={flareId} cx="28%" cy="22%" r="45%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.16} />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity={0.04} />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </radialGradient>
            <radialGradient id={`inset-${clipId}`} cx="50%" cy="52.5%" r="50%">
              <stop offset="0%" stopColor="#050A16" stopOpacity={0} />
              <stop offset="100%" stopColor="#050A16" stopOpacity={0.14} />
            </radialGradient>
            <radialGradient id={`disk-${clipId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#F5F5FA" />
              <stop offset="100%" stopColor="#E5E7F0" />
            </radialGradient>
            <radialGradient id={`ringhi-${clipId}`} cx="49.8%" cy="49.2%" r="45%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </radialGradient>
            <linearGradient id={`goldring-${clipId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </>
        ) : (
          <radialGradient id={gradId} cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor={colors.color1} />
            <stop offset="55%" stopColor={colors.color2} />
            <stop offset="100%" stopColor={colors.color3} />
          </radialGradient>
        )}
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
      {refinedOrigami && palette ? (
        <>
          <path d={starPath} fill={`url(#${shadId})`} />
          <path d={starPath} fill={`url(#${flareId})`} />
        </>
      ) : null}
      {style === "origami" ? <OrigamiFacets refined={refinedOrigami} /> : null}
      {refinedOrigami ? (
        <>
          <path d={starPath} fill="none" stroke="#B45309" strokeWidth={0.14} strokeOpacity={0.34} />
          <path d={starPath} fill="none" stroke="#FDE68A" strokeWidth={0.09} strokeOpacity={0.58} />
        </>
      ) : (
        <path d={starPath} fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth={0.8} />
      )}
      <CenterBadge
        centerStyle={centerStyle}
        colors={colors}
        logoUrl={logoUrl}
        clipId={clipId}
        refined={refinedOrigami}
      />
    </svg>
  );
}

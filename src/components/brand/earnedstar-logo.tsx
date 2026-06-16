import { cn } from "@/lib/utils";
import {
  EarnedStarLuckyStar,
  EarnedStarOutlineStar,
  EarnedStarWordmark,
  type LuckyStarVariant,
} from "./earnedstar-lucky-star";

interface EarnedStarLogoProps {
  variant?: "default" | "light";
  showWordmark?: boolean;
  size?: number;
  /** When false, star only (no center medallion). Alias: centerStyle="none" */
  showBadge?: boolean;
  /** @deprecated use showBadge={false} */
  centerStyle?: "none" | "check" | "logo" | "stars";
  logoUrl?: string | null;
  luckyVariant?: LuckyStarVariant;
  className?: string;
  /** @deprecated ignored — no cream platter shells */
  shell?: "none" | "light" | "dark" | "hero" | "glow" | "auto";
}

/** Primary lockup — Figma Make lucky star + EarnedStar wordmark. No photoreal shells. */
export function EarnedStarLogo({
  showWordmark = true,
  size = 32,
  variant = "default",
  showBadge: showBadgeProp,
  centerStyle,
  logoUrl,
  luckyVariant = "navy",
  className,
}: EarnedStarLogoProps) {
  const showBadge = showBadgeProp ?? centerStyle !== "none";
  const onDark = variant === "light";
  const markSize = showWordmark ? Math.round(size * 0.92) : size;

  const mark = onDark ? (
    <EarnedStarOutlineStar size={markSize} showBadge={showBadge} />
  ) : (
    <EarnedStarLuckyStar
      size={markSize}
      variant={luckyVariant}
      showBadge={showBadge}
      logoUrl={logoUrl}
    />
  );

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {mark}
      {showWordmark ? <EarnedStarWordmark size={size} onDark={onDark} /> : null}
    </span>
  );
}

export { DEMO_MERCHANT_LOGO_URL } from "@/lib/brand-assets";

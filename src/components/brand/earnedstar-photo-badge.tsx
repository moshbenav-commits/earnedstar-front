import Image from "next/image";
import {
  badgeLogoOverlayPx,
  badgePhotoSrcForDisplay,
  type BadgePhotoVariant,
} from "@/lib/badge-photo-assets";
import { cn } from "@/lib/utils";

export type EarnedStarPhotoBadgeProps = {
  /** Navy (default), gold, or white leather star body */
  variant?: BadgePhotoVariant;
  /** Display width/height in px (square) */
  size?: number;
  /** Merchant logo URL — clipped circle in center medallion */
  logoUrl?: string | null;
  /** Alt text for the star background */
  alt?: string;
  className?: string;
  /** Show placeholder initial when no logoUrl */
  logoFallback?: string;
};

/**
 * Photoreal EarnedStar badge with optional merchant logo overlay.
 * Matches earnedstar-badge-logo-overlay-snippet.html positioning.
 */
export function EarnedStarPhotoBadge({
  variant = "navy",
  size = 128,
  logoUrl,
  alt = "EarnedStar verified badge",
  className,
  logoFallback = "E",
}: EarnedStarPhotoBadgeProps) {
  const { src, intrinsic } = badgePhotoSrcForDisplay(variant, size);
  const logoPx = badgeLogoOverlayPx(size);

  return (
    <div
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
      data-earnedstar-photo-badge={variant}
    >
      <Image
        src={src}
        alt={alt}
        width={intrinsic}
        height={intrinsic}
        className="block h-full w-full object-contain"
        sizes={`${size}px`}
        priority={size >= 128}
      />

      {(logoUrl || logoFallback) && (
        <div
          className="absolute overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-gold/40"
          style={{
            width: logoPx,
            height: logoPx,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -49%)",
          }}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={logoPx}
              height={logoPx}
              className="h-full w-full object-cover"
              unoptimized={logoUrl.startsWith("http")}
            />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center text-xs font-bold text-navy"
              aria-hidden
            >
              {logoFallback.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/** All three color variants in a row — merchant widget builder / marketing */
export function EarnedStarPhotoBadgeVariants({
  size = 96,
  logoUrl,
  className,
}: {
  size?: number;
  logoUrl?: string | null;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-center gap-6", className)}>
      {(["navy", "gold", "white"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <EarnedStarPhotoBadge variant={variant} size={size} logoUrl={logoUrl} />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-faint">
            {variant}
          </span>
        </div>
      ))}
    </div>
  );
}

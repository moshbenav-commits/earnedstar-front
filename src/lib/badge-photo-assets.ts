/** Photoreal 3D leather star badges — navy / gold / white + merchant logo zone */

export const BADGE_PHOTO_VARIANTS = ["navy", "gold", "white"] as const;
export type BadgePhotoVariant = (typeof BADGE_PHOTO_VARIANTS)[number];

export const BADGE_PHOTO_SIZES = [64, 96, 128, 192, 256, 512] as const;
export type BadgePhotoSize = (typeof BADGE_PHOTO_SIZES)[number];

const BADGE_BASE = "/brand/badge";

/** Center logo diameter at 128px badge (from logo-zone spec). */
export const BADGE_LOGO_SIZE_AT_128 = 46;

export function pickBadgePhotoBucket(displayPx: number): BadgePhotoSize {
  const target = Math.max(64, Math.ceil(displayPx * 2));
  for (const size of BADGE_PHOTO_SIZES) {
    if (size >= target) return size;
  }
  return 512;
}

export function badgePhotoSrc(variant: BadgePhotoVariant, bucket: BadgePhotoSize): string {
  return `${BADGE_BASE}/earnedstar-${variant}-photo-logo-${bucket}.png`;
}

export function badgePhotoSrcForDisplay(
  variant: BadgePhotoVariant,
  displayPx: number,
): { src: string; bucket: BadgePhotoSize; intrinsic: number } {
  const bucket = pickBadgePhotoBucket(displayPx);
  return {
    src: badgePhotoSrc(variant, bucket),
    bucket,
    intrinsic: bucket,
  };
}

/** Merchant logo circle size scales with badge display size. */
export function badgeLogoOverlayPx(badgeDisplayPx: number): number {
  return Math.round((badgeDisplayPx * BADGE_LOGO_SIZE_AT_128) / 128);
}

export const LEATHER_WORDMARK_SRC = "/brand/leather/wordmark-navy-gold.png";
export const LEATHER_MOTTO_SRC = "/brand/leather/motto-navy-gold.png";

/** Photoreal 3D leather logo — earnedstar/public/brand/photo/ */

export const LOGO_3D_HORIZONTAL_SRC = "/brand/png/logo-3d-horizontal-primary.png";
export const MARK_3D_NAVY_GOLD_SRC = "/brand/png/mark-3d-navy-gold.png";
export const LOGO_3D_LOCKUP_MIN_SIZE = 100;

export const PHOTO_LOGO_SIZES = [16, 32, 48, 64, 96, 128, 192, 256, 512, 1024] as const;
export type PhotoLogoSize = (typeof PHOTO_LOGO_SIZES)[number];

const PHOTO_BASE = "/brand/photo";

/** Pick smallest asset bucket that covers 2× display px (retina). */
export function pickPhotoLogoBucket(displayPx: number, preferHero = false): PhotoLogoSize | "hero" {
  if (preferHero || displayPx >= 280) return "hero";
  const target = Math.max(16, Math.ceil(displayPx * 2));
  for (const size of PHOTO_LOGO_SIZES) {
    if (size >= target) return size;
  }
  return 1024;
}

export function photoLogoBasename(bucket: PhotoLogoSize | "hero"): string {
  return bucket === "hero" ? "earnedstar-photo-logo-hero-1600" : `earnedstar-photo-logo-${bucket}`;
}

export function getPhotoLogoPng(bucket: PhotoLogoSize | "hero"): string {
  return `${PHOTO_BASE}/${photoLogoBasename(bucket)}.png`;
}

export function getPhotoLogoWebp(bucket: PhotoLogoSize | "hero"): string {
  return `${PHOTO_BASE}/${photoLogoBasename(bucket)}.webp`;
}

/** Intrinsic pixel width of the file (hero PNG is 1024×1024 source). */
export function photoLogoIntrinsicSize(bucket: PhotoLogoSize | "hero"): number {
  return bucket === "hero" ? 1024 : bucket;
}

export function getPhotoLogoForDisplay(displayPx: number, preferHero = false) {
  const bucket = pickPhotoLogoBucket(displayPx, preferHero);
  return {
    bucket,
    png: getPhotoLogoPng(bucket),
    webp: getPhotoLogoWebp(bucket),
    intrinsic: photoLogoIntrinsicSize(bucket),
  };
}

/** @deprecated Use getPhotoLogoForDisplay — cropped brand-sheet PNGs superseded by photo exports */
export type Mark3dVariant = "navy-gold" | "all-gold" | "all-white" | "primary";

export const MARK_3D_MIN_SIZE = 16;

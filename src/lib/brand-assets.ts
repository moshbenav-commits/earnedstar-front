/** Canonical 3D rendered logo assets — extracted from earnedstar-origami-logo-system.png */

export type Mark3dVariant = "navy-gold" | "all-gold" | "all-white" | "primary";

const MARK_3D: Record<Mark3dVariant, string> = {
  "navy-gold": "/brand/png/mark-3d-navy-gold.png",
  "all-gold": "/brand/png/mark-3d-all-gold.png",
  "all-white": "/brand/png/mark-3d-all-white.png",
  primary: "/brand/png/mark-3d-primary-star.png",
};

export const LOGO_3D_HORIZONTAL = "/brand/png/logo-3d-horizontal-primary.png";
export const BRAND_SYSTEM_REFERENCE = "/brand/png/brand-system-reference.png";

/** Use 3D PNG for all origami marks; SVG only when render="svg" (favicon/embed) */
export const MARK_3D_MIN_SIZE = 28;

export function getMark3dSrc(variant: Mark3dVariant = "navy-gold", size = 100): string {
  if (size < 80 && variant === "navy-gold") return MARK_3D.primary;
  return MARK_3D[variant];
}

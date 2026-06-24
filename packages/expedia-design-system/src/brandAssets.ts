/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
export type BrandId = 'parts' | 'transmissions' | 'engines';

export type BrandLogoVariant =
  | 'flat'
  | 'premium'
  | 'photoreal'
  | 'sticker'
  | 'horizontal'
  | 'icon'
  | 'wordmark'
  | 'onecolor';

export type BrandSheen = 'none' | 'hover' | 'auto';

export const BRAND_LOGO_BASE = '/brand-logos';

/** Maps brand + variant → public SVG path (symlinked from workspace brand/logos). */
export const brandLogoPaths: Record<
  BrandId,
  Partial<Record<BrandLogoVariant, string>>
> = {
  transmissions: {
    flat: `${BRAND_LOGO_BASE}/svg/expedia-transmissions-emblem-flat.svg`,
    premium: `${BRAND_LOGO_BASE}/svg/expedia-transmissions-emblem-chrome.svg`,
    photoreal: `${BRAND_LOGO_BASE}/png/expedia-transmissions-emblem-photoreal-hero.png`,
    horizontal: `${BRAND_LOGO_BASE}/svg/expedia-transmissions-primary.svg`,
    sticker: `${BRAND_LOGO_BASE}/svg/expedia-transmissions-sticker.svg`,
    wordmark: `${BRAND_LOGO_BASE}/svg/expedia-transmissions-wordmark.svg`,
    onecolor: `${BRAND_LOGO_BASE}/svg/expedia-transmissions-emblem-onecolor-white.svg`,
    icon: `${BRAND_LOGO_BASE}/svg/expedia-transmissions-icon.svg`,
  },
  engines: {
    flat: `${BRAND_LOGO_BASE}/svg/expedia-engines-emblem-flat.svg`,
    premium: `${BRAND_LOGO_BASE}/svg/expedia-engines-emblem-chrome.svg`,
    photoreal: `${BRAND_LOGO_BASE}/png/expedia-engines-emblem-chrome-2x.png`,
    horizontal: `${BRAND_LOGO_BASE}/svg/expedia-engines-primary.svg`,
    sticker: `${BRAND_LOGO_BASE}/svg/expedia-engines-sticker.svg`,
    icon: `${BRAND_LOGO_BASE}/svg/expedia-engines-icon.svg`,
  },
  parts: {
    horizontal: `${BRAND_LOGO_BASE}/svg/expedia-ep-monogram.svg`,
    icon: `${BRAND_LOGO_BASE}/svg/expedia-ep-icon.svg`,
  },
};

export function resolveBrandLogoPath(
  brand: BrandId,
  variant: BrandLogoVariant,
): string | undefined {
  return brandLogoPaths[brand]?.[variant];
}

export const brandDisplayNames: Record<BrandId, string> = {
  parts: 'ExpediaParts',
  transmissions: 'Expedia Transmissions',
  engines: 'Expedia Engines',
};

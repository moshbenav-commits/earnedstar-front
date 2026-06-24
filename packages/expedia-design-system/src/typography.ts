/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/**
 * Tailwind class bundles matching the official STYLES typography spec.
 */

/** H1 — Anton 50pt, Black (900), 120% line height */
export const typeH1 =
  'font-display font-black uppercase leading-[120%] tracking-[0] text-text';

/** H2 — Bebas Neue 48pt, Black (900), 100% line height */
export const typeH2 =
  'font-heading font-black uppercase leading-[100%] tracking-[0] text-text';

/** H3 — Bebas Neue 26pt, Black (900), 110% line height */
export const typeH3 =
  'font-heading font-black uppercase leading-[110%] tracking-[0] text-text';

/** H4 — Inter 22pt Black */
export const typeH4 =
  'font-sans text-[1.375rem] font-black leading-[1.227] tracking-[-0.03em] text-text';

/** Body Regular — Inter 16pt */
export const typeBody =
  'font-sans text-base font-normal leading-[140%] tracking-[-0.03em] text-text-secondary';

/** CTAs — Inter 16pt Bold */
export const typeCta =
  'font-sans text-base font-bold leading-[120%] tracking-[-0.03em]';

/** Labels Semi-bold — Inter 14pt */
export const typeLabel =
  'font-sans text-sm font-semibold leading-[120%] tracking-[-0.02em]';

/** Labels Regular — Inter 14pt */
export const typeLabelRegular =
  'font-sans text-sm font-normal leading-[120%] tracking-[-0.02em]';

/** Label Small — Inter 12pt (metadata; use with text-text-muted) */
export const typeLabelSmall =
  'font-sans text-xs font-semibold leading-[120%] tracking-[-0.02em] text-text-muted';

/** Text links — Blueberry (STYLES) */
export const typeLink =
  'font-sans text-base font-medium text-link underline-offset-4 hover:text-link/80 hover:underline';

export const typeDismiss =
  'font-sans text-base text-text-secondary underline underline-offset-4 transition-colors hover:text-text';

/**
 * Typography on `[data-surface="dark"]` — no embedded dark text tokens.
 * Prefer these (or globals.css overrides) instead of typeH* / typeBody on dark shells.
 */
export const typeH1OnDark =
  'font-display font-black uppercase leading-[120%] tracking-[0] text-white';

export const typeH2OnDark =
  'font-heading font-black uppercase leading-[100%] tracking-[0] text-white';

export const typeH3OnDark =
  'font-heading font-black uppercase leading-[110%] tracking-[0] text-white';

export const typeH4OnDark =
  'font-sans text-[1.375rem] font-black leading-[1.227] tracking-[-0.03em] text-white';

export const typeBodyOnDark =
  'font-sans text-base font-normal leading-[140%] tracking-[-0.03em] text-gray-200';

export const typeLabelOnDark =
  'font-sans text-sm font-semibold leading-[120%] tracking-[-0.02em] text-gray-100';

/** Home marketing section titles — Bebas, scales 32px→48px */
export const homeSectionTitleClass =
  'font-normal text-[clamp(2rem,8vw,3rem)] leading-[100%] tracking-[0px] text-center';

/** Home subsection / article headlines */
export const homeSectionHeadlineClass =
  'font-normal text-[clamp(1.75rem,6vw,3rem)] leading-[100%] tracking-[0px] uppercase';

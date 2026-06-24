/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/**
 * Expedia Parts design system tokens (official STYLES spec).
 * Use these values for all new UI; prefer semantic names over raw hex in components.
 */

/** Shared brand-family palette (ExpediaParts · Transmissions · Engines). */
export const brandFamily = {
  expediaBlack: '#05070D',
  expediaNavy: '#0A1020',
  expediaWhite: '#FFFFFF',
  transNavy: '#0A1020',
  transBlue: '#1769FF',
  transBlueHover: '#3D84FF',
  engNavy: '#0A1020',
  engGold: '#F5A623',
  engGoldHover: '#FFB84D',
} as const;

export const colors = {
  black: '#000000',
  darkBlue: '#0D1217',
  watermelonRed: '#B43642',
  spanishOrange: '#E76D0D',
  orange: '#FF7F0A',
  crayola: '#FFA81C',
  yellow: '#FFC335',
  floralWhite: '#FDF8EE',
  mayGreen: '#459145',
  blueberry: '#4C87F4',
  grey: '#94A3B1',
  grey2: '#D3DCE3',
  grey3: '#F1F2F4',
  /** Warm off-white for page/card backgrounds (not pure #FFF). */
  offWhite: '#FAF9F6',
  white: '#FFFFFF',
} as const;

/** Semantic aliases used across the app (map to spec colors). */
export const semanticColors = {
  primary: colors.orange,
  secondary: colors.crayola,
  tertiary: colors.yellow,
  accent: colors.watermelonRed,
  accentLight: colors.spanishOrange,
  success: colors.mayGreen,
  error: colors.watermelonRed,
  warning: colors.yellow,
  link: colors.blueberry,
  text: colors.darkBlue,
  textSecondary: colors.black,
  /** Decorative only — fails WCAG on white; use textMutedAccessible for UI copy */
  textMuted: colors.grey,
  /** ~4.6:1 on white / floral white (WCAG AA body text) */
  textMutedAccessible: '#5F6E7B',
  placeholder: '#5F6E7B',
  surface: colors.offWhite,
  surfaceSecondary: colors.grey3,
  surfaceDisabled: colors.grey2,
  ctaBackground: colors.floralWhite,
  ctaFind: colors.spanishOrange,
  chatHeader: colors.darkBlue,
  chatAgentBubbleSales: '#FFE8D1',
  chatAgentBubbleSupport: '#FFF0D4',
  chatUserBubble: '#C8DBFA',
} as const;

/** Solid part-type pills (Engine / Transmission / Transfer Case) — white label text. */
export const partTypeBadgeColors = {
  engine: '#B43642',
  transmission: '#00306E',
  transferCase: '#4F138F',
} as const;

/**
 * Typography scale from STYLES spec.
 * Sizes are implemented in px (design doc pt values treated as px for web).
 */
export const typography = {
  h1: {
    fontFamily: 'var(--font-anton), Anton, sans-serif',
    fontSize: '3.125rem', // 50pt
    fontWeight: 900,
    lineHeight: '120%',
    letterSpacing: '0',
  },
  h2: {
    fontFamily: 'var(--font-bebas-neue), "Bebas Neue", sans-serif',
    fontSize: '3rem', // 48pt
    fontWeight: 900,
    lineHeight: '100%',
    letterSpacing: '0',
  },
  h3: {
    fontFamily: 'var(--font-bebas-neue), "Bebas Neue", sans-serif',
    fontSize: '1.625rem', // 26pt
    fontWeight: 900,
    lineHeight: '110%',
    letterSpacing: '0',
  },
  h4: {
    fontFamily: 'var(--font-inter), Inter, sans-serif',
    fontSize: '1.375rem', // 22pt
    fontWeight: 900,
    lineHeight: '1.227', // 27pt on 22pt
    letterSpacing: '-0.03em',
  },
  body: {
    fontFamily: 'var(--font-inter), Inter, sans-serif',
    fontSize: '1rem', // 16pt
    fontWeight: 400,
    lineHeight: '140%',
    letterSpacing: '-0.03em',
  },
  cta: {
    fontFamily: 'var(--font-inter), Inter, sans-serif',
    fontSize: '1rem', // 16pt
    fontWeight: 700,
    lineHeight: '120%',
    letterSpacing: '-0.03em',
  },
  labelSemiBold: {
    fontFamily: 'var(--font-inter), Inter, sans-serif',
    fontSize: '0.875rem', // 14pt
    fontWeight: 600,
    lineHeight: '120%',
    letterSpacing: '-0.02em',
  },
  labelRegular: {
    fontFamily: 'var(--font-inter), Inter, sans-serif',
    fontSize: '0.875rem', // 14pt
    fontWeight: 400,
    lineHeight: '120%',
    letterSpacing: '-0.02em',
  },
  labelSmall: {
    fontFamily: 'var(--font-inter), Inter, sans-serif',
    fontSize: '0.75rem', // 12pt — metadata only; pair with textMutedAccessible
    fontWeight: 600,
    lineHeight: '120%',
    letterSpacing: '-0.02em',
  },
} as const;

/** Icon sizes from STYLES icon sheet */
export const iconSizes = {
  inline: 16,
  primary: 24,
  elevated: 32,
  standalone: 48,
} as const;

export type BrandFamilyColor = keyof typeof brandFamily;
export type DesignColor = keyof typeof colors;
export type SemanticColor = keyof typeof semanticColors;

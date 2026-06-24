/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import type { BrandId } from '@expedia/design-system';

export type LogoWorkshopBrandTarget = BrandId | 'earnedstar';

export type LogoWorkshopTier = 'flat' | 'chrome' | 'sticker' | 'wordmark' | 'origami';

export const LOGO_WORKSHOP_STORAGE_KEY = 'expedia-design-lab-logo-workshop-v1';
export const EARNEDSTAR_LOGO_WORKSHOP_STORAGE_KEY = 'earnedstar-design-lab-logo-workshop-v1';

export type LogoReferenceSource = 'builtin' | 'pinterest-pin' | 'image-url' | 'upload';

export type LogoWorkshopReference = {
  id: string;
  source: LogoReferenceSource;
  label: string;
  /** Original paste — Pinterest pin page or image URL */
  sourceUrl: string;
  /** Image used in mood board preview (may equal sourceUrl for direct images) */
  previewUrl: string;
  notes?: string;
  savedPath?: string;
};

export type LogoWorkshopBrief = {
  version: 1;
  updatedAt: string;
  brand: LogoWorkshopBrandTarget;
  tier: LogoWorkshopTier;
  goal: string;
  mood: string;
  mustInclude: string;
  mustAvoid: string;
  notes: string;
  references: LogoWorkshopReference[];
};

export const BUILTIN_REFERENCE_SEEDS: readonly {
  id: string;
  label: string;
  previewUrl: string;
  notes: string;
}[] = [
  {
    id: 'ref-target-badge-3d',
    label: 'Target badge · machined depth',
    previewUrl: '/brand-logos/reference/ref-target-badge-3d.png',
    notes: 'Dimensional rim + compartment depth — ET/EE chrome tier inspiration.',
  },
  {
    id: 'ref-stickers',
    label: 'Sticker cutline family',
    previewUrl: '/brand-logos/reference/ref-stickers--9ec784b4-cf21-48c6-95e5-9f4703e4a57f.png',
    notes: 'Decal edge + sticker silhouette references.',
  },
  {
    id: 'ref-engines',
    label: 'Engines nameplate direction',
    previewUrl: '/brand-logos/reference/ref-engines--52ce236e-63a4-4fbb-9062-5430ec44dc9a.png',
    notes: 'Warmer gold chamber + horizontal nameplate.',
  },
  {
    id: 'ref-transmissions',
    label: 'Transmissions fender badge',
    previewUrl: '/brand-logos/reference/ref-22c3e08f-6b0e-4ed6-af24-450c97423499.png',
    notes: 'Apache-inspired fender silhouette + REMAN block.',
  },
] as const;

export const EARNEDSTAR_REFERENCE_SEEDS: readonly {
  id: string;
  label: string;
  previewUrl: string;
  notes: string;
}[] = [
  {
    id: 'es-ref-origami-system',
    label: 'Origami brand system sheet',
    previewUrl: '/brand/earnedstar-origami-logo-system.png',
    notes: 'Photoreal 3D origami star — navy leather + gold piping reference.',
  },
  {
    id: 'es-ref-navy-gold-mark',
    label: 'Navy/gold hero mark',
    previewUrl: '/brand/png/mark-3d-navy-gold.png',
    notes: 'Default variant — facet depth and center medallion.',
  },
  {
    id: 'es-ref-horizontal-lockup',
    label: 'Horizontal lockup',
    previewUrl: '/brand/png/logo-3d-horizontal-primary.png',
    notes: 'Mark + EarnedStar wordmark spacing.',
  },
] as const;

export function createEmptyBrief(): LogoWorkshopBrief {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    brand: 'transmissions',
    tier: 'chrome',
    goal: '',
    mood: '',
    mustInclude: '',
    mustAvoid: 'generic SaaS gradient blobs · neon glow · cartoon chrome',
    notes: '',
    references: BUILTIN_REFERENCE_SEEDS.map((seed) => ({
      id: seed.id,
      source: 'builtin',
      label: seed.label,
      sourceUrl: seed.previewUrl,
      previewUrl: seed.previewUrl,
      notes: seed.notes,
    })),
  };
}

export function createEarnedStarBrief(): LogoWorkshopBrief {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    brand: 'earnedstar',
    tier: 'origami',
    goal: 'Refine origami lucky-star SVG fallback for small-size embeds',
    mood: 'puffy paper-fold · gold piping · navy leather · trust seal',
    mustInclude: 'crease facets · center medallion · navy/gold default variant',
    mustAvoid: 'flat circle stars · violet gradients · legacy circle mark',
    notes: 'Spec: docs/branding/earnedstar-logo-spec.md',
    references: EARNEDSTAR_REFERENCE_SEEDS.map((seed) => ({
      id: seed.id,
      source: 'builtin',
      label: seed.label,
      sourceUrl: seed.previewUrl,
      previewUrl: seed.previewUrl,
      notes: seed.notes,
    })),
  };
}

export function createReferenceId(): string {
  return `ref-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Normalize Pinterest pin URLs vs direct image URLs (i.pinimg.com, etc.). */
export function parseReferenceInput(raw: string, label = 'Pinterest reference'): LogoWorkshopReference | null {
  const input = raw.trim();
  if (!input) return null;

  const id = createReferenceId();

  if (/i\.pinimg\.com/i.test(input) || /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(input)) {
    return {
      id,
      source: 'image-url',
      label,
      sourceUrl: input,
      previewUrl: input,
    };
  }

  if (/pinterest\.com\/pin\//i.test(input) || /pinterest\.com\/.*\/pin\//i.test(input)) {
    return {
      id,
      source: 'pinterest-pin',
      label,
      sourceUrl: input,
      previewUrl: '',
      notes: 'Paste “Copy image address” from the pin if preview does not load.',
    };
  }

  if (input.startsWith('http://') || input.startsWith('https://')) {
    return {
      id,
      source: 'image-url',
      label,
      sourceUrl: input,
      previewUrl: input,
    };
  }

  return null;
}

export function buildCursorLogoPrompt(brief: LogoWorkshopBrief): string {
  const refs = brief.references
    .map((ref, index) => {
      const preview = ref.previewUrl || ref.sourceUrl;
      return `${index + 1}. ${ref.label} — ${preview}${ref.notes ? ` (${ref.notes})` : ''}`;
    })
    .join('\n');

  return [
    'Logo workshop brief — code-native refinement',
    '',
    `Brand: ${brief.brand}`,
    `Tier: ${brief.tier}`,
    `Goal: ${brief.goal || '(not set)'}`,
    `Mood: ${brief.mood || '(not set)'}`,
    `Must include: ${brief.mustInclude || '(not set)'}`,
    `Must avoid: ${brief.mustAvoid || '(not set)'}`,
    brief.notes ? `Notes: ${brief.notes}` : '',
    '',
    'Reference mood board:',
    refs || '(no references)',
    '',
    'Workflow:',
    '1. Study references for silhouette, depth, and material — do not copy trademarked art.',
    '2. Update SVG masters in brand/logos/svg/ and preview in /design-lab/logo-workshop.',
    '3. Keep vector-first layers; chrome = SVG + badge-metal CSS only.',
    '4. Spec: docs/branding/EXPEDIAPARTS_LOGO_DESIGN_SYSTEM.md',
  ]
    .filter(Boolean)
    .join('\n');
}

export function briefSlug(brief: LogoWorkshopBrief): string {
  const brand = brief.brand.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const stamp = brief.updatedAt.slice(0, 10);
  return `${brand}-${brief.tier}-${stamp}`;
}

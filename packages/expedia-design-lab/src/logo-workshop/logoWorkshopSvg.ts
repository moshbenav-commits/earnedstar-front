/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import type { LogoWorkshopBrandTarget, LogoWorkshopBrief, LogoWorkshopTier } from './logoWorkshop';
import { briefSlug } from './logoWorkshop';

export type ChromeLayerSpec = {
  id: string;
  level: number;
  label: string;
  required: boolean;
  note: string;
};

/** Canonical chrome stack — EXPEDIAPARTS_LOGO_DESIGN_SYSTEM §7 */
export const CHROME_LAYER_CANON: readonly ChromeLayerSpec[] = [
  { id: 'L6/Shadow', level: 6, label: 'Shadow', required: true, note: 'Whole-badge drop shadow group' },
  { id: 'L5/Outer-Rim', level: 5, label: 'Outer rim', required: true, note: 'Chrome shell · 4-stop linear gradient' },
  { id: 'L4/Rim-Highlight', level: 4, label: 'Rim highlight', required: true, note: 'Top-edge specular strip' },
  { id: 'L4/Face-Gloss', level: 4, label: 'Face gloss', required: false, note: 'Optional enamel gloss overlay' },
  { id: 'L3/Face', level: 3, label: 'Face', required: true, note: 'Main navy enamel field' },
  { id: 'L2/Accent-Block', level: 2, label: 'Accent block', required: true, note: 'REMAN panel or gold chamber' },
  { id: 'L1/Typography', level: 1, label: 'Typography', required: true, note: 'EXPEDIA + descriptor paths' },
  { id: 'L0/Navy-Ribbing', level: 0, label: 'Navy ribbing', required: false, note: 'Inner detail lines on face' },
  { id: 'L0/Reman-Ribbing', level: 0, label: 'Reman ribbing', required: false, note: 'Inner detail on accent block' },
] as const;

export type LayerAuditSpec = {
  id: string;
  label: string;
  required: boolean;
  note: string;
};

/** EarnedStar origami source markers (TSX / SVG — not chrome L6 stack). */
export const ORIGAMI_SOURCE_CANON: readonly (LayerAuditSpec & { pattern: RegExp })[] = [
  {
    id: 'ES/Variant-Tokens',
    label: 'Variant tokens',
    required: true,
    note: 'navy · gold · white VARS map',
    pattern: /LuckyStarVariant|navy:\s*\{|gold:\s*\{|white:\s*\{/,
  },
  {
    id: 'ES/Facet-Creases',
    label: 'Facet creases',
    required: true,
    note: 'Gold crease strokes on star facets',
    pattern: /crease0|crease1|facetDark/,
  },
  {
    id: 'ES/Center-Medallion',
    label: 'Center medallion',
    required: true,
    note: 'White fill + gold ring · check / logo / stars modes',
    pattern: /badge|ringA|ringB|centerStyle/,
  },
  {
    id: 'ES/Radial-Body',
    label: 'Radial body gradient',
    required: true,
    note: '3-stop radial gradient on star body',
    pattern: /radialGradient|diffColor|specK/,
  },
  {
    id: 'ES/Wordmark-Split',
    label: 'Wordmark split',
    required: false,
    note: 'Earned navy + Star gold in lockup components',
    pattern: /EarnedStarLogo|#0F2044|#F59E0B/,
  },
] as const;

export type SvgTarget = {
  workspacePath: string;
  publicPath: string;
  specSection: string;
};

const SVG_TARGETS: Record<
  LogoWorkshopBrandTarget,
  Partial<Record<LogoWorkshopTier, SvgTarget>>
> = {
  transmissions: {
    chrome: {
      workspacePath: 'brand/logos/svg/expedia-transmissions-emblem-chrome.svg',
      publicPath: '/brand-logos/svg/expedia-transmissions-emblem-chrome.svg',
      specSection: 'AI_EXPEDIA_TRANSMISSIONS_BRAND_SPEC.md · EXPEDIAPARTS_LOGO_DESIGN_SYSTEM §7',
    },
    flat: {
      workspacePath: 'brand/logos/svg/expedia-transmissions-emblem-flat.svg',
      publicPath: '/brand-logos/svg/expedia-transmissions-emblem-flat.svg',
      specSection: 'EXPEDIAPARTS_LOGO_DESIGN_SYSTEM §6 T1',
    },
    sticker: {
      workspacePath: 'brand/logos/svg/expedia-transmissions-sticker.svg',
      publicPath: '/brand-logos/svg/expedia-transmissions-sticker.svg',
      specSection: 'EXPEDIAPARTS_LOGO_DESIGN_SYSTEM §8',
    },
    wordmark: {
      workspacePath: 'brand/logos/svg/expedia-transmissions-wordmark.svg',
      publicPath: '/brand-logos/svg/expedia-transmissions-wordmark.svg',
      specSection: 'EXPEDIAPARTS_LOGO_DESIGN_SYSTEM §5',
    },
  },
  engines: {
    chrome: {
      workspacePath: 'brand/logos/svg/expedia-engines-emblem-chrome.svg',
      publicPath: '/brand-logos/svg/expedia-engines-emblem-chrome.svg',
      specSection: 'EXPEDIAPARTS_LOGO_DESIGN_SYSTEM §7 (EE parity in progress)',
    },
    flat: {
      workspacePath: 'brand/logos/svg/expedia-engines-emblem-flat.svg',
      publicPath: '/brand-logos/svg/expedia-engines-emblem-flat.svg',
      specSection: 'EXPEDIAPARTS_LOGO_DESIGN_SYSTEM §6 T1',
    },
    sticker: {
      workspacePath: 'brand/logos/svg/expedia-engines-sticker.svg',
      publicPath: '/brand-logos/svg/expedia-engines-sticker.svg',
      specSection: 'EXPEDIAPARTS_LOGO_DESIGN_SYSTEM §8',
    },
  },
  parts: {
    flat: {
      workspacePath: 'brand/logos/svg/expedia-ep-monogram.svg',
      publicPath: '/brand-logos/svg/expedia-ep-monogram.svg',
      specSection: 'EXPEDIAPARTS_LOGO_DESIGN_SYSTEM §4',
    },
  },
  earnedstar: {
    origami: {
      workspacePath: 'earnedstar/src/components/brand/earnedstar-lucky-star.tsx',
      publicPath: '',
      specSection: 'docs/branding/earnedstar-logo-spec.md · earnedstar-svg-refinement-handoff.md',
    },
    flat: {
      workspacePath: 'earnedstar/src/components/brand/earnedstar-mark.tsx',
      publicPath: '',
      specSection: 'docs/branding/earnedstar-logo-spec.md',
    },
  },
};

export function resolveSvgTarget(
  brand: LogoWorkshopBrandTarget,
  tier: LogoWorkshopTier,
): SvgTarget | null {
  return SVG_TARGETS[brand]?.[tier] ?? null;
}

export type ParsedSvgLayer = {
  id: string;
  level: number;
  label: string;
};

export type SvgLayerAudit = {
  target: SvgTarget | null;
  rootGroup: string | null;
  layers: ParsedSvgLayer[];
  gradientCount: number;
  filterCount: number;
  pathCount: number;
  presentCanon: LayerAuditSpec[];
  missingRequired: LayerAuditSpec[];
  missingOptional: LayerAuditSpec[];
  unexpectedLayers: ParsedSvgLayer[];
  parityScore: number;
  usesCanonNaming: boolean;
};

const LAYER_ID_RE = /id="(L\d+\/[^"]+)"/g;
const ROOT_GROUP_RE = /id="(Logo\/[^"]+)"/;

export function parseSvgLayerIds(svgText: string): ParsedSvgLayer[] {
  const seen = new Set<string>();
  const layers: ParsedSvgLayer[] = [];

  for (const match of svgText.matchAll(LAYER_ID_RE)) {
    const id = match[1];
    if (seen.has(id)) continue;
    seen.add(id);
    const level = Number.parseInt(id.split('/')[0].replace('L', ''), 10);
    layers.push({
      id,
      level: Number.isFinite(level) ? level : -1,
      label: id.split('/').slice(1).join('/') || id,
    });
  }

  return layers.sort((a, b) => b.level - a.level);
}

export function auditBrandSource(
  sourceText: string,
  brand: LogoWorkshopBrandTarget,
  tier: LogoWorkshopTier,
  target: SvgTarget | null,
): SvgLayerAudit {
  const canon = ORIGAMI_SOURCE_CANON;
  const presentCanon: LayerAuditSpec[] = canon.filter((spec) => spec.pattern.test(sourceText)).map(
    ({ id, label, required, note }) => ({ id, label, required, note }),
  );
  const missingRequired: LayerAuditSpec[] = canon
    .filter((spec) => spec.required && !spec.pattern.test(sourceText))
    .map(({ id, label, required, note }) => ({ id, label, required, note }));
  const missingOptional: LayerAuditSpec[] = canon
    .filter((spec) => !spec.required && !spec.pattern.test(sourceText))
    .map(({ id, label, required, note }) => ({ id, label, required, note }));
  const layers: ParsedSvgLayer[] = presentCanon.map((spec) => ({
    id: spec.id,
    level: 0,
    label: spec.label,
  }));
  const requiredTotal = canon.filter((s) => s.required).length || 1;
  const parityScore = Math.round(
    (presentCanon.filter((s) => s.required).length / requiredTotal) * 100,
  );

  return {
    target,
    rootGroup: brand === 'earnedstar' ? 'Logo/EarnedStar/Origami' : null,
    layers,
    gradientCount: (sourceText.match(/radialGradient|linearGradient/g) ?? []).length,
    filterCount: (sourceText.match(/<filter|feDropShadow|feGaussianBlur/g) ?? []).length,
    pathCount: (sourceText.match(/<path|getStarPath/g) ?? []).length,
    presentCanon,
    missingRequired,
    missingOptional,
    unexpectedLayers: [],
    parityScore,
    usesCanonNaming: presentCanon.length > 0,
  };
}

export function auditSvgLayers(
  svgText: string,
  tier: LogoWorkshopTier,
  target: SvgTarget | null,
): SvgLayerAudit {
  const layers = parseSvgLayerIds(svgText);
  const rootMatch = svgText.match(ROOT_GROUP_RE);
  const gradientCount = (svgText.match(/<linearGradient/g) ?? []).length;
  const filterCount = (svgText.match(/<filter/g) ?? []).length;
  const pathCount = (svgText.match(/<path/g) ?? []).length;

  const layerIds = new Set(layers.map((l) => l.id));
  const canon: readonly LayerAuditSpec[] = tier === 'chrome' ? CHROME_LAYER_CANON : [];

  const presentCanon = canon.filter((spec) => layerIds.has(spec.id));
  const missingRequired = canon.filter((spec) => spec.required && !layerIds.has(spec.id));
  const missingOptional = canon.filter((spec) => !spec.required && !layerIds.has(spec.id));
  const unexpectedLayers = layers.filter(
    (layer) => !canon.some((spec) => spec.id === layer.id),
  );

  const requiredTotal = canon.filter((s) => s.required).length || 1;
  const parityScore =
    tier === 'chrome'
      ? Math.round((presentCanon.filter((s) => s.required).length / requiredTotal) * 100)
      : layers.length > 0
        ? 100
        : 0;

  return {
    target,
    rootGroup: rootMatch?.[1] ?? null,
    layers,
    gradientCount,
    filterCount,
    pathCount,
    presentCanon: [...presentCanon],
    missingRequired: [...missingRequired],
    missingOptional: [...missingOptional],
    unexpectedLayers: [...unexpectedLayers],
    parityScore,
    usesCanonNaming: layers.length > 0,
  };
}

export function auditWorkshopSource(
  sourceText: string,
  brand: LogoWorkshopBrandTarget,
  tier: LogoWorkshopTier,
  target: SvgTarget | null,
): SvgLayerAudit {
  if (brand === 'earnedstar' && (tier === 'origami' || tier === 'flat')) {
    return auditBrandSource(sourceText, brand, tier, target);
  }
  return auditSvgLayers(sourceText, tier, target);
}

export function buildAiIterationPrompt(
  brief: LogoWorkshopBrief,
  audit: SvgLayerAudit,
  options?: { savedBriefPath?: string; iterationPath?: string },
): string {
  const target = audit.target ?? resolveSvgTarget(brief.brand, brief.tier);
  const refs = brief.references
    .map((ref, i) => {
      const url = ref.previewUrl || ref.sourceUrl;
      return `${i + 1}. ${ref.label} — ${url}${ref.savedPath ? ` (saved: ${ref.savedPath})` : ''}`;
    })
    .join('\n');

  const layerLines =
    audit.layers.length > 0
      ? audit.layers.map((l) => `- ${l.id}`).join('\n')
      : '- (no L6–L0 layer groups detected — rename groups to canon IDs)';

  const missingRequired =
    audit.missingRequired.length > 0
      ? audit.missingRequired.map((s) => `- ${s.id} — ${s.note}`).join('\n')
      : '- none';

  const missingOptional =
    audit.missingOptional.length > 0
      ? audit.missingOptional.map((s) => `- ${s.id} — ${s.note}`).join('\n')
      : '- none';

  const slug = briefSlug(brief);

  return [
    '# Logo workshop — AI SVG iteration',
    '',
    'Load specs: docs/branding/EXPEDIAPARTS_LOGO_DESIGN_SYSTEM.md · ai-code-native-design-workflow',
    '',
    '## Brief',
    `Brand: ${brief.brand}`,
    `Tier: ${brief.tier}`,
    `Goal: ${brief.goal || '(set in workshop)'}`,
    `Mood: ${brief.mood || '(set in workshop)'}`,
    `Must include: ${brief.mustInclude || '(not set)'}`,
    `Must avoid: ${brief.mustAvoid || '(not set)'}`,
    brief.notes ? `Notes: ${brief.notes}` : '',
    options?.savedBriefPath ? `Saved brief: ${options.savedBriefPath}` : '',
    options?.iterationPath ? `Iteration file: ${options.iterationPath}` : '',
    '',
    '## Edit target (SSOT)',
    target
      ? `- Primary: \`${target.workspacePath}\``
      : '- No SVG target mapped — update workshop brand/tier',
    target?.publicPath ? `- Preview: ${target.publicPath} · /design-lab/logo-workshop` : '',
    target ? `- Spec: ${target.specSection}` : '',
    '',
    '## Current SVG audit',
    `Root group: ${audit.rootGroup ?? '(missing Logo/{Brand}/Premium)'}`,
    `Layer parity: ${audit.parityScore}% · gradients ${audit.gradientCount} · filters ${audit.filterCount} · paths ${audit.pathCount}`,
    '',
    '### Present layers',
    layerLines,
    '',
    '### Missing required (vs chrome canon)',
    missingRequired,
    '',
    '### Missing optional',
    missingOptional,
    '',
    '## Reference mood board (inspiration only — do not ship unlicensed art)',
    refs || '(no references)',
    '',
    '## Iteration tasks',
    '1. Refine vector geometry to match brief goal/mood — keep SVG-first, no raster logos.',
    '2. Preserve or introduce canon layer group IDs: L6/Shadow → L5/Outer-Rim → L4/* → L3/Face → L2/Accent-Block → L1/Typography → L0/*.',
    '3. Do not collapse chrome into a single fill+stroke; minimum 4 visible layers for premium tier.',
    '4. After edits: `npm run sync:brand-logos` (expedia-parts-front) and refresh /design-lab/logo-workshop.',
    '5. Re-run layer audit in workshop; target parity ≥ 85% on required layers.',
    '',
    '## Acceptance',
    '- Vector paths editable in Figma import',
    '- WCAG-minded contrast on REMAN block and typography',
    '- No ExpediaParts orange inside subsidiary badge lockups',
    `- Workshop slug: ${slug}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildFigmaHandoffPrompt(
  brief: LogoWorkshopBrief,
  audit: SvgLayerAudit,
): string {
  const target = audit.target ?? resolveSvgTarget(brief.brand, brief.tier);
  const slug = briefSlug(brief);

  return [
    '# Figma handoff — logo workshop iteration',
    '',
    'Figma Design Library fileKey: `cdkfJQlWK6zDxW6TpGREr2` · page `01 — ASSETS`',
    '',
    `Workshop slug: ${slug}`,
    `Brand: ${brief.brand} · Tier: ${brief.tier}`,
    `Layer parity today: ${audit.parityScore}%`,
    '',
    '## Import / sync',
    target
      ? `1. Import latest \`${target.workspacePath}\` into Figma (SVG paste or MCP import).`
      : '1. Select correct SVG from brand/logos/svg/.',
    '2. Map groups to canon IDs: L6/Shadow, L5/Outer-Rim, L4/Rim-Highlight, L3/Face, L2/Accent-Block, L1/Typography, L0/*.',
    '3. Apply brief mood without changing production web CSS sheen classes.',
    '',
    '## Brief summary',
    `Goal: ${brief.goal || '(not set)'}`,
    `Mood: ${brief.mood || '(not set)'}`,
    `Must include: ${brief.mustInclude || '(not set)'}`,
    `Must avoid: ${brief.mustAvoid || '(not set)'}`,
    '',
    '## Export back to repo',
    '- Re-export SVG to brand/logos/svg/ (same filename)',
    '- Run `npm run sync:brand-logos` in expedia-parts-front',
    '- Re-audit at /design-lab/logo-workshop',
    '',
    'Spec: docs/branding/EXPEDIAPARTS_LOGO_DESIGN_SYSTEM.md §7',
  ].join('\n');
}

export function iterationArtifactPaths(brief: LogoWorkshopBrief): {
  slug: string;
  workshopMd: string;
  cursorTxt: string;
  figmaTxt: string;
} {
  const slug = briefSlug(brief);
  return {
    slug,
    workshopMd: `brand/logos/workshop/iterations/${slug}.md`,
    cursorTxt: `docs/prompts/cursor/logo-workshop-${slug}.txt`,
    figmaTxt: `docs/prompts/cursor/logo-workshop-${slug}-figma.txt`,
  };
}

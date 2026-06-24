/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
export {
  BUILTIN_REFERENCE_SEEDS,
  EARNEDSTAR_REFERENCE_SEEDS,
  LOGO_WORKSHOP_STORAGE_KEY,
  EARNEDSTAR_LOGO_WORKSHOP_STORAGE_KEY,
  buildCursorLogoPrompt,
  briefSlug,
  createEmptyBrief,
  createEarnedStarBrief,
  createReferenceId,
  parseReferenceInput,
  type LogoReferenceSource,
  type LogoWorkshopBrandTarget,
  type LogoWorkshopBrief,
  type LogoWorkshopReference,
  type LogoWorkshopTier,
} from './logoWorkshop';
export {
  CHROME_LAYER_CANON,
  ORIGAMI_SOURCE_CANON,
  auditBrandSource,
  auditWorkshopSource,
  auditSvgLayers,
  buildAiIterationPrompt,
  buildFigmaHandoffPrompt,
  iterationArtifactPaths,
  parseSvgLayerIds,
  resolveSvgTarget,
  type ChromeLayerSpec,
  type ParsedSvgLayer,
  type SvgLayerAudit,
  type SvgTarget,
} from './logoWorkshopSvg';
export { resolvePinterestImageUrl, type PinterestResolveResult } from './logoWorkshopPinterest';
export { LogoWorkshopPanel, type LogoWorkshopPanelProps } from './LogoWorkshopPanel';
export { LogoWorkshopAiPanel, type LogoWorkshopAiPanelProps } from './LogoWorkshopAiPanel';

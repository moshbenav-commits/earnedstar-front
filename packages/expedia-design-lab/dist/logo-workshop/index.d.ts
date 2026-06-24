import { BrandId } from '@expedia/design-system';
import * as react from 'react';
import { ReactNode } from 'react';

type LogoWorkshopBrandTarget = BrandId | 'earnedstar';
type LogoWorkshopTier = 'flat' | 'chrome' | 'sticker' | 'wordmark' | 'origami';
declare const LOGO_WORKSHOP_STORAGE_KEY = "expedia-design-lab-logo-workshop-v1";
declare const EARNEDSTAR_LOGO_WORKSHOP_STORAGE_KEY = "earnedstar-design-lab-logo-workshop-v1";
type LogoReferenceSource = 'builtin' | 'pinterest-pin' | 'image-url' | 'upload';
type LogoWorkshopReference = {
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
type LogoWorkshopBrief = {
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
declare const BUILTIN_REFERENCE_SEEDS: readonly {
    id: string;
    label: string;
    previewUrl: string;
    notes: string;
}[];
declare const EARNEDSTAR_REFERENCE_SEEDS: readonly {
    id: string;
    label: string;
    previewUrl: string;
    notes: string;
}[];
declare function createEmptyBrief(): LogoWorkshopBrief;
declare function createEarnedStarBrief(): LogoWorkshopBrief;
declare function createReferenceId(): string;
/** Normalize Pinterest pin URLs vs direct image URLs (i.pinimg.com, etc.). */
declare function parseReferenceInput(raw: string, label?: string): LogoWorkshopReference | null;
declare function buildCursorLogoPrompt(brief: LogoWorkshopBrief): string;
declare function briefSlug(brief: LogoWorkshopBrief): string;

type ChromeLayerSpec = {
    id: string;
    level: number;
    label: string;
    required: boolean;
    note: string;
};
/** Canonical chrome stack — EXPEDIAPARTS_LOGO_DESIGN_SYSTEM §7 */
declare const CHROME_LAYER_CANON: readonly ChromeLayerSpec[];
type LayerAuditSpec = {
    id: string;
    label: string;
    required: boolean;
    note: string;
};
/** EarnedStar origami source markers (TSX / SVG — not chrome L6 stack). */
declare const ORIGAMI_SOURCE_CANON: readonly (LayerAuditSpec & {
    pattern: RegExp;
})[];
type SvgTarget = {
    workspacePath: string;
    publicPath: string;
    specSection: string;
};
declare function resolveSvgTarget(brand: LogoWorkshopBrandTarget, tier: LogoWorkshopTier): SvgTarget | null;
type ParsedSvgLayer = {
    id: string;
    level: number;
    label: string;
};
type SvgLayerAudit = {
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
declare function parseSvgLayerIds(svgText: string): ParsedSvgLayer[];
declare function auditBrandSource(sourceText: string, brand: LogoWorkshopBrandTarget, tier: LogoWorkshopTier, target: SvgTarget | null): SvgLayerAudit;
declare function auditSvgLayers(svgText: string, tier: LogoWorkshopTier, target: SvgTarget | null): SvgLayerAudit;
declare function auditWorkshopSource(sourceText: string, brand: LogoWorkshopBrandTarget, tier: LogoWorkshopTier, target: SvgTarget | null): SvgLayerAudit;
declare function buildAiIterationPrompt(brief: LogoWorkshopBrief, audit: SvgLayerAudit, options?: {
    savedBriefPath?: string;
    iterationPath?: string;
}): string;
declare function buildFigmaHandoffPrompt(brief: LogoWorkshopBrief, audit: SvgLayerAudit): string;
declare function iterationArtifactPaths(brief: LogoWorkshopBrief): {
    slug: string;
    workshopMd: string;
    cursorTxt: string;
    figmaTxt: string;
};

/** Dev-only Pinterest pin → direct image URL resolver (og:image / i.pinimg.com). */
type PinterestResolveResult = {
    ok: boolean;
    previewUrl: string | null;
    source: 'og:image' | 'pinimg-scrape' | null;
    error?: string;
};
declare function resolvePinterestImageUrl(pinUrl: string): Promise<PinterestResolveResult>;

type LogoWorkshopPanelProps = {
    apiBase?: string;
    storageKey?: string;
    createInitialBrief?: () => LogoWorkshopBrief;
    renderPreview?: (brand: LogoWorkshopBrandTarget, tier: LogoWorkshopTier) => ReactNode;
    brandOptions?: {
        id: LogoWorkshopBrandTarget;
        label: string;
    }[];
    tierOptions?: {
        id: LogoWorkshopTier;
        label: string;
    }[];
    auditTitle?: string;
    auditDescription?: string;
    siblingWorkshops?: {
        label: string;
        href: string;
        note?: string;
    }[];
};
declare function LogoWorkshopPanel({ apiBase, storageKey, createInitialBrief, renderPreview, brandOptions, tierOptions, auditTitle, auditDescription, siblingWorkshops, }: LogoWorkshopPanelProps): react.JSX.Element;

type LogoWorkshopAiPanelProps = {
    apiBase?: string;
    brief: LogoWorkshopBrief;
    onBriefLoaded: (brief: LogoWorkshopBrief) => void;
    onStatus: (message: string) => void;
    auditTitle?: string;
    auditDescription?: string;
};

declare function LogoWorkshopAiPanel({ apiBase, brief, onBriefLoaded, onStatus, auditTitle, auditDescription, }: LogoWorkshopAiPanelProps): react.JSX.Element;

export { BUILTIN_REFERENCE_SEEDS, CHROME_LAYER_CANON, type ChromeLayerSpec, EARNEDSTAR_LOGO_WORKSHOP_STORAGE_KEY, EARNEDSTAR_REFERENCE_SEEDS, LOGO_WORKSHOP_STORAGE_KEY, type LogoReferenceSource, LogoWorkshopAiPanel, type LogoWorkshopAiPanelProps, type LogoWorkshopBrandTarget, type LogoWorkshopBrief, LogoWorkshopPanel, type LogoWorkshopPanelProps, type LogoWorkshopReference, type LogoWorkshopTier, ORIGAMI_SOURCE_CANON, type ParsedSvgLayer, type PinterestResolveResult, type SvgLayerAudit, type SvgTarget, auditBrandSource, auditSvgLayers, auditWorkshopSource, briefSlug, buildAiIterationPrompt, buildCursorLogoPrompt, buildFigmaHandoffPrompt, createEarnedStarBrief, createEmptyBrief, createReferenceId, iterationArtifactPaths, parseReferenceInput, parseSvgLayerIds, resolvePinterestImageUrl, resolveSvgTarget };

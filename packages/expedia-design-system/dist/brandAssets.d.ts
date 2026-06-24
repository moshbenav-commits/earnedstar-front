type BrandId = 'parts' | 'transmissions' | 'engines';
type BrandLogoVariant = 'flat' | 'premium' | 'photoreal' | 'sticker' | 'horizontal' | 'icon' | 'wordmark' | 'onecolor';
type BrandSheen = 'none' | 'hover' | 'auto';
declare const BRAND_LOGO_BASE = "/brand-logos";
/** Maps brand + variant → public SVG path (symlinked from workspace brand/logos). */
declare const brandLogoPaths: Record<BrandId, Partial<Record<BrandLogoVariant, string>>>;
declare function resolveBrandLogoPath(brand: BrandId, variant: BrandLogoVariant): string | undefined;
declare const brandDisplayNames: Record<BrandId, string>;

export { BRAND_LOGO_BASE, type BrandId, type BrandLogoVariant, type BrandSheen, brandDisplayNames, brandLogoPaths, resolveBrandLogoPath };

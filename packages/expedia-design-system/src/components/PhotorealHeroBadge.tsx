/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import clsx from 'clsx';
import type { BrandId } from '../brandAssets';
import { brandDisplayNames, resolveBrandLogoPath } from '../brandAssets';

export type PhotorealHeroBadgeProps = {
  brand: Exclude<BrandId, 'parts'>;
  className?: string;
  width?: number;
  height?: number;
  /** LCP hero lockup — default true */
  priority?: boolean;
};

const photorealDimensions: Record<
  Exclude<BrandId, 'parts'>,
  { width: number; height: number }
> = {
  transmissions: { width: 1041, height: 196 },
  engines: { width: 600, height: 277 },
};

/**
 * T3 photoreal hero emblem — pre-rendered PNG with baked chrome lighting.
 * No CSS sheen (would fight baked speculars). Use on subsidiary homepage heroes only.
 */
export function PhotorealHeroBadge({
  brand,
  className,
  width,
  height,
  priority = true,
}: PhotorealHeroBadgeProps) {
  const src = resolveBrandLogoPath(brand, 'photoreal');
  const dims = photorealDimensions[brand];

  if (!src) {
    return (
      <span className={clsx('text-sm text-text-muted', className)} role='img'>
        Photoreal {brandDisplayNames[brand]} unavailable
      </span>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element -- T3 photoreal raster hero */
    <img
      src={src}
      alt={`${brandDisplayNames[brand]} premium chrome emblem`}
      width={width ?? dims.width}
      height={height ?? dims.height}
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : 'async'}
      className={clsx('photoreal-hero-emblem h-auto max-w-full', className)}
    />
  );
}

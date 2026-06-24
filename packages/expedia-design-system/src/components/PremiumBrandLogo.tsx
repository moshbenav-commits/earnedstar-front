/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import clsx from 'clsx';
import type { BrandId, BrandSheen } from '../brandAssets';
import { brandDisplayNames, resolveBrandLogoPath } from '../brandAssets';

export type PremiumBrandLogoProps = {
  brand: Exclude<BrandId, 'parts'>;
  sheen?: BrandSheen;
  /** Chrome SVG masters include their own rim — default false avoids double .badge-metal frame */
  framed?: boolean;
  className?: string;
  width?: number;
  height?: number;
};

function sheenClass(sheen: BrandSheen): string | undefined {
  if (sheen === 'hover') return 'badge-sheen badge-sheen--hover';
  if (sheen === 'auto') return 'badge-sheen badge-sheen--auto';
  return undefined;
}

/** T2 chrome emblem — SVG + optional machined metal wrapper. */
export function PremiumBrandLogo({
  brand,
  sheen = 'hover',
  framed = false,
  className,
  width = 180,
  height = 100,
}: PremiumBrandLogoProps) {
  const src = resolveBrandLogoPath(brand, 'premium');
  const metalVariant =
    brand === 'engines' ? 'badge-metal--engines' : 'badge-metal--transmissions';

  if (!src) {
    return (
      <span className={clsx('text-sm text-text-muted', className)} role='img'>
        Premium {brandDisplayNames[brand]} unavailable
      </span>
    );
  }

  const emblem = (
    /* eslint-disable-next-line @next/next/no-img-element -- local SVG masters */
    <img
      src={src}
      alt={`${brandDisplayNames[brand]} premium chrome emblem`}
      width={width}
      height={height}
      className='badge-raised-emblem h-auto max-w-full'
    />
  );

  if (!framed) {
    return (
      <span
        className={clsx(
          'inline-flex items-center justify-center',
          sheenClass(sheen),
          className,
        )}
      >
        {emblem}
      </span>
    );
  }

  return (
    <span
      className={clsx(
        'badge-metal',
        metalVariant,
        sheenClass(sheen),
        className,
      )}
    >
      <span className='badge-metal__inner badge-bevel-inset inline-flex items-center justify-center p-3'>
        {emblem}
      </span>
    </span>
  );
}

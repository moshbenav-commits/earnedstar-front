/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import clsx from 'clsx';
import type { BrandId, BrandLogoVariant, BrandSheen } from '../brandAssets';
import { brandDisplayNames, resolveBrandLogoPath } from '../brandAssets';

export type BrandLogoProps = {
  brand: BrandId;
  variant?: BrandLogoVariant;
  sheen?: BrandSheen;
  tier?: 1 | 2 | 3;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

function sheenClass(sheen: BrandSheen): string | undefined {
  if (sheen === 'hover') return 'badge-sheen badge-sheen--hover';
  if (sheen === 'auto') return 'badge-sheen badge-sheen--auto';
  return undefined;
}

/** Flat T1 mark — production SVG from brand/logos. */
export function BrandLogo({
  brand,
  variant = 'flat',
  sheen = 'none',
  className,
  width = 160,
  height = 80,
  priority = false,
}: BrandLogoProps) {
  const src = resolveBrandLogoPath(brand, variant);
  if (!src) {
    return (
      <span className={clsx('text-sm text-text-muted', className)} role='img'>
        {brandDisplayNames[brand]} — {variant} unavailable
      </span>
    );
  }

  return (
    <span className={clsx('inline-flex items-center justify-center', sheenClass(sheen), className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- local SVG masters from brand/logos */}
      <img
        src={src}
        alt={`${brandDisplayNames[brand]} ${variant} logo`}
        width={width}
        height={height}
        className='h-auto max-w-full'
        loading={priority ? 'eager' : 'lazy'}
      />
    </span>
  );
}

/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import clsx from 'clsx';
import type { BrandId } from '../brandAssets';
import { brandDisplayNames, resolveBrandLogoPath } from '../brandAssets';

export type StickerLogoProps = {
  brand: Exclude<BrandId, 'parts'>;
  className?: string;
  width?: number;
  height?: number;
};

/** Sticker cutline variant — navy field + white type. */
export function StickerLogo({
  brand,
  className,
  width = 200,
  height = 72,
}: StickerLogoProps) {
  const src = resolveBrandLogoPath(brand, 'sticker');

  if (!src) {
    return (
      <span className={clsx('text-sm text-text-muted', className)} role='img'>
        Sticker {brandDisplayNames[brand]} unavailable
      </span>
    );
  }

  return (
    <span className={clsx('inline-flex', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- local SVG masters */}
      <img
        src={src}
        alt={`${brandDisplayNames[brand]} sticker logo`}
        width={width}
        height={height}
        className='h-auto max-w-full drop-shadow-md'
      />
    </span>
  );
}

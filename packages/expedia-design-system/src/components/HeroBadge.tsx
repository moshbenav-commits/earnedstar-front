/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import clsx from 'clsx';
import type { BrandId, BrandSheen } from '../brandAssets';
import { PremiumBrandLogo } from './PremiumBrandLogo';

export type HeroBadgeProps = {
  brand: Exclude<BrandId, 'parts'>;
  sheen?: BrandSheen;
  glass?: boolean;
  /** Radial plate behind emblem — off on photo heroes */
  plate?: boolean;
  className?: string;
  width?: number;
  height?: number;
};

const heroBadgeDimensions: Record<
  Exclude<BrandId, 'parts'>,
  { width: number; height: number }
> = {
  transmissions: { width: 560, height: 90 },
  engines: { width: 480, height: 222 },
};

/** T2 hero emblem — premium chrome SVG + optional glass/plate container. */
export function HeroBadge({
  brand,
  sheen = 'auto',
  glass = false,
  plate = true,
  className,
  width,
  height,
}: HeroBadgeProps) {
  const dims = heroBadgeDimensions[brand];

  return (
    <div
      className={clsx(
        plate && 'badge-premium-plate',
        glass && 'brand-glass-panel',
        className,
      )}
    >
      <PremiumBrandLogo
        brand={brand}
        sheen={sheen}
        framed={false}
        width={width ?? dims.width}
        height={height ?? dims.height}
      />
    </div>
  );
}

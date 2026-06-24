/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import type { IconType } from 'react-icons';
import { FiAward, FiHeadphones, FiLock, FiShield } from 'react-icons/fi';
import { colors } from '../tokens';

export type TrustBadgeKind = 'warranty' | 'secure-checkout' | 'verified' | 'support';

const TRUST_META: Record<
  TrustBadgeKind,
  { label: string; compactLabel: string; Icon: IconType; accent: string }
> = {
  warranty: {
    label: 'Warranty backed',
    compactLabel: 'Warranty',
    Icon: FiAward,
    accent: colors.mayGreen,
  },
  'secure-checkout': {
    label: 'Secure checkout',
    compactLabel: 'Secure',
    Icon: FiLock,
    accent: colors.blueberry,
  },
  verified: {
    label: 'Verified fitment',
    compactLabel: 'Verified',
    Icon: FiShield,
    accent: colors.orange,
  },
  support: {
    label: 'Expert support',
    compactLabel: 'Support',
    Icon: FiHeadphones,
    accent: colors.crayola,
  },
};

export type TrustBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  kind: TrustBadgeKind;
  surface?: 'light' | 'dark';
  selected?: boolean;
  compact?: boolean;
};

/** Generic trust chip for SWC adjacency, warranty rows, PDP trust strips — not SWC program state pills. */
export function TrustBadge({
  kind,
  surface = 'light',
  selected = false,
  compact = false,
  className,
  ...props
}: TrustBadgeProps) {
  const meta = TRUST_META[kind];
  const Icon = meta.Icon;
  const label = compact ? meta.compactLabel : meta.label;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-semibold tracking-wide',
        surface === 'dark'
          ? 'border-white/10 bg-white/5 text-gray-100'
          : 'border-gray-200 bg-white text-text',
        selected && 'ring-2 ring-primary ring-offset-1',
        className,
      )}
      {...props}
    >
      <span
        className='h-3.5 w-0.5 shrink-0 rounded-full'
        style={{ background: meta.accent }}
        aria-hidden
      />
      <Icon className='h-3.5 w-3.5 shrink-0' style={{ color: meta.accent }} aria-hidden />
      <span>{label}</span>
    </span>
  );
}

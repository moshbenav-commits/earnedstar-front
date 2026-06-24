/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

export type DsBadgeVariant = 'flat' | 'premium';
export type DsBadgeTone = 'default' | 'transmissions' | 'engines' | 'parts' | 'success' | 'muted';

export type DsBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: DsBadgeVariant;
  tone?: DsBadgeTone;
  selected?: boolean;
  children: ReactNode;
};

const toneStyles: Record<DsBadgeTone, string> = {
  default: 'bg-surface-secondary text-text',
  transmissions: 'bg-[#00306E] text-white',
  engines: 'bg-[#5c3d12] text-white',
  parts: 'bg-primary/15 text-text',
  success: 'bg-success text-white',
  muted: 'bg-gray-200 text-text-muted',
};

export function DsBadge({
  variant = 'flat',
  tone = 'default',
  selected = false,
  className,
  children,
  ...props
}: DsBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold tracking-wide',
        variant === 'premium' && 'badge-machined-tab border border-[var(--border-metal)]',
        toneStyles[tone],
        selected && 'ring-2 ring-primary ring-offset-1',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

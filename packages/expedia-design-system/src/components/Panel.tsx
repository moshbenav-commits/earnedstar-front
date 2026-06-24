/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

export type DsPanelVariant = 'light' | 'dark' | 'glass';

export type DsPanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: DsPanelVariant;
  title?: string;
  description?: string;
  children: ReactNode;
};

export function DsPanel({
  variant = 'light',
  title,
  description,
  className,
  children,
  ...props
}: DsPanelProps) {
  return (
    <section
      data-surface={variant === 'light' ? 'light' : 'dark'}
      className={clsx(
        'rounded-[var(--radius-panel)] border p-5',
        variant === 'light' && 'border-[var(--border-light)] bg-white text-text',
        variant === 'dark' &&
          'border-[var(--border-dark)] bg-[var(--brand-expedia-navy)] text-gray-200',
        variant === 'glass' && 'ds-panel-glass-dark text-gray-200',
        className,
      )}
      {...props}
    >
      {title ? (
        <header className='mb-3'>
          <h3 className='font-sans text-sm font-bold uppercase tracking-[0.12em] text-inherit'>
            {title}
          </h3>
          {description ? (
            <p className='mt-1 font-sans text-sm text-gray-400'>{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

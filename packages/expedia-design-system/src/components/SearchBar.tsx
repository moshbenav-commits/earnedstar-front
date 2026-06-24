/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
'use client';

import clsx from 'clsx';
import { type InputHTMLAttributes, useId } from 'react';

export type DsSearchBarSize = 'hero' | 'compact';

export type DsSearchBarProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> & {
  size?: DsSearchBarSize;
  label?: string;
};

export function DsSearchBar({
  size = 'compact',
  label = 'Search',
  className,
  id,
  ...props
}: DsSearchBarProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <label
      htmlFor={inputId}
      className={clsx(
        'flex w-full items-center gap-3 rounded-full border ds-motion-fast',
        size === 'hero'
          ? 'border-[var(--border-metal)] bg-white px-5 py-3.5 shadow-elevated'
          : 'border-[var(--border-light)] bg-white px-4 py-2.5 shadow-input',
        'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
        className,
      )}
    >
      <span className='sr-only'>{label}</span>
      <svg
        aria-hidden
        className={clsx('shrink-0 text-text-muted', size === 'hero' ? 'h-5 w-5' : 'h-4 w-4')}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
      >
        <circle cx='11' cy='11' r='7' />
        <path d='M20 20l-3.5-3.5' />
      </svg>
      <input
        id={inputId}
        type='search'
        placeholder={props.placeholder ?? 'Year, make, model, or part…'}
        className={clsx(
          'w-full bg-transparent font-sans text-text outline-none placeholder:text-placeholder',
          size === 'hero' ? 'text-base' : 'text-sm',
        )}
        {...props}
      />
    </label>
  );
}

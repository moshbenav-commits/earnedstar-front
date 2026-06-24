/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
'use client';

import clsx from 'clsx';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type DsButtonVariant = 'primary' | 'secondary' | 'ghost';
export type DsButtonSize = 'sm' | 'md' | 'lg';

export type DsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: DsButtonVariant;
  size?: DsButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const variantStyles: Record<DsButtonVariant, string> = {
  primary: clsx(
    'bg-primary text-text',
    'hover:opacity-90 active:opacity-80',
    'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:bg-surface-disabled disabled:text-text-muted disabled:opacity-100',
  ),
  secondary: clsx(
    'bg-secondary text-text',
    'hover:opacity-90 active:opacity-80',
    'focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2',
    'disabled:bg-surface-disabled disabled:text-text-muted',
  ),
  ghost: clsx(
    'bg-transparent text-white border border-[var(--border-dark)]',
    'hover:bg-white/5 active:bg-white/10',
    'focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-expedia-navy)]',
    'disabled:text-text-muted disabled:border-transparent',
  ),
};

const sizeStyles: Record<DsButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-base gap-2',
  lg: 'px-5 py-3 text-base gap-2.5',
};

export const DsButton = forwardRef<HTMLButtonElement, DsButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type='button'
        disabled={isDisabled}
        className={clsx(
          'inline-flex items-center justify-center rounded-full font-bold ds-motion-fast',
          'focus-visible:outline-none disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <span
              className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent'
              aria-hidden
            />
            <span>Loading…</span>
          </>
        ) : (
          <>
            {leftIcon ? <span className='shrink-0'>{leftIcon}</span> : null}
            {children}
            {rightIcon ? <span className='shrink-0'>{rightIcon}</span> : null}
          </>
        )}
      </button>
    );
  },
);

DsButton.displayName = 'DsButton';

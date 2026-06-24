/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
'use client';

import clsx from 'clsx';
import { useState, type ReactNode } from 'react';

export type DsTabItem = {
  id: string;
  label: ReactNode;
  disabled?: boolean;
};

export type DsTabsVariant = 'underline' | 'plate';

export type DsTabsProps = {
  items: DsTabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  variant?: DsTabsVariant;
  className?: string;
};

export function DsTabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = 'underline',
  className,
}: DsTabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id ?? '');
  const active = value ?? internal;

  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onValueChange?.(id);
  };

  return (
    <div
      role='tablist'
      className={clsx(
        'flex flex-wrap gap-1',
        variant === 'plate' && 'rounded-lg bg-white/5 p-1',
        className,
      )}
    >
      {items.map((item) => {
        const isSelected = item.id === active;
        return (
          <button
            key={item.id}
            type='button'
            role='tab'
            aria-selected={isSelected}
            disabled={item.disabled}
            onClick={() => select(item.id)}
            className={clsx(
              'ds-motion-fast rounded-md px-4 py-2 text-sm font-semibold',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              'disabled:cursor-not-allowed disabled:opacity-40',
              variant === 'underline' &&
                (isSelected
                  ? 'border-b-2 border-primary text-white'
                  : 'border-b-2 border-transparent text-gray-400 hover:text-gray-200'),
              variant === 'plate' &&
                (isSelected
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'),
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

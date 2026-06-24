/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { typeH2OnDark, typeBodyOnDark, typeLabelOnDark } from '@expedia/design-system';
import { EXPEDIA_PARTS_DESIGN_LAB_NAV, type DesignLabNavItem } from './nav';

export type DesignLabShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  nav?: readonly DesignLabNavItem[];
  kicker?: string;
};

export function DesignLabShell({
  title,
  description,
  children,
  nav = EXPEDIA_PARTS_DESIGN_LAB_NAV,
  kicker = 'Code-native design system',
}: DesignLabShellProps) {
  return (
    <div
      className='min-h-screen ds-surface-dark'
      data-surface='dark'
      style={{ background: 'var(--brand-expedia-black)' }}
    >
      <header className='border-b border-[var(--border-dark)] bg-[var(--brand-expedia-navy)] px-6 py-5'>
        <p className={typeLabelOnDark}>{kicker}</p>
        <h1 className={`${typeH2OnDark} mt-1 text-3xl`}>{title}</h1>
        <p className={`${typeBodyOnDark} mt-2 max-w-3xl text-gray-300`}>{description}</p>
        {nav.length > 0 ? (
          <nav className='mt-4 flex flex-wrap gap-2' aria-label='Design lab sections'>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='rounded-full border border-[var(--border-dark)] px-3 py-1.5 text-xs font-semibold text-gray-300 transition hover:border-white/20 hover:text-white'
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>
      <main className='mx-auto max-w-6xl px-6 py-8'>{children}</main>
    </div>
  );
}

export function DesignLabSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className='mb-10'>
      <h2 className={`${typeH2OnDark} mb-1 text-xl`}>{title}</h2>
      {description ? (
        <p className={`${typeBodyOnDark} mb-4 text-sm text-gray-400`}>{description}</p>
      ) : null}
      {children}
    </section>
  );
}

export function DesignLabGrid({ children }: { children: ReactNode }) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>{children}</div>
  );
}

export function DesignLabCard({
  label,
  children,
  surface = 'navy',
}: {
  label: string;
  children: ReactNode;
  surface?: 'navy' | 'light' | 'checker' | 'hero';
}) {
  const surfaceClass =
    surface === 'light'
      ? 'ds-surface-light'
      : surface === 'checker'
        ? 'ds-preview-checker'
        : surface === 'hero'
          ? 'badge-premium-plate'
          : 'ds-surface-navy';

  return (
    <article className='overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-dark)]'>
      <div className='border-b border-[var(--border-dark)] bg-white/5 px-4 py-2 text-xs font-medium text-gray-400'>
        {label}
      </div>
      <div className={`flex min-h-[140px] items-center justify-center p-6 ${surfaceClass}`}>
        {children}
      </div>
    </article>
  );
}

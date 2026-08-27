/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from 'next/link';
import type { ReactNode } from 'react';

/** Real EarnedStar jobs (reviews, seller dashboard) -- the generator's
 * first draft shipped generic commerce tabs (Shop/Cart/Account) pointing
 * at routes that don't exist on this B2B SaaS reviews site. */
const TABS = [
  { href: '/app', label: 'Home', match: (p: string) => p === '/app' || p === '/app/' },
  { href: '/dashboard/reviews', label: 'Reviews', match: (p: string) => p.startsWith('/dashboard/reviews') },
  { href: '/dashboard', label: 'Dashboard', match: (p: string) => p.startsWith('/dashboard') && !p.startsWith('/dashboard/reviews') },
] as const;

export function AppShell({
  children,
  activePath,
  title,
  backHref,
  backLabel = 'Back',
}: {
  children: ReactNode;
  activePath: string;
  title?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="min-h-screen text-gray-100" style={{ backgroundColor: "#0A1628" }} data-surface="dark">
      {(title || backHref) && (
        <header className="sticky top-0 z-10 border-b border-white/10 px-4 py-3 backdrop-blur-sm" style={{ backgroundColor: "#0A1628" + 'f2' }}>
          <div className="mx-auto flex max-w-lg items-center gap-3">
            {backHref ? (
              <Link href={backHref} className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm font-bold text-gold">
                ← {backLabel}
              </Link>
            ) : null}
            {title ? <h1 className="truncate text-lg font-semibold text-white">{title}</h1> : null}
          </div>
        </header>
      )}
      <div className="mx-auto max-w-lg px-4 pb-28 pt-4">{children}</div>
      <nav aria-label="App" className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm" style={{ backgroundColor: "#0A1628" + 'f2' }}>
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {TABS.map((tab) => {
            const active = tab.match(activePath);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-14 flex-col items-center justify-center text-xs font-bold uppercase tracking-wide ${active ? 'text-gold' : 'text-gray-400'}`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

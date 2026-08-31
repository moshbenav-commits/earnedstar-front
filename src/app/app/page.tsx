/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { AppJobLink } from '@/components/app/AppJobLink';
import { AppShell } from '@/components/app/AppShell';

export const metadata: Metadata = { title: 'App' };

/** Distilled hub — the two real EarnedStar jobs (order-verified reviews, seller dashboard).
 * Each shortcut lands on its own /app screen, which pulls real merchant data and links into
 * the full /dashboard/* routes for editing. Do not dump the marketing homepage here. */
export default function DistilledAppPage() {
  return (
    <AppShell activePath="/app">
      <header className="mb-2">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold">
          EarnedStar
        </p>
        <h1 className="text-2xl font-semibold text-white">App</h1>
      </header>
      <p className="text-sm text-gray-400">Thumb-first product surface — not the marketing site</p>
      <nav className="mt-6 grid gap-3" aria-label="Shortcuts">
        <AppJobLink
          href="/app/reviews"
          title="Reviews"
          description="Order-verified reviews for your store"
        />
        <AppJobLink
          href="/app/seller-dashboard"
          title="Seller Dashboard"
          description="Ratings, invitations, and Google Seller Rating status"
        />
      </nav>
      <div className="mt-10 border-t border-white/10 pt-6">
        <Link href="/" className="inline-flex min-h-11 items-center text-sm font-bold text-gray-500">
          Full desktop site
        </Link>
      </div>
    </AppShell>
  );
}

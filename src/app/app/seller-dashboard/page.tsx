/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/app/AppShell';
import { DashboardKpiRow } from '@/components/dashboard/dashboard-kpi-row';
import { RatingDistributionChart } from '@/components/dashboard/rating-distribution';
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state';
import { fetchDashboardOverview } from '@/lib/earnedstar-server';
import { getDashboardMerchant } from '@/lib/dashboard-merchant';

export const metadata: Metadata = { title: 'Seller Dashboard' };

/** Distilled "seller-dashboard" job. Reuses the same real DashboardKpiRow and
 * RatingDistributionChart components (and fetchDashboardOverview data) the full
 * /dashboard overview page renders — same stats, same fallback behavior, just a
 * thumb-first layout. Team, integrations, and settings stay on their existing
 * /dashboard/* routes, which this screen links into. */
export default async function DistilledSellerDashboardPage() {
  const merchant = await getDashboardMerchant();
  const overview = await fetchDashboardOverview(merchant.slug);

  const hasLiveOverview = overview != null;
  const isEmpty = hasLiveOverview && overview.stats.totalReviews === 0 && overview.recentReviews.length === 0;

  return (
    <AppShell activePath="/app/seller-dashboard" title="Seller Dashboard">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold">{merchant.name}</p>
      <h1 className="mt-1 text-2xl font-semibold text-white">Overview</h1>
      <p className="mt-2 text-sm text-gray-400">Plan: {merchant.plan}</p>

      <div className="mt-6" data-scroll-theme="light">
        {isEmpty ? (
          <DashboardEmptyState merchantName={merchant.name} />
        ) : (
          <div className="grid gap-4">
            <DashboardKpiRow stats={overview?.stats} />
            <RatingDistributionChart distribution={overview?.ratingDistribution} />
          </div>
        )}
      </div>

      <nav className="mt-8 grid gap-3" aria-label="Manage store">
        <Link
          href="/dashboard"
          className="block min-h-11 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-4"
        >
          <p className="font-bold text-white">Full dashboard</p>
          <p className="mt-1 text-sm text-gray-400">Recent reviews, widgets, and invitations in one view</p>
        </Link>
        <Link
          href="/dashboard/analytics"
          className="block min-h-11 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-4"
        >
          <p className="font-bold text-white">Analytics</p>
          <p className="mt-1 text-sm text-gray-400">Invitation trend and review velocity</p>
        </Link>
        <Link
          href="/dashboard/invitations"
          className="block min-h-11 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-4"
        >
          <p className="font-bold text-white">Invitations</p>
          <p className="mt-1 text-sm text-gray-400">Requests sent to buyers after delivery</p>
        </Link>
        <Link
          href="/dashboard/integrations"
          className="block min-h-11 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-4"
        >
          <p className="font-bold text-white">Integrations</p>
          <p className="mt-1 text-sm text-gray-400">Connect your store and sync orders</p>
        </Link>
        <Link
          href="/dashboard/settings"
          className="block min-h-11 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-4"
        >
          <p className="font-bold text-white">Settings</p>
          <p className="mt-1 text-sm text-gray-400">Team, billing, and review request rules</p>
        </Link>
      </nav>

      <div className="mt-10 border-t border-white/10 pt-6">
        <Link href="/" className="inline-flex min-h-11 items-center text-sm font-bold text-gray-500">
          Full desktop site
        </Link>
      </div>
    </AppShell>
  );
}

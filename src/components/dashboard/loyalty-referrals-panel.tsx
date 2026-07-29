/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useEffect, useState } from "react";

type LoyaltyLeaderboardRow = {
  customer_email: string;
  customer_name: string | null;
  total_points: number;
  review_points: number;
  referral_points: number;
};

type LoyaltyLedgerEntry = {
  id: string;
  customer_email: string;
  customer_name: string | null;
  points: number;
  reason: "review" | "referral";
  reference_id: string | null;
  created_at: string;
};

type LoyaltySummary = {
  total_points_awarded: number;
  total_customers: number;
  leaderboard: LoyaltyLeaderboardRow[];
  recent_entries: LoyaltyLedgerEntry[];
};

type ReferralEvent = {
  id: string;
  referrer_email: string;
  referred_email: string;
  status: "pending" | "converted" | "rewarded";
  order_id: string | null;
  created_at: string;
  converted_at: string | null;
  rewarded_at: string | null;
};

type ReferralActivity = {
  summary: { total_codes: number; total_clicks: number; pending: number; converted: number; rewarded: number };
  top_referrers: { referrer_email: string; converted_count: number; rewarded_count: number }[];
  recent_events: ReferralEvent[];
};

const STATUS_STYLES: Record<ReferralEvent["status"], string> = {
  pending: "bg-bg text-text-faint",
  converted: "bg-green-pale text-green-dark",
  rewarded: "bg-gold-pale text-gold-dark",
};

/**
 * EarnedStar Bible Phase 4h — merchant-facing points ledger/leaderboard and
 * referral activity feed. Accrual-only (no redemption UI yet, v2). Referral
 * link generation and the review-submission point award both happen
 * server-side (see earnedstar-back EarnedstarLoyaltyService /
 * EarnedstarReferralsService) — this panel is a read view over both.
 */
export function LoyaltyReferralsPanel({ planLocked }: { planLocked: boolean }) {
  const [loyalty, setLoyalty] = useState<LoyaltySummary | null>(null);
  const [referrals, setReferrals] = useState<ReferralActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (planLocked) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [loyaltyRes, referralsRes] = await Promise.all([
          fetch("/api/earnedstar/loyalty"),
          fetch("/api/earnedstar/referrals"),
        ]);
        const [loyaltyData, referralsData] = await Promise.all([loyaltyRes.json(), referralsRes.json()]);
        if (cancelled) return;
        if (!loyaltyRes.ok || !referralsRes.ok) {
          setError(
            (loyaltyData as { message?: string }).message ??
              (referralsData as { message?: string }).message ??
              "Unable to load loyalty & referral data",
          );
          return;
        }
        setLoyalty(loyaltyData as LoyaltySummary);
        setReferrals(referralsData as ReferralActivity);
      } catch {
        if (!cancelled) setError("Unable to load loyalty & referral data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [planLocked]);

  if (planLocked) {
    return (
      <section className="card-surface max-w-3xl p-6">
        <h2 className="text-lg font-bold text-navy">Loyalty &amp; Referrals</h2>
        <p className="mt-2 text-sm text-text-muted">
          Award loyalty points for reviews and referrals, and give customers a shareable referral link.
          Available on Growth and higher plans.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="card-surface max-w-3xl p-6">
        <p className="text-sm text-text-muted">Loading…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card-surface max-w-3xl p-6">
        <p className="text-sm text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-surface p-4">
          <p className="text-xs font-semibold uppercase text-text-faint">Points awarded</p>
          <p className="mt-1 text-2xl font-bold text-navy">{loyalty?.total_points_awarded ?? 0}</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs font-semibold uppercase text-text-faint">Customers earning points</p>
          <p className="mt-1 text-2xl font-bold text-navy">{loyalty?.total_customers ?? 0}</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs font-semibold uppercase text-text-faint">Referral codes issued</p>
          <p className="mt-1 text-2xl font-bold text-navy">{referrals?.summary.total_codes ?? 0}</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs font-semibold uppercase text-text-faint">Referrals converted</p>
          <p className="mt-1 text-2xl font-bold text-navy">{referrals?.summary.converted ?? 0}</p>
        </div>
      </section>

      <section className="card-surface max-w-3xl p-6">
        <h2 className="text-lg font-bold text-navy">Points leaderboard</h2>
        <p className="mt-1 text-sm text-text-muted">Top customers by lifetime loyalty points.</p>
        {!loyalty?.leaderboard.length ? (
          <p className="mt-4 text-sm text-text-muted">No points awarded yet.</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase text-text-faint">
                <th className="py-2">Customer</th>
                <th className="py-2">Review points</th>
                <th className="py-2">Referral points</th>
                <th className="py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {loyalty.leaderboard.map((row) => (
                <tr key={row.customer_email} className="border-b border-border last:border-0">
                  <td className="py-2 text-navy">{row.customer_name ?? row.customer_email}</td>
                  <td className="py-2 text-text-muted">{row.review_points}</td>
                  <td className="py-2 text-text-muted">{row.referral_points}</td>
                  <td className="py-2 font-semibold text-navy">{row.total_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card-surface max-w-3xl p-6">
        <h2 className="text-lg font-bold text-navy">Referral activity</h2>
        <p className="mt-1 text-sm text-text-muted">
          Who referred whom. A referred customer&apos;s first fulfilled order tags the referral as
          converted.
        </p>
        {!referrals?.recent_events.length ? (
          <p className="mt-4 text-sm text-text-muted">No referral activity yet.</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase text-text-faint">
                <th className="py-2">Referrer</th>
                <th className="py-2">Referred</th>
                <th className="py-2">Order</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {referrals.recent_events.map((event) => (
                <tr key={event.id} className="border-b border-border last:border-0">
                  <td className="py-2 text-navy">{event.referrer_email}</td>
                  <td className="py-2 text-text-muted">{event.referred_email}</td>
                  <td className="py-2 text-text-muted">{event.order_id ?? "—"}</td>
                  <td className="py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[event.status]}`}>
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

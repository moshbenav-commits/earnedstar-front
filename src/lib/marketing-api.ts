/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
export type TrustCounterData = {
  verified_reviews: number;
  fraud_blocked_this_month: number;
  avg_dispute_sla_hours: number;
  reviews_ransomed: number;
};

export type ReviewAuditResult = {
  url: string;
  audit: {
    estimated_fake_review_pct: number;
    risk_level: "low" | "moderate" | "high" | "critical";
    top_patterns: string[];
    recommendation: string;
  };
};

export async function fetchTrustCounter(): Promise<TrustCounterData> {
  const res = await fetch("/api/earnedstar/marketing/trust-counter");
  if (!res.ok) throw new Error("trust-counter failed");
  return res.json() as Promise<TrustCounterData>;
}

export async function runReviewAudit(url: string): Promise<ReviewAuditResult> {
  const res = await fetch("/api/earnedstar/marketing/review-audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Audit failed");
  }
  return res.json() as Promise<ReviewAuditResult>;
}

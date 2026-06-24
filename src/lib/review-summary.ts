/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import type { Merchant } from "@/types/review";

const SUMMARY_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

/** Growth+ AI summary — display only when fresh and merchant has 5+ reviews. */
export function activeReviewSummary(merchant: Merchant): string | null {
  if (merchant.review_count < 5) return null;
  const text = merchant.review_summary_ai?.trim();
  const generatedAt = merchant.review_summary_generated_at;
  if (!text || !generatedAt) return null;
  const ageMs = Date.now() - new Date(generatedAt).getTime();
  if (ageMs > SUMMARY_MAX_AGE_MS) return null;
  return text;
}

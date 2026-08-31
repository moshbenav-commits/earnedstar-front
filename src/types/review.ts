/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
export type ReviewStatus = "pending" | "published" | "flagged" | "rejected";

export interface Review {
  id: string;
  business_id: string;
  customer_name: string;
  order_id?: string;
  rating_overall: number;
  review_title?: string;
  review_text: string;
  product_name?: string;
  verified_purchase: boolean;
  fraud_score: number;
  status: ReviewStatus;
  business_response?: string;
  helpful_yes?: number;
  helpful_no?: number;
  created_at: string;
  photos?: string[];
  ymm_year?: number;
  ymm_make?: string;
  ymm_model?: string;
  ymm_trim?: string;
  rating_fitment?: number;
  rating_quality?: number;
  rating_shipping?: number;
  rating_description?: number;
  rating_install?: number;
  /** Optional vertical-specific metadata (fitment, size, etc.) */
  metadata?: Record<string, string>;
  /** "organic" (default), "imported" via review migration, or "seed" (demo content). */
  source?: "organic" | "imported" | "seed";
  /** Origin platform when source === "imported": yotpo | loox | judgeme | stamped |
   * trustpilot | google | facebook | csv (generic). Never present for organic/seed rows. */
  import_platform?: string | null;
  /** Bible Phase 4h — entry-tier auto-translation (not plan-gated). True when
   * review_text below is a translated string, not the customer's original. */
  translated?: boolean;
  /** The original (pre-translation) review text, present only when translated === true. */
  review_text_original?: string;
}

export interface Merchant {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website_url?: string;
  seo_title?: string | null;
  seo_description?: string | null;
  plan: "starter" | "growth" | "pro" | "agency";
  api_key?: string;
  review_count: number;
  avg_rating: number;
  public_profile_enabled?: boolean;
  review_summary_ai?: string | null;
  review_summary_generated_at?: string | null;
  /** Bible Phase 4i — days before re-asking the same customer for a review of the same product (default 90). */
  review_request_cooldown_days?: number;
  /** Bible Phase 4h — points awarded to a customer when their review is published (0 = disabled). */
  points_per_review?: number;
  /** Bible Phase 4h — points awarded to the referrer when a referral converts (0 = disabled). */
  points_per_referral?: number;
  /** Bible Phase 4i — B2B/wholesale review collection opt-in. Off by default. */
  b2b_mode_enabled?: boolean;
  /** Bible Phase 4i — days to wait after fulfillment before requesting a review on a B2B order (default 30). */
  b2b_default_delay_days?: number;
}

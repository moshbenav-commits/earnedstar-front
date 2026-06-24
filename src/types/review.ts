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
}

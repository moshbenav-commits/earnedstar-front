export type ReviewStatus = "pending" | "published" | "flagged" | "rejected";

export interface Review {
  id: string;
  business_id: string;
  customer_name: string;
  order_id?: string;
  rating_overall: number;
  review_text: string;
  verified_purchase: boolean;
  fraud_score: number;
  status: ReviewStatus;
  business_response?: string;
  created_at: string;
  /** Optional vertical-specific metadata (fitment, size, etc.) */
  metadata?: Record<string, string>;
}

export interface Merchant {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website_url?: string;
  plan: "starter" | "growth" | "pro" | "agency";
  review_count: number;
  avg_rating: number;
}

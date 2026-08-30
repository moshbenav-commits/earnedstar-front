/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { motion } from "framer-motion";
import { Flag, MessageSquare } from "lucide-react";
import type { Review } from "@/types/review";
import { StarRating } from "./star-rating";
import { VerifiedBadge } from "./verified-badge";
import { FraudBadge } from "./fraud-badge";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
  showResponse?: boolean;
  showActions?: boolean;
  animationDelay?: number;
  className?: string;
}

/**
 * CKV_BUILD_PLAN_EARNEDSTAR_REVIEW_IMPORT.md Slice 3 — provenance is visible:
 * every imported review shows its origin. Badge copy (VerifiedBadge) is
 * unchanged and speaks only for verified reviews; this is a separate,
 * additional label.
 */
const IMPORT_ORIGIN_LABELS: Record<string, string> = {
  google: "Google",
  trustpilot: "Trustpilot",
  facebook: "Facebook",
  yotpo: "Yotpo",
  loox: "Loox",
  judgeme: "Judge.me",
  stamped: "Stamped.io",
};

function importOriginLabel(importPlatform: string): string {
  return IMPORT_ORIGIN_LABELS[importPlatform] ?? importPlatform;
}

export function ReviewCard({
  review,
  showResponse = false,
  showActions = false,
  animationDelay = 0,
  className,
}: ReviewCardProps) {
  // Pin timeZone so server (UTC) and client (visitor-local) format identically —
  // otherwise the date can differ by a day and trip React hydration error #418.
  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.22 }}
      className={cn("card-surface p-6", className)}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {review.verified_purchase && <VerifiedBadge size="sm" />}
          <FraudBadge score={review.fraud_score} />
          <span className="font-semibold text-navy">{review.customer_name}</span>
          <StarRating rating={review.rating_overall} size="sm" />
        </div>
        <time className="text-sm text-text-faint" dateTime={review.created_at}>{date}</time>
      </div>
      <p className="text-text-muted">
        {review.review_title ? (
          <span className="mb-1 block font-semibold text-navy">{review.review_title}</span>
        ) : null}
        {review.review_text}
      </p>
      {review.translated ? (
        <p className="mt-1 text-xs italic text-text-faint" title="Bible Phase 4h: entry-tier auto-translation, available on every plan">
          Translated automatically
        </p>
      ) : null}
      {review.import_platform ? (
        <p className="mt-1 text-xs italic text-text-faint">
          {review.import_platform === "csv"
            ? "Imported review"
            : `via ${importOriginLabel(review.import_platform)}`}
        </p>
      ) : null}
      {review.product_name ? (
        <p className="mt-2 text-xs text-text-faint">Product: {review.product_name}</p>
      ) : null}
      {(review.helpful_yes != null || review.helpful_no != null) && !showActions && (
        <p className="mt-3 text-xs text-text-faint">
          Was this helpful? 👍 {review.helpful_yes ?? 0} · 👎 {review.helpful_no ?? 0}
        </p>
      )}
      {showResponse && review.business_response && (
        <div className="mt-4 rounded-lg border-l-4 border-navy-light bg-navy-pale/40 p-4">
          <p className="mb-1 text-xs font-bold text-navy">Reply from store</p>
          <p className="text-sm text-text-muted">{review.business_response}</p>
        </div>
      )}
      {showActions && (
        <div className="mt-4 flex gap-2">
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted hover:text-navy">
            <MessageSquare size={14} /> Reply
          </button>
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted hover:text-navy" aria-label="Flag review">
            <Flag size={14} />
          </button>
        </div>
      )}
    </motion.article>
  );
}

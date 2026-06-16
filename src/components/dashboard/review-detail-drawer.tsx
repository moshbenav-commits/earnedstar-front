"use client";

import { X } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { FraudBadge } from "@/components/ui/fraud-badge";
import type { Review } from "@/types/review";
import { cn } from "@/lib/utils";

interface ReviewDetailDrawerProps {
  review: Review | null;
  onClose: () => void;
}

export function ReviewDetailDrawer({ review, onClose }: ReviewDetailDrawerProps) {
  if (!review) return null;

  const date = new Date(review.created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy/30" role="dialog" aria-modal="true">
      <button type="button" className="flex-1" aria-label="Close" onClick={onClose} />
      <aside className="flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-navy">Review detail</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted hover:bg-surface-2 hover:text-navy"
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-semibold text-navy">{review.customer_name}</p>
            {review.verified_purchase ? <VerifiedBadge size="sm" /> : null}
            <FraudBadge score={review.fraud_score} />
          </div>
          <StarRating rating={review.rating_overall} className="mt-3" />
          <p className="mt-4 text-sm text-text-muted">{review.review_text}</p>
          {review.product_name ? (
            <p className="mt-4 text-xs text-text-faint">Product: {review.product_name}</p>
          ) : null}
          {review.order_id ? (
            <p className="mt-1 text-xs text-text-faint">Order: {review.order_id}</p>
          ) : null}
          <p className="mt-4 text-xs text-text-faint">{date}</p>
          <span
            className={cn(
              "mt-4 inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
              review.status === "published" && "bg-green-pale text-green-dark",
              review.status === "pending" && "bg-gold-pale text-gold-dark",
              review.status === "flagged" && "bg-red-50 text-red-700",
            )}
          >
            {review.status}
          </span>
          {review.business_response ? (
            <div className="mt-6 rounded-lg border border-border bg-surface-2 p-4 text-sm text-text-muted">
              <p className="font-semibold text-navy">Your response</p>
              <p className="mt-2">{review.business_response}</p>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

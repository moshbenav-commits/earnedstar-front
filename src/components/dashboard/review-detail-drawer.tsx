/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { FraudBadge } from "@/components/ui/fraud-badge";
import { Button } from "@/components/ui/button";
import { moderateReview, respondToReview } from "@/lib/earnedstar-client";
import type { Review } from "@/types/review";
import { cn } from "@/lib/utils";

interface ReviewDetailDrawerProps {
  review: Review | null;
  onClose: () => void;
  onUpdated?: (reviewId: string, status: Review["status"]) => void;
  onResponded?: (reviewId: string, response: string) => void;
}

export function ReviewDetailDrawer({ review, onClose, onUpdated, onResponded }: ReviewDetailDrawerProps) {
  const [acting, setActing] = useState(false);
  const [localStatus, setLocalStatus] = useState<Review["status"] | null>(null);
  const [localResponse, setLocalResponse] = useState<string | null>(null);
  const [draftResponse, setDraftResponse] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!review) return null;

  const status = localStatus ?? review.status;
  const date = new Date(review.created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  async function handleRespond() {
    if (!review || draftResponse.trim().length < 5) return;
    const reviewId = review.id;
    setActing(true);
    setError(null);
    try {
      const result = await respondToReview(reviewId, draftResponse.trim());
      setLocalResponse(result.business_response);
      onResponded?.(reviewId, result.business_response);
      setDraftResponse("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save response");
    } finally {
      setActing(false);
    }
  }

  const responseText = localResponse ?? review.business_response;

  async function handleModerate(next: "published" | "rejected") {
    if (!review) return;
    const reviewId = review.id;
    setActing(true);
    setError(null);
    try {
      await moderateReview(reviewId, next);
      setLocalStatus(next);
      onUpdated?.(reviewId, next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review");
    } finally {
      setActing(false);
    }
  }

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
              status === "published" && "bg-green-pale text-green-dark",
              status === "pending" && "bg-gold-pale text-gold-dark",
              status === "flagged" && "bg-red-50 text-red-700",
              status === "rejected" && "bg-surface-2 text-text-faint",
            )}
          >
            {status}
          </span>
          {responseText ? (
            <div className="mt-6 rounded-lg border border-border bg-surface-2 p-4 text-sm text-text-muted">
              <p className="font-semibold text-navy">Your response</p>
              <p className="mt-2">{responseText}</p>
            </div>
          ) : null}

          {status === "published" && (
            <div className="mt-6 space-y-2">
              <label className="text-sm font-semibold text-navy" htmlFor="merchant-response">
                {responseText ? "Update response" : "Reply publicly"}
              </label>
              <textarea
                id="merchant-response"
                className="min-h-24 w-full rounded-lg border border-border px-3 py-2 text-sm"
                placeholder="Thank the customer — shown on your public store profile"
                value={draftResponse}
                onChange={(e) => setDraftResponse(e.target.value)}
              />
              <Button
                size="sm"
                disabled={acting || draftResponse.trim().length < 5}
                onClick={() => void handleRespond()}
              >
                {acting ? <Loader2 size={14} className="animate-spin" /> : null}
                Save response
              </Button>
            </div>
          )}

          {(status === "pending" || status === "flagged") && (
            <div className="mt-6 flex flex-wrap gap-2">
              <Button size="sm" disabled={acting} onClick={() => handleModerate("published")}>
                {acting ? <Loader2 size={14} className="animate-spin" /> : null}
                Publish
              </Button>
              <Button size="sm" variant="ghost" disabled={acting} onClick={() => handleModerate("rejected")}>
                Reject
              </Button>
            </div>
          )}
          {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        </div>
      </aside>
    </div>
  );
}

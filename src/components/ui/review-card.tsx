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

export function ReviewCard({
  review,
  showResponse = false,
  showActions = false,
  animationDelay = 0,
  className,
}: ReviewCardProps) {
  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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
      <p className="text-text-muted">{review.review_text}</p>
      {showResponse && review.business_response && (
        <div className="mt-4 border-l-4 border-green bg-green-pale/50 p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-green-dark">Store Response</p>
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

import { StarRating } from "@/components/ui/star-rating";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import type { Review } from "@/types/review";
import { cn } from "@/lib/utils";

const statusStyles: Record<Review["status"], string> = {
  published: "bg-green-pale text-green-dark",
  pending: "bg-gold-pale text-gold-dark",
  flagged: "bg-red-50 text-red-700",
  rejected: "bg-surface-2 text-text-faint",
};

export function ReviewsTable({ reviews }: { reviews: Review[] }) {
  return (
    <section className="card-surface overflow-hidden">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-bold text-navy">Recent reviews</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2/60 text-xs uppercase tracking-wider text-text-faint">
              <th className="px-4 py-3 font-semibold">Reviewer</th>
              <th className="px-4 py-3 font-semibold">Rating</th>
              <th className="px-4 py-3 font-semibold">Review</th>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => {
              const date = new Date(review.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
              return (
                <tr key={review.id} className="border-b border-border last:border-0 hover:bg-surface-2/40">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-navy">{review.customer_name}</div>
                    {review.verified_purchase ? <VerifiedBadge size="sm" className="mt-1" /> : null}
                  </td>
                  <td className="px-4 py-3">
                    <StarRating rating={review.rating_overall} size="sm" />
                  </td>
                  <td className="max-w-xs px-4 py-3 text-text-muted">
                    <p className="line-clamp-2">{review.review_text}</p>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{review.product_name ?? "—"}</td>
                  <td className="px-4 py-3 text-text-faint">{date}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold capitalize", statusStyles[review.status])}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 text-xs font-semibold text-navy-light">
                      <button type="button" className="hover:text-gold">View</button>
                      <span className="text-border">·</span>
                      <button type="button" className="hover:text-gold">Reply</button>
                      <span className="text-border">·</span>
                      <button type="button" className="hover:text-red-600">Flag</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

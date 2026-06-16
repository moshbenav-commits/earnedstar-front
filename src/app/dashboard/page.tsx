import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { ReviewCard } from "@/components/ui/review-card";
import { dashboardStats, mockReviews } from "@/lib/mock-data";
import { Star } from "lucide-react";

export default function DashboardHomePage() {
  return (
    <>
      <DashboardTopbar title="Overview" />
      <main className="bg-bg p-8">
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Reviews", value: dashboardStats.totalReviews.toLocaleString(), sub: `+${dashboardStats.weeklyDelta} this month` },
            { label: "Avg Rating", value: dashboardStats.avgRating.toFixed(1), sub: "Last 30 days" },
            { label: "Pending Responses", value: String(dashboardStats.pendingResponses), sub: "Need your reply" },
            { label: "Fraud Blocked", value: String(dashboardStats.fraudBlocked), sub: "Auto-flagged" },
          ].map((tile) => (
            <div key={tile.label} className="card-surface p-6">
              <p className="text-3xl font-extrabold text-navy">{tile.value}</p>
              <p className="mt-1 text-sm text-text-faint">{tile.label}</p>
              <p className="mt-1 text-xs text-green-dark">{tile.sub}</p>
            </div>
          ))}
        </div>
        <h2 className="mb-4 text-lg font-bold text-navy">Recent Reviews</h2>
        <div className="space-y-3">
          {mockReviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} showActions animationDelay={i * 0.05} />
          ))}
        </div>
      </main>
    </>
  );
}

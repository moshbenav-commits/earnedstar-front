import { Star } from "lucide-react";
import { dashboardStats } from "@/lib/mock-data";

function ProgressRing({ pct }: { pct: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width="44" height="44" className="-rotate-90" aria-hidden>
      <circle cx="22" cy="22" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="4" />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="var(--gold)"
        strokeWidth="4"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DashboardKpiRow() {
  const cards = [
    {
      label: "Total Reviews",
      value: dashboardStats.totalReviews.toLocaleString(),
      sub: `+${dashboardStats.weeklyDeltaPct}% vs last 30 days`,
      subClass: "text-green-dark",
    },
    {
      label: "Average Rating",
      value: (
        <span className="inline-flex items-center gap-2">
          {dashboardStats.avgRating.toFixed(1)}
          <span className="inline-flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className="fill-gold text-gold" />
            ))}
          </span>
        </span>
      ),
      sub: "Last 30 days",
      subClass: "text-text-faint",
    },
    {
      label: "Invite Response Rate",
      value: (
        <span className="inline-flex items-center gap-3">
          {dashboardStats.inviteResponseRate}%
          <ProgressRing pct={dashboardStats.inviteResponseRate} />
        </span>
      ),
      sub: "Invitations completed",
      subClass: "text-text-faint",
    },
    {
      label: "Google Seller Rating",
      value: (
        <span className="inline-flex items-center gap-2">
          {dashboardStats.googleSellerRating}
          <Star size={16} className="fill-gold text-gold" />
        </span>
      ),
      sub: dashboardStats.googleSellerActive ? (
        <span className="rounded-full bg-green-pale px-2 py-0.5 text-xs font-semibold text-green-dark">Active</span>
      ) : null,
      subClass: "",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="card-surface gold-seam p-6">
          <p className="text-3xl font-extrabold text-navy">{card.value}</p>
          <p className="mt-1 text-sm text-text-faint">{card.label}</p>
          {card.sub ? (
            <div className={`mt-2 text-xs ${card.subClass}`}>{card.sub}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

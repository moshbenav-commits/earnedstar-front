/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const NAVY = "#0F2044";
const GOLD = "#F59E0B";
const GREEN = "#059669";

export type AnalyticsPayload = {
  invitationTrend: { week: string; sent: number; completed: number }[];
  reviewVelocity: { week: string; published: number; pending: number }[];
  sentiment: { positive: number; neutral: number; negative: number };
};

export function InvitationTrendChart({ data }: { data: AnalyticsPayload["invitationTrend"] }) {
  return (
    <section className="card-surface gold-seam p-6">
      <h2 className="text-lg font-bold text-navy">Invitation funnel</h2>
      <p className="mt-1 text-sm text-text-muted">Sent vs completed — last 8 weeks</p>
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#64748B" }} />
            <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="sent" name="Sent" fill={NAVY} radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" name="Completed" fill={GREEN} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function ReviewVelocityChart({ data }: { data: AnalyticsPayload["reviewVelocity"] }) {
  return (
    <section className="card-surface p-6">
      <h2 className="text-lg font-bold text-navy">Review velocity</h2>
      <p className="mt-1 text-sm text-text-muted">Published vs pending — last 8 weeks</p>
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#64748B" }} />
            <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="published" name="Published" stroke={GREEN} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="pending" name="Pending" stroke={GOLD} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function SentimentBreakdown({ sentiment }: { sentiment: AnalyticsPayload["sentiment"] }) {
  const rows = [
    { label: "Positive (4–5★)", pct: sentiment.positive, color: GREEN },
    { label: "Neutral (3★)", pct: sentiment.neutral, color: GOLD },
    { label: "Negative (1–2★)", pct: sentiment.negative, color: "#EF4444" },
  ];

  return (
    <section className="card-surface p-6">
      <h2 className="text-lg font-bold text-navy">Sentiment mix</h2>
      <p className="mt-1 text-sm text-text-muted">Published reviews by rating band</p>
      <div className="mt-6 space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-navy">{row.label}</span>
              <span className="text-text-muted">{row.pct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full" style={{ width: `${row.pct}%`, backgroundColor: row.color }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

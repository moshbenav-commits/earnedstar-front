"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Client = {
  id: string;
  name: string;
  slug: string;
  review_count: number;
  avg_rating: number;
};

export function AgencyClientsPanel({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState(initialClients);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/earnedstar/agency/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_name: name, website_url: website || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as { message?: string }).message ?? "Failed");
      setClients((prev) => [
        {
          id: (data as { clientId: string }).clientId,
          name,
          slug: (data as { slug: string }).slug,
          review_count: 0,
          avg_rating: 0,
        },
        ...prev,
      ]);
      setName("");
      setWebsite("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="card-surface gold-seam p-6">
        <h2 className="text-lg font-bold text-navy">Add client sub-account</h2>
        <p className="mt-1 text-sm text-text-muted">Agency plan includes up to 25 white-label client stores.</p>
        <form onSubmit={handleCreate} className="mt-6 grid gap-4 sm:grid-cols-2">
          <input
            required
            placeholder="Client business name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          />
          <input
            placeholder="Client website (optional)"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          />
          <Button type="submit" disabled={loading}>{loading ? "Adding…" : "Add client"}</Button>
        </form>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      </section>

      <section className="card-surface p-6">
        <h2 className="text-lg font-bold text-navy">Client accounts</h2>
        <div className="mt-4 divide-y divide-border">
          {clients.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div>
                <p className="font-semibold text-navy">{c.name}</p>
                <a href={`/store/${c.slug}`} className="text-xs text-navy-light hover:text-gold">
                  earnedstar.com/store/{c.slug}
                </a>
              </div>
              <p className="text-sm text-text-muted">
                {c.review_count} reviews · {c.avg_rating || "—"} avg
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

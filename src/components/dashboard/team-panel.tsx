"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type TeamMember = {
  id: string;
  email: string;
  role: string;
  status: string;
};

type TeamPayload = {
  seats: { used: number; limit: number };
  members: TeamMember[];
};

export function TeamPanel() {
  const [data, setData] = useState<TeamPayload | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "viewer">("viewer");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/earnedstar/team");
      const json = await res.json();
      if (!res.ok) {
        setError((json as { message?: string }).message ?? "Unable to load team");
        return;
      }
      setData(json as TeamPayload);
    } catch {
      setError("Unable to load team");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleInvite() {
    if (!email.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/earnedstar/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError((json as { message?: string }).message ?? "Invite failed");
        return;
      }
      setEmail("");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: string) {
    const res = await fetch(`/api/earnedstar/team/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  const atLimit = data ? data.seats.limit > 0 && data.seats.used >= data.seats.limit : false;

  return (
    <div className="space-y-6">
      <section className="card-surface max-w-2xl p-6">
        <h2 className="text-lg font-bold text-navy">Team seats</h2>
        <p className="mt-1 text-sm text-text-muted">
          Invite colleagues to help moderate reviews. Email invites send when SMTP is configured.
        </p>
        {data ? (
          <p className="mt-3 text-sm font-semibold text-navy">
            {data.seats.used} / {data.seats.limit < 0 ? "∞" : data.seats.limit} seats used (owner included)
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <input
            type="email"
            className="min-w-[200px] flex-1 rounded-lg border border-border px-3 py-2 text-sm"
            placeholder="teammate@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={atLimit}
          />
          <select
            className="rounded-lg border border-border px-3 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "viewer")}
            disabled={atLimit}
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
          <Button disabled={saving || atLimit || !email.trim()} onClick={() => void handleInvite()}>
            Invite
          </Button>
        </div>
        {atLimit ? (
          <p className="mt-2 text-xs text-amber-700">Seat limit reached — upgrade plan in Settings.</p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </section>

      <section className="card-surface max-w-2xl p-6">
        <h2 className="text-lg font-bold text-navy">Members</h2>
        {loading && <p className="mt-4 text-sm text-text-muted">Loading…</p>}
        {!loading && data?.members.length === 0 && (
          <p className="mt-4 text-sm text-text-muted">No pending invites yet.</p>
        )}
        <ul className="mt-4 space-y-3">
          {data?.members.map((m) => (
            <li key={m.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm">
              <div>
                <p className="font-semibold text-navy">{m.email}</p>
                <p className="text-xs text-text-faint capitalize">
                  {m.role} · {m.status}
                </p>
              </div>
              <button
                type="button"
                className="text-red-600 hover:underline"
                onClick={() => void handleRemove(m.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

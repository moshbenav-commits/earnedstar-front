/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PLAN_LIMITS, type PlanId } from "@/lib/plans";

export type QaItem = {
  id: string;
  question: string;
  answer: string | null;
  published: boolean;
  asked_by?: string;
  created_at?: string;
};

export function QaPanel({ planLocked, plan = "pro" }: { planLocked: boolean; plan?: PlanId }) {
  const [items, setItems] = useState<QaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [suggesting, setSuggesting] = useState(false);

  const canSuggestAnswer = PLAN_LIMITS[plan].ai_qa_suggestions;

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/earnedstar/qa");
      const data = await res.json();
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "Unable to load Q&A");
        setItems([]);
        return;
      }
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Unable to load Q&A");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!planLocked) void load();
    else setLoading(false);
  }, [planLocked]);

  async function handleCreate(publish: boolean) {
    if (!question.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/earnedstar/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          answer: answer.trim() || undefined,
          published: publish && Boolean(answer.trim()),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError((data as { message?: string }).message ?? "Save failed");
        return;
      }
      setQuestion("");
      setAnswer("");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(item: QaItem) {
    const res = await fetch(`/api/earnedstar/qa/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !item.published }),
    });
    if (res.ok) await load();
  }

  async function removeItem(id: string) {
    const res = await fetch(`/api/earnedstar/qa/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  async function handleSuggestAnswer() {
    if (!question.trim()) return;
    setSuggesting(true);
    setError(null);
    try {
      const res = await fetch("/api/earnedstar/seo/suggest-qa-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "Suggest failed");
        return;
      }
      const draft = (data as { draft?: string }).draft;
      if (draft) setAnswer(draft);
    } catch {
      setError("Suggest failed — try again.");
    } finally {
      setSuggesting(false);
    }
  }

  if (planLocked) {
    return (
      <section className="card-surface max-w-3xl p-6">
        <h2 className="text-lg font-bold text-navy">Q&amp;A SEO module</h2>
        <p className="mt-2 text-sm text-text-muted">
          Publish product Q&amp;A on your Review Profile with FAQ schema. Available on Pro and Agency plans.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="card-surface max-w-3xl p-6">
        <h2 className="text-lg font-bold text-navy">Add Q&amp;A</h2>
        <p className="mt-1 text-sm text-text-muted">
          Published answers appear on your public store profile and in FAQ structured data.
        </p>
        <div className="mt-4 space-y-3">
          <input
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            placeholder="Customer question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <textarea
            className="min-h-24 w-full rounded-lg border border-border px-3 py-2 text-sm"
            placeholder="Your answer (required to publish)"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {canSuggestAnswer ? (
              <Button
                type="button"
                variant="ghost"
                disabled={suggesting || !question.trim()}
                onClick={() => void handleSuggestAnswer()}
              >
                {suggesting ? "Drafting…" : "Suggest answer"}
              </Button>
            ) : null}
            <Button disabled={saving || !question.trim()} onClick={() => void handleCreate(false)}>
              Save draft
            </Button>
            <Button
              variant="gold"
              disabled={saving || !question.trim() || !answer.trim()}
              onClick={() => void handleCreate(true)}
            >
              Publish
            </Button>
          </div>
        </div>
      </section>

      <section className="card-surface max-w-3xl p-6">
        <h2 className="text-lg font-bold text-navy">Your Q&amp;A</h2>
        {loading && <p className="mt-4 text-sm text-text-muted">Loading…</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="mt-4 text-sm text-text-muted">No questions yet.</p>
        )}
        <ul className="mt-4 space-y-4">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-border p-4">
              <p className="font-semibold text-navy">{item.question}</p>
              {item.answer ? (
                <p className="mt-2 text-sm text-text-muted">{item.answer}</p>
              ) : (
                <p className="mt-2 text-sm italic text-text-faint">Draft — add an answer to publish</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={
                    item.published
                      ? "rounded-full bg-green-pale px-2 py-0.5 font-semibold text-green-dark"
                      : "rounded-full bg-bg px-2 py-0.5 font-semibold text-text-faint"
                  }
                >
                  {item.published ? "Published" : "Draft"}
                </span>
                {item.answer && (
                  <button
                    type="button"
                    className="text-navy-light hover:underline"
                    onClick={() => void togglePublish(item)}
                  >
                    {item.published ? "Unpublish" : "Publish"}
                  </button>
                )}
                <button
                  type="button"
                  className="text-red-600 hover:underline"
                  onClick={() => void removeItem(item.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

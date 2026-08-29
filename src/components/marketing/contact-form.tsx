/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useState } from "react";

/**
 * `NEXT_PUBLIC_CRM_API_URL` lets other environments point at a different
 * CRM host; it always falls back to the real prod API (mirrors the
 * `NEXT_PUBLIC_API_URL`-style env-fallback pattern used elsewhere in this
 * workspace).
 */
const CRM_API_URL = process.env.NEXT_PUBLIC_CRM_API_URL ?? "https://api.expediaparts.com";
const CRM_FORM_SLUG = "earnedstar-contact";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    try {
      const res = await fetch(`${CRM_API_URL}/crm/forms/${CRM_FORM_SLUG}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (!res.ok || !body?.ok) {
        throw new Error(body?.message ?? "Could not send your message.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not reach the server. Try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="vellum-card gilded-edge rounded-2xl p-8" data-surface="light">
        <p className="font-heading text-xl font-semibold text-ink">Message received</p>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">
          Thanks — we&apos;ll reply to your email soon.
        </p>
      </div>
    );
  }

  const fieldClass =
    "mt-2 min-h-11 w-full rounded-xl border border-ink/15 bg-white px-3 py-3 text-sm text-ink outline-none ring-ink/20 focus:ring-2 disabled:opacity-60";

  return (
    <form onSubmit={onSubmit} className="vellum-card gilded-edge space-y-4 rounded-2xl p-8" data-surface="light">
      <div>
        <label htmlFor="contact-name" className="smallcaps text-[10px] text-gold-dark">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          required
          disabled={status === "loading"}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="smallcaps text-[10px] text-gold-dark">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={status === "loading"}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="contact-company" className="smallcaps text-[10px] text-gold-dark">
          Store / company (optional)
        </label>
        <input id="contact-company" name="company" disabled={status === "loading"} className={fieldClass} />
      </div>
      <div>
        <label htmlFor="contact-message" className="smallcaps text-[10px] text-gold-dark">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          disabled={status === "loading"}
          className={fieldClass}
        />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-ink disabled:opacity-60 gold-foil"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

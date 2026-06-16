"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ProfileSeoFormProps {
  initial: {
    name: string;
    website_url?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
    slug: string;
  };
}

export function ProfileSeoForm({ initial }: ProfileSeoFormProps) {
  const [name, setName] = useState(initial.name);
  const [websiteUrl, setWebsiteUrl] = useState(initial.website_url ?? "");
  const [seoTitle, setSeoTitle] = useState(initial.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(initial.seo_description ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/earnedstar/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          website_url: websiteUrl.trim() || undefined,
          seo_title: seoTitle.trim() || undefined,
          seo_description: seoDescription.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "Save failed");
        return;
      }
      setMessage("Profile saved — Google may re-crawl within 24–72 hours.");
    } catch {
      setError("Save failed — try again.");
    } finally {
      setSaving(false);
    }
  }

  const previewTitle =
    seoTitle.trim() ||
    `${name} Reviews — Verified Customer Reviews | EarnedStar`;
  const previewDescription =
    seoDescription.trim() ||
    `Read verified purchase reviews for ${name}. Trust that was earned — not given.`;

  return (
    <form onSubmit={handleSave} className="card-surface gold-seam max-w-2xl space-y-6 p-6">
      <div>
        <h2 className="text-lg font-bold text-navy">Review Profile SEO</h2>
        <p className="mt-1 text-sm text-text-muted">
          Controls how Google indexes{" "}
          <a href={`/store/${initial.slug}`} className="text-navy-light hover:text-gold">
            /store/{initial.slug}
          </a>
          . Leave blank to use smart defaults from your review stats.
        </p>
      </div>

      <label className="block text-sm">
        <span className="font-semibold text-navy">Business name</span>
        <input
          className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-navy"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="block text-sm">
        <span className="font-semibold text-navy">Website URL</span>
        <input
          type="url"
          className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-navy"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://yourstore.com"
        />
      </label>

      <label className="block text-sm">
        <span className="font-semibold text-navy">SEO title</span>
        <span className="ml-2 text-xs text-text-faint">max 70 chars</span>
        <input
          className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-navy"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          maxLength={70}
          placeholder={previewTitle}
        />
      </label>

      <label className="block text-sm">
        <span className="font-semibold text-navy">Meta description</span>
        <span className="ml-2 text-xs text-text-faint">max 160 chars</span>
        <textarea
          className="mt-1.5 min-h-[88px] w-full rounded-lg border border-border bg-surface px-3 py-2 text-navy"
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
          maxLength={160}
          placeholder={previewDescription}
        />
      </label>

      <div className="rounded-lg border border-border bg-bg p-4 text-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-faint">Google preview</p>
        <p className="mt-2 text-base text-[#1a0dab]">{previewTitle}</p>
        <p className="text-sm text-green-dark">earnedstar.com › store › {initial.slug}</p>
        <p className="mt-1 text-sm text-text-muted">{previewDescription}</p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-green-dark">{message}</p> : null}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}

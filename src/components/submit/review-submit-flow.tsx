"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ClipboardList, Loader2, Package, Star, Truck, Wrench, X } from "lucide-react";
import { ProgressiveStarRating } from "@/components/ui/progressive-star-rating";
import { ReviewCard } from "@/components/ui/review-card";
import { Button } from "@/components/ui/button";
import { submitReview, uploadReviewPhoto } from "@/lib/earnedstar-client";
import type { InvitationLookup } from "@/lib/earnedstar-server";
import type { Review } from "@/types/review";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 5;

const PROMPT_CHIPS = [
  "Fits perfectly ✓",
  "Easy to install",
  "Correct part",
  "Fast shipping",
  "Great quality",
  "Would buy again",
];

const ATTRIBUTE_RATINGS = [
  { key: "fitment" as const, label: "Fitment Accuracy", hint: "Did the part fit your vehicle correctly?", icon: Wrench },
  { key: "quality" as const, label: "Part Quality", hint: "How was the build quality and materials?", icon: Star },
  { key: "shipping" as const, label: "Shipping Speed", hint: "How fast did your order arrive?", icon: Truck },
  { key: "description" as const, label: "Description Accuracy", hint: "Did it match what was shown in the listing?", icon: ClipboardList },
  { key: "install" as const, label: "Installation Ease", hint: "How difficult was the installation?", icon: Package },
];

const STEPS = ["Verify", "Rate", "Write", "Publish"];

const YEAR_OPTIONS = Array.from({ length: 37 }, (_, i) => String(2026 - i));

type Ratings = Record<(typeof ATTRIBUTE_RATINGS)[number]["key"], number>;

export function ReviewSubmitFlow({
  token,
  invitation,
  storeName = "Your Store",
  merchantSlug = "meridian-gear",
}: {
  token: string;
  invitation: InvitationLookup;
  storeName?: string;
  merchantSlug?: string;
}) {
  const [step, setStep] = useState(0);
  const [ratings, setRatings] = useState<Ratings>({
    fitment: 0,
    quality: 0,
    shipping: 0,
    description: 0,
    install: 0,
  });
  const [body, setBody] = useState("");
  const [name, setName] = useState(invitation.customer_name ?? "");
  const [email, setEmail] = useState("");
  const [ymmYear, setYmmYear] = useState("");
  const [ymmMake, setYmmMake] = useState("");
  const [ymmModel, setYmmModel] = useState("");
  const [ymmTrim, setYmmTrim] = useState("");
  const [editVehicle, setEditVehicle] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const overallRating = useMemo(() => {
    const vals = Object.values(ratings).filter((v) => v > 0);
    if (vals.length < 5) return 0;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
  }, [ratings]);

  const purchasedLabel = invitation.purchased_at
    ? new Date(invitation.purchased_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const hasVehicle = Boolean(ymmYear && ymmMake && ymmModel);

  const previewReview: Review = {
    id: "preview",
    business_id: "preview",
    customer_name: name || "Verified Buyer",
    rating_overall: overallRating || 5,
    review_text: body || "Your review will appear here.",
    product_name: invitation.product_name,
    verified_purchase: true,
    fraud_score: 5,
    status: "published",
    created_at: new Date().toISOString(),
    rating_fitment: ratings.fitment,
    rating_quality: ratings.quality,
    rating_shipping: ratings.shipping,
    rating_description: ratings.description,
    rating_install: ratings.install,
  };

  const allRated = Object.values(ratings).every((v) => v > 0);
  const canNext =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && allRated) ||
    (step === 2 && body.trim().length >= 20 && name.trim() && email.includes("@")) ||
    step === 3;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitReview({
        token,
        rating_overall: Math.round(overallRating),
        rating_fitment: ratings.fitment,
        rating_quality: ratings.quality,
        rating_shipping: ratings.shipping,
        rating_description: ratings.description,
        rating_install: ratings.install,
        ymm_year: ymmYear ? Number(ymmYear) : undefined,
        ymm_make: ymmMake || undefined,
        ymm_model: ymmModel || undefined,
        ymm_trim: ymmTrim || undefined,
        review_text: body.trim(),
        customer_name: name.trim(),
        customer_email: email.trim(),
        photos: photoUrls.length ? photoUrls : undefined,
      });
      setPublishStatus(result.status);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const remaining = MAX_PHOTOS - photoUrls.length;
      const batch = Array.from(files).slice(0, remaining);
      const urls: string[] = [];
      for (const file of batch) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 2 * 1024 * 1024) throw new Error(`${file.name} exceeds 2 MB limit`);
        urls.push(await uploadReviewPhoto({ token, file }));
      }
      setPhotoUrls((prev) => [...prev, ...urls].slice(0, MAX_PHOTOS));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload photo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleNext() {
    if (step === 3) {
      void handleSubmit();
      return;
    }
    setStep((s) => s + 1);
  }

  useEffect(() => {
    if (step !== 4) return;
    if (typeof window === "undefined") return;
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      r: 4 + Math.random() * 6,
      c: ["#F59E0B", "#0F2044", "#059669", "#2A4D8F"][Math.floor(Math.random() * 4)]!,
      vy: 2 + Math.random() * 4,
      vx: -2 + Math.random() * 4,
    }));
    let frame = 0;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      frame += 1;
      if (frame < 90) requestAnimationFrame(tick);
      else canvas.remove();
    };
    requestAnimationFrame(tick);
    return () => canvas.remove();
  }, [step]);

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      {step < 4 ? (
        <div className="mb-8 flex justify-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                  i <= step ? "bg-navy text-white" : "bg-surface-2 text-text-faint",
                )}
              >
                {i + 1}
              </div>
              <span className="hidden text-[10px] text-text-faint sm:block">{label}</span>
            </div>
          ))}
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          className="card-surface gold-seam p-8"
        >
          {step === 0 && (
            <>
              <h1 className="text-2xl font-bold text-navy">Let&apos;s verify your purchase</h1>
              <p className="mt-2 text-sm text-text-muted">
                We want to make sure every review on EarnedStar comes from a real buyer. Confirm your order below.
              </p>
              <div className="mt-6 rounded-xl border border-border bg-surface-2/60 p-5">
                <p className="font-semibold text-navy">Order #{invitation.order_id}</p>
                <p className="mt-2 text-sm text-text-muted">
                  Product: {invitation.product_name ?? "Your order"}
                </p>
                <p className="mt-1 text-sm text-text-muted">Purchased: {purchasedLabel}</p>
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold text-navy">Your vehicle</p>
                {hasVehicle && !editVehicle ? (
                  <p className="mt-2 text-sm text-text-muted">
                    {ymmYear} {ymmMake} {ymmModel}
                    {ymmTrim ? ` · ${ymmTrim}` : ""}{" "}
                    <button type="button" className="text-navy-light underline" onClick={() => setEditVehicle(true)}>
                      Edit
                    </button>
                  </p>
                ) : (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <select
                      value={ymmYear}
                      onChange={(e) => setYmmYear(e.target.value)}
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                      aria-label="Year"
                    >
                      <option value="">Year</option>
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <input
                      placeholder="Make"
                      value={ymmMake}
                      onChange={(e) => setYmmMake(e.target.value)}
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="Model"
                      value={ymmModel}
                      onChange={(e) => setYmmModel(e.target.value)}
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="Trim (optional)"
                      value={ymmTrim}
                      onChange={(e) => setYmmTrim(e.target.value)}
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                    />
                  </div>
                )}
                <p className="mt-2 text-xs text-text-faint">
                  Your vehicle helps future buyers know if this part fits their car too.
                </p>
              </div>
              <label className="mt-6 block text-sm font-medium text-navy">
                Your name
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                />
              </label>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold text-navy">Rate your experience</h1>
              <p className="mt-2 text-sm text-text-muted">Be honest — future buyers are counting on you.</p>
              <div className="mt-6 space-y-6">
                {ATTRIBUTE_RATINGS.map((attr) => (
                  <div key={attr.key}>
                    <div className="flex items-center gap-2">
                      <attr.icon size={16} className="text-navy-light" aria-hidden />
                      <p className="font-semibold text-navy">{attr.label}</p>
                    </div>
                    <p className="mt-1 text-xs text-text-muted">{attr.hint}</p>
                    <ProgressiveStarRating
                      value={ratings[attr.key]}
                      onChange={(v) => setRatings((prev) => ({ ...prev, [attr.key]: v }))}
                      size={36}
                      showLabels={false}
                      className="mt-2 justify-start"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm font-semibold text-navy">
                Your overall rating: {overallRating > 0 ? `${overallRating}/5 ★` : "—"}
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-2xl font-bold text-navy">Tell future buyers what you think</h1>
              <p className="mt-2 text-sm text-text-muted">
                Reviews with at least 50 characters get prioritized in search results.
              </p>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                maxLength={2000}
                placeholder="Share details about fit, quality, and shipping…"
                className="mt-6 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-text-faint">{body.length} / 2000 · min 20</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {PROMPT_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setBody((b) => (b ? `${b} ${chip}.` : `${chip}.`))}
                    className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-text-muted hover:border-gold/40"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div
                className="mt-6 flex min-h-[120px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-2/50 p-6 text-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  void handleFiles(e.dataTransfer.files);
                }}
              >
                <p className="text-sm text-text-muted">Add photos of your installation (optional but loved by buyers)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={(e) => void handleFiles(e.target.files)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3"
                  type="button"
                  disabled={uploading || photoUrls.length >= MAX_PHOTOS}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? "Uploading…" : "Browse photos"}
                </Button>
              </div>
              {photoUrls.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {photoUrls.map((url) => (
                    <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotoUrls((prev) => prev.filter((u) => u !== url))}
                        className="absolute right-1 top-1 rounded-full bg-navy/80 p-0.5 text-white"
                        aria-label="Remove photo"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
              <p className="mt-3 text-xs text-text-faint">(Growth plan businesses: video upload enabled)</p>
              <label className="mt-6 block text-sm font-medium text-navy">
                Email <span className="font-normal text-text-faint">(verification only)</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                />
              </label>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-2xl font-bold text-navy">Your review is ready to publish</h1>
              <p className="mt-2 text-sm text-text-muted">
                This is exactly how it will appear on {storeName}&apos;s review page.
              </p>
              <div className="mt-6">
                <ReviewCard review={previewReview} />
              </div>
              <p className="mt-6 text-xs text-text-muted">
                By publishing, you confirm this review reflects your honest experience. Reviews are subject to our
                Community Guidelines.
              </p>
              {error ? (
                <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
              ) : null}
            </>
          )}

          {step === 4 && (
            <div className="text-center">
              <CheckCircle2 size={56} className="mx-auto text-green" />
              <h1 className="mt-4 text-2xl font-bold text-navy">🎉 Thank you, {name}!</h1>
              <p className="mt-2 text-sm text-text-muted">
                Your verified review is now live on {storeName}&apos;s page.
                {ymmMake ? ` You're helping other ${ymmMake} owners make better decisions.` : ""}
              </p>
              {publishStatus === "flagged" ? (
                <p className="mt-2 text-xs text-amber-800">Our team is reviewing this submission before publishing.</p>
              ) : null}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    const url = window.location.href;
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                      "_blank",
                    );
                  }}
                >
                  Share on Facebook
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const url = window.location.href;
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, "_blank");
                  }}
                >
                  Share on X
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href={`/reviews/${merchantSlug}`}>See all reviews</Button>
                <Button variant="ghost" href="/">
                  Back home
                </Button>
              </div>
            </div>
          )}

          {step < 4 && (
            <div className="mt-8 flex justify-between">
              <Button
                variant="ghost"
                disabled={step === 0 || submitting}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </Button>
              <Button disabled={!canNext || submitting || uploading} onClick={handleNext}>
                {submitting ? (
                  <>
                    <Loader2 size={16} className="mr-1 animate-spin" /> Publishing…
                  </>
                ) : step === 0 ? (
                  "Confirm My Purchase →"
                ) : step === 1 ? (
                  "Next: Write Your Review →"
                ) : step === 2 ? (
                  "Preview My Review →"
                ) : (
                  "Publish My Review ✓"
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

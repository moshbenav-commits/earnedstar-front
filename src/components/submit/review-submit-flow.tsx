"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { ProgressiveStarRating } from "@/components/ui/progressive-star-rating";
import { EarnedStarMark } from "@/components/brand/earnedstar-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PROMPTS = [
  "Mention fit/compatibility",
  "Describe shipping speed",
  "Talk about product quality",
  "Note ease of installation",
];

const STEPS = ["Rating", "Review", "Photos", "Details", "Done"];

export function ReviewSubmitFlow({ storeName = "ExpediaParts" }: { storeName?: string }) {
  const [step, setStep] = useState(0);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const canNext =
    (step === 0 && rating > 0) ||
    (step === 1 && body.trim().length >= 20) ||
    step === 2 ||
    (step === 3 && name.trim() && email.includes("@") && confirmed);

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
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
              <h1 className="text-center text-2xl font-bold text-navy">How would you rate your experience?</h1>
              <p className="mt-2 text-center text-sm text-text-muted">Your review for {storeName}</p>
              <ProgressiveStarRating value={rating} onChange={setRating} size={60} className="mt-10" />
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold text-navy">Tell us what happened</h1>
              <input
                type="text"
                placeholder="Short title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-6 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                placeholder="Share details about your order…"
                className="mt-3 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-text-faint">{body.length} chars · min 20</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setBody((b) => (b ? `${b} ${p}.` : `${p}.`))}
                    className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-text-muted hover:border-gold/40"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-2xl font-bold text-navy">Add photos or video</h1>
              <p className="mt-2 text-sm text-text-muted">Optional — helps other shoppers decide.</p>
              <div className="mt-6 flex min-h-[160px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-2/50 p-8 text-center">
                <p className="text-sm text-text-muted">Drag and drop files here</p>
                <Button variant="ghost" size="sm" className="mt-3">
                  Browse files
                </Button>
              </div>
              <button type="button" className="mt-4 text-sm text-navy-light hover:text-gold" onClick={() => setStep(3)}>
                Skip this step →
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-2xl font-bold text-navy">Your details</h1>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-6 w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-3 w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-text-faint">Never shown publicly — used for verification only.</p>
              <label className="mt-4 flex items-start gap-2 text-sm text-text-muted">
                <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1" />
                I confirm this review is based on my genuine experience.
              </label>
              <div className="mt-4 rounded-lg border border-border bg-surface-2 px-4 py-3 text-xs text-text-faint">
                reCAPTCHA placeholder
              </div>
            </>
          )}

          {step === 4 && (
            <div className="text-center">
              <CheckCircle2 size={56} className="mx-auto text-green" />
              <h1 className="mt-4 text-2xl font-bold text-navy">Thank you — your review has been submitted.</h1>
              <p className="mt-2 text-sm text-text-muted">
                Our AI verifies all reviews within 2 hours before publishing.
              </p>
              <EarnedStarMark size={64} centerStyle="check" className="mx-auto mt-8" />
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href="/">Back to product</Button>
                <Button variant="ghost" href="/store/expediaparts">
                  See all reviews
                </Button>
              </div>
            </div>
          )}

          {step < 4 && (
            <div className="mt-8 flex justify-between">
              <Button
                variant="ghost"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </Button>
              <Button disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
                {step === 3 ? "Submit" : "Next"}
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

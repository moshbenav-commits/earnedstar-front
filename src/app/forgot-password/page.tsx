/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      if (supabase) {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
      }
    } finally {
      // Always land on the same neutral success state, whether the email
      // matched an account, the request failed, or auth isn't configured —
      // never confirm or deny that an account exists for this address.
      setLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-8">
      <div className="card-surface gold-seam w-full max-w-md p-8">
        <EarnedStarLogo size={32} />

        {submitted ? (
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-navy">Check your email</h1>
            <p className="mt-3 text-sm text-text-muted">
              If an account exists for that email, we sent a link to reset your password.
            </p>
            <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-gold">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold text-navy">Reset your password</h1>
            <p className="text-sm text-text-muted">
              Enter the email on your account and we&apos;ll send you a link to reset your password.
            </p>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-text-muted">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                placeholder="you@store.com"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send reset link"}
            </Button>
            <p className="text-center text-sm text-text-muted">
              <Link href="/login" className="font-semibold text-gold">Back to sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

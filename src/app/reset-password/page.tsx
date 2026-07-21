/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const MIN_PASSWORD_LENGTH = 8;

type Status = "verifying" | "ready" | "invalid";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("verifying");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setStatus("invalid");
      return;
    }

    // Supabase's browser client auto-exchanges the `?code=` param from the
    // recovery email link on init (PKCE flow, see @supabase/ssr) and emits
    // PASSWORD_RECOVERY once the session is established.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (event === "PASSWORD_RECOVERY") {
        setStatus("ready");
      }
    });

    // Fall back for the case where a session already exists by the time
    // this effect runs, and give up if nothing resolves in time.
    void supabase.auth.getSession().then((result: { data: { session: Session | null } }) => {
      if (result.data.session) {
        setStatus((current) => (current === "verifying" ? "ready" : current));
      }
    });

    const timeout = setTimeout(() => {
      setStatus((current) => (current === "verifying" ? "invalid" : current));
    }, 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) throw new Error("Auth unavailable");
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-8">
      <div className="card-surface gold-seam w-full max-w-md p-8">
        <EarnedStarLogo size={32} />

        {status === "verifying" ? (
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-navy">Verifying link…</h1>
            <p className="mt-3 text-sm text-text-muted">Hang tight while we confirm your reset link.</p>
          </div>
        ) : status === "invalid" ? (
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-navy">Link expired or invalid</h1>
            <p className="mt-3 text-sm text-text-muted">
              This password reset link is no longer valid. Request a new one to continue.
            </p>
            <Link href="/forgot-password" className="mt-6 inline-block text-sm font-semibold text-gold">
              Send a new link
            </Link>
          </div>
        ) : success ? (
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-navy">Password updated</h1>
            <p className="mt-3 text-sm text-text-muted">Redirecting you to sign in…</p>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold text-navy">Set a new password</h1>

            {error ? (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            ) : null}

            <div>
              <label htmlFor="new-password" className="mb-1 block text-sm text-text-muted">New password</label>
              <PasswordInput
                id="new-password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-1 block text-sm text-text-muted">Confirm password</label>
              <PasswordInput
                id="confirm-password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating…" : "Update password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

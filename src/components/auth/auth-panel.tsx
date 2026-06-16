"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { EarnedStarMark } from "@/components/brand/earnedstar-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tab = "signin" | "signup";

function passwordStrength(pw: string): { score: number; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Weak", "Okay", "Strong", "Strong"];
  return { score: Math.min(score, 3), label: labels[Math.min(score, 3)] };
}

export function AuthPanel({ defaultTab = "signin" }: { defaultTab?: Tab }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [tab, setTab] = useState<Tab>(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const strength = passwordStrength(password);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as { error?: string }).error ?? "Sign in failed");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, businessName, plan: "starter" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as { error?: string }).error ?? "Signup failed");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div
        className="hero-mesh relative flex flex-col justify-center px-8 py-12 lg:w-2/5 lg:px-12"
        data-surface="dark"
      >
        <EarnedStarLogo variant="light" size={32} showBadge={false} />
        <p className="mt-8 max-w-sm text-lg text-white/80">
          Verified reviews your customers actually earned — not manufactured.
        </p>
        <blockquote className="mt-8 border-l-2 border-gold pl-4 text-sm italic text-white/70">
          &ldquo;Setup took 22 minutes. Google stars in our ads within 4 days.&rdquo;
          <footer className="mt-2 not-italic text-white/50">— Amelia W., EuroParts Chicago</footer>
        </blockquote>
        <p className="mt-6 text-sm font-semibold text-gold">4.9 ★ · 2,847 verified reviews</p>
        <EarnedStarMark size={48} centerStyle="none" className="mt-8 opacity-90" />
      </div>

      <div className="flex flex-1 items-center justify-center bg-bg p-8">
        <div className="card-surface gold-seam w-full max-w-md p-8">
          <div className="mb-8 flex rounded-lg bg-surface-2 p-1">
            {(["signin", "signup"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 rounded-md py-2 text-sm font-semibold transition",
                  tab === t ? "bg-surface text-navy shadow-sm" : "text-text-muted",
                )}
              >
                {t === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {error ? (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          ) : null}

          {tab === "signin" ? (
            <form className="space-y-4" onSubmit={handleSignIn}>
              <h1 className="text-2xl font-bold text-navy">Welcome back</h1>
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
              <div>
                <label htmlFor="password" className="mb-1 block text-sm text-text-muted">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>
              <Link href="#" className="block text-right text-sm text-navy-light hover:text-gold">
                Forgot password?
              </Link>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSignUp}>
              <h1 className="text-2xl font-bold text-navy">Create your account</h1>
              <input
                type="text"
                required
                placeholder="Business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <div>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={cn(
                      "h-full transition-all",
                      strength.score <= 1 ? "w-1/3 bg-red-500" : strength.score === 2 ? "w-2/3 bg-gold" : "w-full bg-green",
                    )}
                  />
                </div>
                <p className="mt-1 text-xs text-text-faint">Strength: {strength.label}</p>
              </div>
              <input
                type="password"
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <label className="flex items-start gap-2 text-xs text-text-muted">
                <input type="checkbox" required className="mt-0.5" />
                I agree to the Terms &amp; Privacy Policy
              </label>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating…" : "Create Account — 14-day trial"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-text-muted">
            {tab === "signin" ? (
              <>Don&apos;t have an account? <button type="button" className="font-semibold text-gold" onClick={() => setTab("signup")}>Create one</button></>
            ) : (
              <>Already have an account? <button type="button" className="font-semibold text-gold" onClick={() => setTab("signin")}>Sign in</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

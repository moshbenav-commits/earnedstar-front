"use client";

import { useState } from "react";
import Link from "next/link";
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
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [password, setPassword] = useState("");
  const strength = passwordStrength(password);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div
        className="hero-mesh relative flex flex-col justify-center px-8 py-12 lg:w-2/5 lg:px-12"
        data-surface="dark"
      >
        <EarnedStarLogo variant="light" size={32} />
        <p className="mt-8 max-w-sm text-lg text-white/80">
          Verified reviews your customers actually earned — not manufactured.
        </p>
        <blockquote className="mt-8 border-l-2 border-gold pl-4 text-sm italic text-white/70">
          &ldquo;Setup took 22 minutes. Google stars in our ads within 4 days.&rdquo;
          <footer className="mt-2 not-italic text-white/50">— Amelia W., EuroParts Chicago</footer>
        </blockquote>
        <p className="mt-6 text-sm font-semibold text-gold">4.9 ★ · 2,847 verified reviews</p>
        <EarnedStarMark size={48} centerStyle="check" darkBg className="mt-8 opacity-80" />
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

          {tab === "signin" ? (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <h1 className="text-2xl font-bold text-navy">Welcome back</h1>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm text-text-muted">Email</label>
                <input id="email" type="email" className="w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="you@store.com" />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm text-text-muted">Password</label>
                <input id="password" type="password" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
              </div>
              <Link href="#" className="block text-right text-sm text-navy-light hover:text-gold">
                Forgot password?
              </Link>
              <Button className="w-full" href="/dashboard">Sign In</Button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm font-semibold text-navy hover:bg-surface-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22 12h-4.8v-.1H12v4.8h6.2c-.6 2.9-3.1 5-6.2 5-3.6 0-6.5-2.9-6.5-6.5S8.4 9 12 9c1.5 0 2.9.5 4 1.5l3.6-3.6C16.9 4.9 14.6 4 12 4 7.6 4 4 7.6 4 12s3.6 8 8 8 8-3.6 8-8z" />
                </svg>
                Continue with Google
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <h1 className="text-2xl font-bold text-navy">Create your account</h1>
              <input type="text" placeholder="Name" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
              <input type="email" placeholder="Email" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
              <div>
                <input
                  type="password"
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
              <input type="password" placeholder="Confirm password" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
              <label className="flex items-start gap-2 text-xs text-text-muted">
                <input type="checkbox" className="mt-0.5" />
                I agree to the Terms &amp; Privacy Policy
              </label>
              <Button className="w-full" href="/dashboard">Create Account</Button>
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

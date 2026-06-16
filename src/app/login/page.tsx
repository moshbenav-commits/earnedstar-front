import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen" data-surface="dark">
      <div className="relative hidden w-2/5 flex-col justify-center bg-bg-base p-12 lg:flex">
        <div className="absolute inset-0 overflow-hidden opacity-30" aria-hidden>
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="relative">
          <div className="mb-8 flex items-center gap-2">
            <Star className="fill-star text-star" size={28} />
            <span className="text-2xl font-bold text-text-primary">EarnedStar</span>
          </div>
          <p className="text-xl text-text-secondary">
            The only review platform that knows if the part fit the car.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-text-secondary">
            {[
              "Verified by purchase — not just by account",
              "AI fraud scoring on every submission",
              "Google stars in 72 hours, guaranteed",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-success">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="card-surface w-full max-w-md p-8">
          <h1 className="text-2xl font-semibold text-text-primary">Welcome back</h1>
          <p className="mt-2 text-sm text-text-secondary">Sign in to your EarnedStar dashboard.</p>

          <form className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-text-secondary">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                placeholder="you@store.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-text-secondary">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              />
            </div>
            <div className="text-right">
              <Link href="#" className="text-sm text-accent hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button className="w-full" href="/dashboard">
              Sign In →
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent hover:underline">
              Start free trial →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

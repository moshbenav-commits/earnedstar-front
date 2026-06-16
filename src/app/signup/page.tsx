import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_LIMITS, type PlanId } from "@/lib/plans";

const planOptions: PlanId[] = ["starter", "growth", "pro", "agency"];

export default function SignupPage() {
  return (
    <div className="flex min-h-screen" data-surface="dark">
      <div className="relative hidden w-2/5 flex-col justify-center bg-bg-base p-12 lg:flex">
        <div className="flex items-center gap-2">
          <Star className="fill-star text-star" size={28} />
          <span className="text-2xl font-bold text-text-primary">EarnedStar</span>
        </div>
        <p className="mt-8 text-lg text-text-secondary">
          Join 1,200+ auto parts stores collecting verified, fitment-tagged reviews.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="card-surface w-full max-w-lg p-8">
          <h1 className="text-2xl font-semibold text-text-primary">Start your free 14-day trial</h1>
          <p className="mt-2 text-sm text-text-secondary">
            No credit card required. Full access. Cancel anytime.
          </p>

          <form className="mt-8 space-y-4">
            <div>
              <label htmlFor="business" className="mb-1 block text-sm text-text-secondary">
                Business Name
              </label>
              <input
                id="business"
                type="text"
                className="w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                placeholder="Your Auto Parts Store"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-text-secondary">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
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

            <fieldset>
              <legend className="mb-2 text-sm text-text-secondary">Choose a plan</legend>
              <div className="grid grid-cols-2 gap-2">
                {planOptions.map((plan) => (
                  <label
                    key={plan}
                    className="flex cursor-pointer flex-col rounded-md border border-border bg-bg-elevated p-3 has-[:checked]:border-accent"
                  >
                    <input type="radio" name="plan" value={plan} className="sr-only" defaultChecked={plan === "growth"} />
                    <span className="text-sm font-medium capitalize text-text-primary">{plan}</span>
                    <span className="text-xs text-text-muted">${PLAN_LIMITS[plan].price}/mo</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Button className="w-full" href="/dashboard">
              Create My Free Account →
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-text-muted">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="mt-4 text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

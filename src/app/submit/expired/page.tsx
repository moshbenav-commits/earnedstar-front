import Link from "next/link";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { Button } from "@/components/ui/button";

export default function SubmitExpiredPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface px-4 py-4">
        <EarnedStarLogo size={28} />
      </header>
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy">This review link has expired</h1>
        <p className="mt-3 text-sm text-text-muted">
          Review links expire after 30 days. Contact the store directly if you&apos;d still like to leave a review.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">Go Home</Button>
          <Button variant="ghost" href="/support">
            Contact support
          </Button>
        </div>
      </main>
    </div>
  );
}

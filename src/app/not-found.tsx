/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from "next/link";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { Button } from "@/components/ui/button";
import { SparklesBackground } from "@/components/ui/sparkles-background";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-4 text-center">
      <SparklesBackground />
      <p className="relative text-8xl font-extrabold tracking-tight text-navy/10 sm:text-9xl">404</p>
      <div className="relative -mt-16 sm:-mt-20">
        <EarnedStarLogo size={32} />
        <h1 className="mt-8 text-3xl font-bold text-navy">Oops — page not found</h1>
        <p className="mt-3 max-w-md text-sm text-text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/dashboard">Go to Dashboard</Button>
          <Button variant="ghost" href="/">
            Go Home
          </Button>
        </div>
        <Link href="/support" className="mt-6 inline-block text-sm text-navy-light hover:text-gold">
          Contact support →
        </Link>
      </div>
    </div>
  );
}

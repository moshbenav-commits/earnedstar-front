/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
      <EarnedStarLogo size={32} />
      <h1 className="mt-8 text-3xl font-bold text-navy">Something went wrong</h1>
      <p className="mt-3 max-w-md text-sm text-text-muted">
        We hit an unexpected error loading this page. Your reviews and dashboard data are safe.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="ghost" href="/dashboard">
          Dashboard
        </Button>
      </div>
      <Link href="/" className="mt-6 text-sm text-navy-light hover:text-gold">
        Back to home →
      </Link>
    </div>
  );
}

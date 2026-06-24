/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <AuthPanel defaultTab="signup" />
    </Suspense>
  );
}

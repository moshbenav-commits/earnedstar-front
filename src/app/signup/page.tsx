import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <AuthPanel defaultTab="signup" />
    </Suspense>
  );
}

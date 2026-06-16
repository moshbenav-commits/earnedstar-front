import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <AuthPanel defaultTab="signin" />
    </Suspense>
  );
}

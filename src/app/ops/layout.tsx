/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { OpsSidebar } from "@/components/ops/ops-sidebar";

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d1217]" data-surface="dark">
      <OpsSidebar />
      <main className="md:ml-60 p-6 text-[#F5EBE0]">{children}</main>
    </div>
  );
}

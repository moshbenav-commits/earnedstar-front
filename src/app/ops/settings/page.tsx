/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";

export default async function OpsSettingsPage() {
  const { data } = await gtOpsFetch("/me");
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#E8A54B]">Settings</h1>
        <p className="mt-1 text-sm text-[#F5EBE0]/70">Organization and module access.</p>
      </header>
      <pre className="overflow-auto rounded-xl border border-[#2a1f16] bg-[#1A120C] p-4 text-xs text-[#F5EBE0]/80">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

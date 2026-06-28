/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
type MePayload = {
  integrations?: {
    shopify?: { status: string; message?: string };
  };
  demoCatalog?: boolean;
};

export function OpsShopifyDeferredBanner({ me }: { me: MePayload | null | undefined }) {
  const deferred = me?.integrations?.shopify?.status === 'deferred' || me?.demoCatalog;
  if (!deferred) return null;

  return (
    <div
      className="rounded-xl border border-[#E8A54B]/30 bg-[#E8A54B]/10 p-4 text-sm text-[#F5EBE0]/90"
      role="status"
    >
      <p className="font-semibold text-[#E8A54B]">Demo catalog mode — Shopify not connected</p>
      <p className="mt-1 text-[#F5EBE0]/75">
        {me?.integrations?.shopify?.message ??
          'Ops runs on a built-in demo store until you connect Shopify through the Go Tianguis app.'}
      </p>
      <p className="mt-2 text-xs text-[#F5EBE0]/55">
        Use <strong className="font-medium text-[#F5EBE0]/70">Load demo catalog</strong> then{" "}
        <strong className="font-medium text-[#F5EBE0]/70">Run scan</strong> — no Partners OAuth required.
      </p>
    </div>
  );
}

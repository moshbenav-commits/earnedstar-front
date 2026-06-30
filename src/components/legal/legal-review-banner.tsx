import { LEGAL_CONFIG } from "@/lib/legal/config";

/** Draft legal copy — remove banner when counselReviewPending is false */
export function LegalReviewBanner() {
  if (!LEGAL_CONFIG.counselReviewPending) return null;

  return (
    <div
      role="status"
      className="border-b border-gold/30 bg-gold-pale px-4 py-3 text-center text-sm text-navy"
      data-legal-review="pending"
    >
      <strong className="font-semibold">Draft for legal review.</strong>{" "}
      This page is a Site Forge compliance stub pending counsel SME review. Contact{" "}
      <a href={`mailto:${LEGAL_CONFIG.contactEmail}`} className="underline underline-offset-2">
        {LEGAL_CONFIG.contactEmail}
      </a>{" "}
      with questions.
    </div>
  );
}

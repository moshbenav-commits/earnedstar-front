import { redirect } from "next/navigation";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { ReviewSubmitFlow } from "@/components/submit/review-submit-flow";
import { fetchInvitationByToken } from "@/lib/earnedstar-server";
import Link from "next/link";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function SubmitReviewPage({ params }: PageProps) {
  const { token } = await params;
  const invitation = await fetchInvitationByToken(token);

  if (!invitation) {
    return (
      <div className="min-h-screen bg-bg">
        <header className="border-b border-border bg-surface px-4 py-4">
          <EarnedStarLogo size={28} />
        </header>
        <main className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-navy">This invitation link is invalid</h1>
          <p className="mt-3 text-sm text-text-muted">
            Review links are single-use and tied to a confirmed purchase. Contact the store if you need a new link.
          </p>
          <Link href="/" className="mt-8 inline-block text-sm font-semibold text-navy-light hover:text-gold">
            Go to EarnedStar →
          </Link>
        </main>
      </div>
    );
  }

  if (invitation.status === "expired" || invitation.status === "completed") {
    redirect("/submit/expired");
  }

  if (invitation.status !== "sent" && invitation.status !== "opened") {
    redirect("/submit/expired");
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface px-4 py-4">
        <EarnedStarLogo size={28} />
      </header>
      <ReviewSubmitFlow
        token={token}
        storeName={invitation.merchant_name}
        merchantSlug={invitation.merchant_slug}
      />
    </div>
  );
}

import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { ReviewSubmitFlow } from "@/components/submit/review-submit-flow";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function SubmitReviewPage({ params }: PageProps) {
  const { token } = await params;
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface px-4 py-4">
        <EarnedStarLogo size={28} />
      </header>
      <ReviewSubmitFlow storeName={token === "demo" ? "ExpediaParts" : "Your Store"} />
    </div>
  );
}

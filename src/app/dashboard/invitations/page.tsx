import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { ReviewRequestCampaigns } from "@/components/dashboard/review-request-campaigns";
import { fetchInvitations } from "@/lib/earnedstar-server";
import { getDashboardMerchant } from "@/lib/dashboard-merchant";

export default async function DashboardInvitationsPage() {
  const merchant = await getDashboardMerchant();
  const invitations = await fetchInvitations(merchant.slug, 100);

  return (
    <>
      <DashboardTopbar title="Review requests" />
      <main className="bg-bg p-4 md:p-8">
        <ReviewRequestCampaigns
          merchantSlug={merchant.slug}
          merchantName={merchant.name}
          invitations={invitations}
        />
      </main>
    </>
  );
}

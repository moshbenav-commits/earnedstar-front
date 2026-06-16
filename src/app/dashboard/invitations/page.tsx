import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { InvitationsList } from "@/components/dashboard/invitations-list";
import { SendInvitationForm } from "@/components/dashboard/send-invitation-form";
import { fetchInvitations } from "@/lib/earnedstar-server";
import { getDashboardMerchant } from "@/lib/dashboard-merchant";

export default async function DashboardInvitationsPage() {
  const merchant = await getDashboardMerchant();
  const invitations = await fetchInvitations(merchant.slug, 50);

  return (
    <>
      <DashboardTopbar title="Invitations" />
      <main className="space-y-8 bg-bg p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <SendInvitationForm merchantSlug={merchant.slug} />
          <InvitationsList invitations={invitations} showAll />
        </div>
      </main>
    </>
  );
}

import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { TeamPanel } from "@/components/dashboard/team-panel";

export default function DashboardTeamPage() {
  return (
    <>
      <DashboardTopbar title="Team" />
      <main className="bg-bg p-4 md:p-8">
        <TeamPanel />
      </main>
    </>
  );
}

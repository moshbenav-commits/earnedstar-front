import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base" data-surface="dark">
      <DashboardSidebar />
      <div className="ml-60">{children}</div>
    </div>
  );
}

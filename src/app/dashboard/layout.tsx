import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <DashboardSidebar />
      <div className="md:ml-60">{children}</div>
    </div>
  );
}

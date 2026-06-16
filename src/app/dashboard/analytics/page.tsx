import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  return (
    <>
      <DashboardTopbar title="Analytics" />
      <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-8">
        <div className="glow-growth card-surface max-w-md p-8 text-center">
          <h2 className="text-xl font-semibold text-text-primary">Analytics are a Growth feature</h2>
          <p className="mt-4 text-sm text-text-secondary">
            See exactly which products have review gaps, which reviews drive the most conversions,
            and how your sentiment score trends over time.
          </p>
          <Button className="mt-6" href="/signup?plan=growth">
            Upgrade to Growth — $99/mo
          </Button>
        </div>
      </main>
    </>
  );
}

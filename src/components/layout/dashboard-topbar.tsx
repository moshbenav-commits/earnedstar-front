import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardTopbarProps {
  title: string;
}

export function DashboardTopbar({ title }: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/90 px-8 backdrop-blur">
      <h1 className="text-xl font-bold text-navy">{title}</h1>
      <div className="flex items-center gap-3">
        <select
          className="hidden rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-muted sm:block"
          defaultValue="30"
          aria-label="Date range"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
        <Button size="sm"><Plus size={16} className="mr-1" />Send Invitations</Button>
        <button type="button" className="relative rounded-lg p-2 text-text-muted hover:text-navy" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-gold" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">EP</div>
      </div>
    </header>
  );
}

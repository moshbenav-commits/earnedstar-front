"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Star, Send, BarChart2, Layout, Settings, LogOut, Lock, Plug, Share2, Building2, HelpCircle, Users } from "lucide-react";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { PlanBadge } from "@/components/ui/plan-badge";
import type { PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/invitations", label: "Invitations", icon: Send },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2, lockStarter: true },
  { href: "/dashboard/widgets", label: "Widgets", icon: Layout },
  { href: "/dashboard/qa", label: "Q&A SEO", icon: HelpCircle, lockStarter: true, lockGrowth: true },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/integrations", label: "Integrations", icon: Plug },
  { href: "/dashboard/syndication", label: "Syndication", icon: Share2, lockStarter: true, lockGrowth: true },
  { href: "/dashboard/agency", label: "Agency", icon: Building2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function planFromMerchant(data: Record<string, unknown> | null): PlanId {
  const plan = (data?.plan as string | undefined)?.toLowerCase();
  if (plan === "starter" || plan === "growth" || plan === "pro" || plan === "agency") {
    return plan;
  }
  return "growth";
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [plan, setPlan] = useState<PlanId>("growth");
  const [merchantName, setMerchantName] = useState("Your Store");

  useEffect(() => {
    fetch("/api/earnedstar/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.name) setMerchantName(data.name as string);
        if (data) setPlan(planFromMerchant(data as Record<string, unknown>));
      })
      .catch(() => undefined);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center border-b border-border px-4">
        <EarnedStarLogo size={32} centerStyle="none" shell="none" />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const locked =
            (item.lockStarter && plan === "starter") ||
            (item.lockGrowth && (plan === "starter" || plan === "growth"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                active ? "bg-navy-pale font-semibold text-navy" : "text-text-muted hover:bg-bg hover:text-navy",
              )}
            >
              <item.icon size={18} aria-hidden />
              <span className="flex-1">{item.label}</span>
              {locked && <Lock size={14} className="text-text-faint" />}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <PlanBadge plan={plan} />
        <p className="mt-3 text-sm font-semibold text-navy">{merchantName}</p>
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="mt-3 flex items-center gap-2 text-sm text-red-600 hover:underline"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </aside>
  );
}

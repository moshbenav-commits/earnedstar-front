/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Store,
  ScanSearch,
  ListTodo,
  Search,
  Clock,
  Settings,
  LogOut,
  ArrowLeft,
  ScrollText,
  BookOpen,
  ClipboardCheck,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/ops/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ops/stores", label: "Stores", icon: Store },
  { href: "/ops/scanner", label: "Scanner", icon: ScanSearch },
  { href: "/ops/tasks", label: "Action Console", icon: ListTodo },
  { href: "/ops/review", label: "Review queue", icon: ClipboardCheck },
  { href: "/ops/playbooks", label: "Playbooks", icon: BookOpen },
  { href: "/ops/seo", label: "SEO Ops", icon: Search },
  { href: "/ops/jobs", label: "Jobs", icon: Clock },
  { href: "/ops/audit-logs", label: "Audit logs", icon: ScrollText },
  { href: "/ops/settings", label: "Settings", icon: Settings },
];

function OpsNavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
              active
                ? "bg-[#C45C26]/25 font-semibold text-[#E8A54B]"
                : "text-[#F5EBE0]/75 hover:bg-[#2a1f16] hover:text-[#F5EBE0]",
            )}
          >
            <item.icon size={18} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function OpsSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-[#2a1f16] bg-[#1A120C] px-4 md:hidden">
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="ops-mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg p-2 text-[#F5EBE0] hover:bg-[#2a1f16]"
        >
          {mobileOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
        </button>
        <p className="text-sm font-semibold text-[#E8A54B]">Go Tianguis Ops</p>
        <Link href="/dashboard" className="text-xs font-semibold text-[#E8A54B]">
          Reviews
        </Link>
      </header>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        id="ops-mobile-nav"
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-[#2a1f16] bg-[#1A120C] text-[#F5EBE0] transition-transform md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
        data-surface="dark"
      >
        <div className="border-b border-[#2a1f16] px-4 py-4 max-md:pt-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#E8A54B]">Go Tianguis</p>
          <p className="mt-1 text-sm font-semibold text-[#F5EBE0]">Store ops</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <OpsNavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        </nav>
        <div className="space-y-2 border-t border-[#2a1f16] p-4 text-sm">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#E8A54B] hover:underline">
            <ArrowLeft size={16} /> EarnedStar reviews
          </Link>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex items-center gap-2 text-red-400 hover:underline"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}

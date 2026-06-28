/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/ops/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ops/stores", label: "Stores", icon: Store },
  { href: "/ops/scanner", label: "Scanner", icon: ScanSearch },
  { href: "/ops/tasks", label: "Action Console", icon: ListTodo },
  { href: "/ops/seo", label: "SEO Ops", icon: Search },
  { href: "/ops/jobs", label: "Jobs", icon: Clock },
  { href: "/ops/settings", label: "Settings", icon: Settings },
];

export function OpsSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-[#2a1f16] bg-[#1A120C] text-[#F5EBE0]"
      data-surface="dark"
    >
      <div className="border-b border-[#2a1f16] px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#E8A54B]">Go Tianguis</p>
        <p className="mt-1 text-sm font-semibold text-[#F5EBE0]">Store ops</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
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
  );
}

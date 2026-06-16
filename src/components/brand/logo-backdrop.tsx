import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type LogoShell = "none" | "auto" | "light" | "dark" | "hero" | "glow";

interface LogoBackdropProps {
  shell?: LogoShell;
  /** Dark nav/footer vs light dashboard */
  onDark?: boolean;
  size?: number;
  className?: string;
  children: ReactNode;
}

function resolveShell(shell: LogoShell, onDark: boolean): Exclude<LogoShell, "auto" | "none"> | "none" {
  if (shell === "none") return "none";
  if (shell === "auto") return onDark ? "dark" : "light";
  return shell;
}

/**
 * Warm stone / cream platter so photoreal 3D marks read on navy heroes and transparent nav.
 */
export function LogoBackdrop({ shell = "auto", onDark = false, size = 32, className, children }: LogoBackdropProps) {
  const resolved = resolveShell(shell, onDark);
  if (resolved === "none") {
    return <span className={cn("inline-flex items-center", className)}>{children}</span>;
  }

  const pad = Math.max(6, Math.round(size * 0.14));

  return (
    <span
      className={cn(
        "logo-shell inline-flex items-center justify-center",
        resolved === "light" && "logo-shell-light",
        resolved === "dark" && "logo-shell-dark",
        resolved === "hero" && "logo-shell-hero",
        resolved === "glow" && "logo-shell-glow",
        className,
      )}
      style={{ padding: pad, gap: Math.round(size * 0.1) }}
    >
      {children}
    </span>
  );
}

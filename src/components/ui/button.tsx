/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  href?: string;
}

const variants = {
  primary: "bg-navy text-white hover:bg-navy-mid border-transparent",
  ghost: "bg-transparent text-text-muted border-border hover:border-border-strong hover:text-navy",
  gold: "bg-gold text-white hover:bg-gold-dark border-transparent shadow-[var(--shadow-gold)]",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({ variant = "primary", size = "md", href, className, children, ...props }: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-lg border font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy",
    variants[variant],
    sizes[size],
    className,
  );
  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <button type="button" className={classes} {...props}>{children}</button>;
}

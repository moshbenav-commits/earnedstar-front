/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonOwnProps = {
  variant?: "primary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
};

/**
 * Discriminated on `href`: with it this renders an anchor, without it a button.
 * Typing it as one shape and spreading onto the other is genuinely unsound —
 * event handlers are element-typed, so an onClick written against a button
 * would receive an anchor. The union lets each branch forward its own props
 * safely, which the link branch previously did not do at all.
 */
type ButtonProps =
  | (ButtonOwnProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (ButtonOwnProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string });

const variants = {
  primary: "bg-navy text-white hover:bg-navy-mid border-transparent",
  ghost: "bg-transparent text-text-muted border-border hover:border-border-strong hover:text-navy",
  gold: "bg-gold text-ink hover:bg-gold-light border-transparent shadow-[var(--shadow-gold)]",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button(allProps: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = allProps;
  const classes = cn(
    "inline-flex items-center justify-center rounded-lg border font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy",
    variants[variant],
    sizes[size],
    className,
  );
  // Both branches now forward their remaining props. The link branch used to drop
  // them entirely, so anything set at the call site — id, aria-*, and analytics
  // attributes like data-cx-click — silently vanished on every `href` Button,
  // with no error and nothing to notice until the events never arrived.
  if (allProps.href !== undefined) {
    const { variant: _v, size: _s, className: _c, children: _ch, href, ...rest } = allProps;
    return <Link href={href} className={classes} {...rest}>{children}</Link>;
  }
  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, type, ...rest } = allProps;
  return <button type={type ?? "button"} className={classes} {...rest}>{children}</button>;
}

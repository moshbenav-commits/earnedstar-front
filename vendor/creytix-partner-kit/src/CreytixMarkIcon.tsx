"use client";

import { useId, type SVGProps } from "react";

/** Creytix hex + cube mark (partner lockup right side). */
export function CreytixMarkIcon({
  size = 40,
  title = "Creytix",
  className,
  ...rest
}: SVGProps<SVGSVGElement> & { size?: number; title?: string }) {
  const uid = useId().replace(/:/g, "");
  const id = `cx-hex-grad-${uid}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={className}
      {...rest}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={id} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#E85D3B" />
          <stop offset="55%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      <path
        d="M32 4 L54 17 L54 47 L32 60 L10 47 L10 17 Z"
        fill="#FFFFFF"
        stroke={`url(#${id})`}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M32 22 L44 29 L44 41 L32 48 L20 41 L20 29 Z" fill="none" stroke="#111827" strokeWidth="1.6" />
      <path d="M32 22 L44 29 L32 36 L20 29 Z" fill="#F9FAFB" stroke="#111827" strokeWidth="1.4" />
      <path d="M20 29 L32 36 L32 48 L20 41 Z" fill="#F3F4F6" stroke="#111827" strokeWidth="1.4" />
      <path d="M32 36 L44 29 L44 41 L32 48 Z" fill="#111827" stroke="#111827" strokeWidth="1.2" />
    </svg>
  );
}

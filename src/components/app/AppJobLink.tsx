/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from 'next/link';

export function AppJobLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block min-h-11 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-4"
    >
      <p className="font-bold text-white">{title}</p>
      <p className="mt-1 text-sm text-gray-400">{description}</p>
    </Link>
  );
}

/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '@expedia/design-system/styles';

export const metadata: Metadata = {
  title: 'Design Lab',
  robots: { index: false, follow: false },
};

export default function DesignLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  return children;
}

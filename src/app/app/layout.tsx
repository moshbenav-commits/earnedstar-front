/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: { default: 'App', template: '%s | EarnedStar' },
  appleWebApp: { capable: true, title: 'EarnedStar', statusBarStyle: 'black-translucent' },
};

export const viewport: Viewport = {
  themeColor: '#0a1628', // --dark-bg (globals.css) — viewport meta requires a literal color, not a CSS var
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function DistilledAppLayout({ children }: { children: React.ReactNode }) {
  return children;
}

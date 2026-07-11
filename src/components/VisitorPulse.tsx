'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { sendPageview } from '@/lib/visitorPulse';

/** Creytix Visitor Pulse — mounts once in the root layout, fires a
 * pageview beacon on first render and on every route change. */
export function VisitorPulse() {
  const pathname = usePathname();
  const lastSent = useRef<string>('');

  useEffect(() => {
    if (!pathname || pathname === lastSent.current) return;
    lastSent.current = pathname;
    sendPageview(pathname);
  }, [pathname]);

  return null;
}

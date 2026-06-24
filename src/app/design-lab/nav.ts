/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import type { DesignLabNavItem } from '@expedia/design-lab';

export const EARNEDSTAR_DESIGN_LAB_NAV: readonly DesignLabNavItem[] = [
  { href: '/design-lab', label: 'Overview' },
  { href: '/design-lab/tokens', label: 'Tokens' },
  { href: '/design-lab/stars', label: 'Stars' },
  { href: '/design-lab/brand', label: 'Brand' },
  { href: '/design-lab/logo-workshop', label: 'Logo workshop' },
  { href: '/design-lab/shared', label: 'EP primitives' },
] as const;

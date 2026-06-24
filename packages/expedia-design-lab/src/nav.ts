/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
export type DesignLabNavItem = {
  href: string;
  label: string;
};

export const EXPEDIA_PARTS_DESIGN_LAB_NAV: readonly DesignLabNavItem[] = [
  { href: '/design-lab', label: 'Overview' },
  { href: '/design-lab/logos', label: 'Logos' },
  { href: '/design-lab/logo-workshop', label: 'Logo workshop' },
  { href: '/design-lab/materials', label: 'Materials' },
  { href: '/design-lab/buttons', label: 'Buttons' },
  { href: '/design-lab/badges', label: 'Badges' },
  { href: '/design-lab/states', label: 'States' },
  { href: '/design-lab/scenarios', label: 'Scenarios' },
] as const;

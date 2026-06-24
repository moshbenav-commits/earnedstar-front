/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
'use client';

import { DesignLabShell } from '@expedia/design-lab';
import {
  LogoWorkshopPanel,
  createEarnedStarBrief,
  EARNEDSTAR_LOGO_WORKSHOP_STORAGE_KEY,
  type LogoWorkshopBrandTarget,
  type LogoWorkshopTier,
} from '@expedia/design-lab/logo-workshop';
import { EarnedStarLogo } from '@/components/brand/earnedstar-logo';
import { EarnedStarLuckyStar } from '@/components/brand/earnedstar-lucky-star';
import { EARNEDSTAR_DESIGN_LAB_NAV } from '../nav';

const ES_BRAND_OPTIONS = [{ id: 'earnedstar' as const, label: 'EarnedStar' }];
const ES_TIER_OPTIONS = [
  { id: 'origami' as const, label: 'Origami lucky star (TSX)' },
  { id: 'flat' as const, label: 'Outline mark (TSX)' },
];

function renderEarnedStarPreview(brand: LogoWorkshopBrandTarget, tier: LogoWorkshopTier) {
  if (brand !== 'earnedstar') {
    return <p className='text-sm text-gray-400'>Select EarnedStar brand.</p>;
  }
  if (tier === 'origami') {
    return <EarnedStarLuckyStar variant='navy' size={120} />;
  }
  return <EarnedStarLogo size={48} />;
}

export default function EarnedStarLogoWorkshopPage() {
  return (
    <DesignLabShell
      title='EarnedStar logo workshop'
      description='Brief origami star refinements, Pinterest mood board, and source-file audit against earnedstar-logo-spec. Artifacts save to earnedstar/brand/workshop/.'
      nav={EARNEDSTAR_DESIGN_LAB_NAV}
      kicker='EarnedStar · brand'
    >
      <LogoWorkshopPanel
        apiBase='/api/design-lab/logo-workshop'
        storageKey={EARNEDSTAR_LOGO_WORKSHOP_STORAGE_KEY}
        createInitialBrief={createEarnedStarBrief}
        brandOptions={ES_BRAND_OPTIONS}
        tierOptions={ES_TIER_OPTIONS}
        renderPreview={renderEarnedStarPreview}
        auditTitle='Origami source audit'
        auditDescription='Checks earnedstar-lucky-star.tsx markers against earnedstar-logo-spec (variant tokens, facets, medallion, radial body).'
        siblingWorkshops={[
          {
            label: 'ExpediaParts chrome workshop',
            href: 'http://guest.localhost:3000/design-lab/logo-workshop',
            note: 'Engines / Transmissions SVG tiers',
          },
        ]}
      />
    </DesignLabShell>
  );
}

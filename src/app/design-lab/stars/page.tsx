/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
'use client';

import { useState } from 'react';
import {
  DesignLabCard,
  DesignLabGrid,
  DesignLabSection,
  DesignLabShell,
} from '@expedia/design-lab';
import { ProgressiveStarRating } from '@/components/ui/progressive-star-rating';
import { StarRating } from '@/components/ui/star-rating';
import { EARNEDSTAR_DESIGN_LAB_NAV } from '../nav';

export default function EarnedStarDesignLabStarsPage() {
  const [progressive, setProgressive] = useState(0);
  const [compact, setCompact] = useState(4);

  return (
    <DesignLabShell
      title='Star ratings'
      description='Progressive sentiment stars (submit flow) and compact Lucide stars (dashboard/reviews).'
      nav={EARNEDSTAR_DESIGN_LAB_NAV}
      kicker='EarnedStar · stars'
    >
      <DesignLabSection
        title='Progressive star rating'
        description='Five sentiment colors — gold only at excellent (5). Used on review submit.'
      >
        <DesignLabCard label='Interactive · size 56' surface='light'>
          <ProgressiveStarRating value={progressive} onChange={setProgressive} size={56} />
        </DesignLabCard>
      </DesignLabSection>

      <DesignLabSection title='Compact star rating'>
        <DesignLabGrid>
          <DesignLabCard label='Display · lg' surface='light'>
            <StarRating rating={4.5} size='lg' />
          </DesignLabCard>
          <DesignLabCard label='Interactive · md' surface='light'>
            <StarRating rating={compact} size='md' interactive onChange={setCompact} />
          </DesignLabCard>
          <DesignLabCard label='Display · sm' surface='light'>
            <StarRating rating={3} size='sm' />
          </DesignLabCard>
        </DesignLabGrid>
      </DesignLabSection>
    </DesignLabShell>
  );
}

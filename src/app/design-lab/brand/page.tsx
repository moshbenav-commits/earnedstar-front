/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import {
  DesignLabCard,
  DesignLabGrid,
  DesignLabSection,
  DesignLabShell,
} from '@expedia/design-lab';
import { EarnedStarLogo } from '@/components/brand/earnedstar-logo';
import { EarnedStarMark } from '@/components/brand/earnedstar-mark';
import { EARNEDSTAR_DESIGN_LAB_NAV } from '../nav';

export default function EarnedStarDesignLabBrandPage() {
  return (
    <DesignLabShell
      title='Brand lockups'
      description='Origami lucky star, outline mark, and wordmark variants from earnedstar-logo-spec.'
      nav={EARNEDSTAR_DESIGN_LAB_NAV}
      kicker='EarnedStar · brand'
    >
      <DesignLabSection title='Primary lockups'>
        <DesignLabGrid>
          <DesignLabCard label='Lucky star + wordmark' surface='light'>
            <EarnedStarLogo size={48} />
          </DesignLabCard>
          <DesignLabCard label='Star only' surface='light'>
            <EarnedStarLogo size={56} showWordmark={false} />
          </DesignLabCard>
          <DesignLabCard label='Gold variant' surface='light'>
            <EarnedStarLogo size={48} luckyVariant='gold' />
          </DesignLabCard>
        </DesignLabGrid>
      </DesignLabSection>

      <DesignLabSection title='On dark surfaces'>
        <DesignLabGrid>
          <DesignLabCard label='Light variant lockup' surface='navy'>
            <EarnedStarLogo size={48} variant='light' />
          </DesignLabCard>
          <DesignLabCard label='Mark only' surface='navy'>
            <EarnedStarMark size={40} darkBg />
          </DesignLabCard>
        </DesignLabGrid>
      </DesignLabSection>
    </DesignLabShell>
  );
}

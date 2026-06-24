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
import { DsButton, colors } from '@expedia/design-system';
import { EARNEDSTAR_DESIGN_LAB_NAV } from '../nav';

export default function EarnedStarDesignLabSharedPage() {
  return (
    <DesignLabShell
      title='EP shared primitives'
      description='@expedia/design-system components consumed via file: workspace packages — same shell as ExpediaParts design-lab.'
      nav={EARNEDSTAR_DESIGN_LAB_NAV}
      kicker='Cross-app · @expedia/design-system'
    >
      <DesignLabSection
        title='Button matrix'
        description='EP orange primary on light cards; secondary on navy — verify contrast when both token sets load.'
      >
        <DesignLabGrid>
          <DesignLabCard label='Primary orange' surface='light'>
            <DsButton variant='primary'>Shop engines</DsButton>
          </DesignLabCard>
          <DesignLabCard label='Secondary' surface='navy'>
            <DsButton variant='secondary'>Compare tiers</DsButton>
          </DesignLabCard>
          <DesignLabCard label='Ghost' surface='navy'>
            <DsButton variant='ghost'>Learn more</DsButton>
          </DesignLabCard>
        </DesignLabGrid>
      </DesignLabSection>

      <DesignLabSection title='Token bridge'>
        <DesignLabCard label='EP orange vs ES gold' surface='navy'>
          <p className='text-center text-sm text-gray-300'>
            <span className='font-mono text-[var(--color-orange)]'>{colors.orange}</span>
            <span className='mx-2 text-gray-500'>·</span>
            <span className='font-mono text-[var(--gold)]'>#F59E0B</span>
          </p>
        </DesignLabCard>
      </DesignLabSection>
      <DesignLabSection title='Cross-app workshop'>
        <DesignLabCard label='ExpediaParts logo workshop' surface='navy'>
          <p className='max-w-md text-center text-sm text-gray-300'>
            Pinterest mood board + Cursor brief export lives in{' '}
            <code className='text-gray-200'>expedia-parts-front /design-lab/logo-workshop</code>
          </p>
        </DesignLabCard>
      </DesignLabSection>
    </DesignLabShell>
  );
}

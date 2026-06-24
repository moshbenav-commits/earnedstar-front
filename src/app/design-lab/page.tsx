/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from 'next/link';
import {
  DesignLabCard,
  DesignLabGrid,
  DesignLabSection,
  DesignLabShell,
} from '@expedia/design-lab';
import { EARNEDSTAR_DESIGN_LAB_NAV } from './nav';

export default function EarnedStarDesignLabOverviewPage() {
  return (
    <DesignLabShell
      title='EarnedStar design lab'
      description='Dev-only visual proving ground for navy/gold tokens, star ratings, brand lockups, and shared @expedia/design-system primitives.'
      nav={EARNEDSTAR_DESIGN_LAB_NAV}
      kicker='EarnedStar · code-native'
    >
      <DesignLabSection title='Sections'>
        <DesignLabGrid>
          {EARNEDSTAR_DESIGN_LAB_NAV.filter((item) => item.href !== '/design-lab').map((item) => (
            <DesignLabCard key={item.href} label={item.label} surface='navy'>
              <Link
                href={item.href}
                className='text-sm font-semibold text-[var(--gold)] hover:text-[var(--gold-light)]'
              >
                Open {item.label} →
              </Link>
            </DesignLabCard>
          ))}
        </DesignLabGrid>
      </DesignLabSection>

      <DesignLabSection title='Production isolation'>
        <DesignLabCard label='Styles scoped to /design-lab' surface='light'>
          <p className='max-w-md text-center text-sm text-[var(--text-muted)]'>
            EP material CSS loads only in this route group layout. EarnedStar production pages keep
            warm-stone surfaces from <code className='text-[var(--text)]'>globals.css</code>.
          </p>
        </DesignLabCard>
      </DesignLabSection>
    </DesignLabShell>
  );
}

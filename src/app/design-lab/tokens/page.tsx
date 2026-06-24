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
import { EARNEDSTAR_DESIGN_LAB_NAV } from '../nav';

const TOKEN_SWATCHES = [
  { label: 'Navy', var: '--navy', hex: '#0F2044' },
  { label: 'Navy mid', var: '--navy-mid', hex: '#1A3566' },
  { label: 'Gold', var: '--gold', hex: '#F59E0B' },
  { label: 'Gold dark', var: '--gold-dark', hex: '#D97706' },
  { label: 'Green verified', var: '--green', hex: '#059669' },
  { label: 'Warm bg', var: '--bg', hex: '#F0EDE6' },
  { label: 'Surface', var: '--surface', hex: '#FAF9F6' },
  { label: 'Dark bg', var: '--dark-bg', hex: '#0A1628' },
] as const;

export default function EarnedStarDesignLabTokensPage() {
  return (
    <DesignLabShell
      title='EarnedStar tokens'
      description='CSS variables from globals.css — navy + gold pairing, warm stone surfaces, progressive star colors.'
      nav={EARNEDSTAR_DESIGN_LAB_NAV}
      kicker='EarnedStar · tokens'
    >
      <DesignLabSection title='Brand palette'>
        <DesignLabGrid>
          {TOKEN_SWATCHES.map((token) => (
            <DesignLabCard key={token.var} label={`${token.label} · ${token.hex}`} surface='light'>
              <div
                className='h-16 w-full rounded-lg border border-[var(--border)]'
                style={{ background: `var(${token.var})` }}
              />
            </DesignLabCard>
          ))}
        </DesignLabGrid>
      </DesignLabSection>

      <DesignLabSection title='Typography on light surface'>
        <DesignLabCard label='Warm stone card' surface='light'>
          <div className='space-y-2 text-center'>
            <p className='text-2xl font-bold text-[var(--text)]'>Trust that was earned</p>
            <p className='text-sm text-[var(--text-muted)]'>Authoritative, precise, timeless.</p>
            <button
              type='button'
              className='rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-semibold text-white'
            >
              Primary navy CTA
            </button>
            <button
              type='button'
              className='ml-2 rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[var(--navy)]'
            >
              Gold accent CTA
            </button>
          </div>
        </DesignLabCard>
      </DesignLabSection>
    </DesignLabShell>
  );
}

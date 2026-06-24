/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  BrandLogo,
  PremiumBrandLogo,
  StickerLogo,
  type BrandId,
} from '@expedia/design-system';
import { DesignLabCard, DesignLabGrid, DesignLabSection } from '../DesignLabShell';
import {
  BUILTIN_REFERENCE_SEEDS,
  buildCursorLogoPrompt,
  createEmptyBrief,
  createReferenceId,
  parseReferenceInput,
  type LogoWorkshopBrief,
  type LogoWorkshopBrandTarget,
  type LogoWorkshopReference,
  type LogoWorkshopTier,
} from './logoWorkshop';
import { LogoWorkshopAiPanel } from './LogoWorkshopAiPanel';

const BRAND_OPTIONS: { id: LogoWorkshopBrandTarget; label: string }[] = [
  { id: 'transmissions', label: 'Expedia Transmissions' },
  { id: 'engines', label: 'Expedia Engines' },
  { id: 'parts', label: 'ExpediaParts monogram' },
  { id: 'earnedstar', label: 'EarnedStar (sibling brand)' },
];

const TIER_OPTIONS: { id: LogoWorkshopTier; label: string }[] = [
  { id: 'chrome', label: 'T2 Chrome emblem' },
  { id: 'flat', label: 'T1 Flat emblem' },
  { id: 'sticker', label: 'T3 Sticker' },
  { id: 'wordmark', label: 'Wordmark' },
  { id: 'origami', label: 'Origami lucky star' },
];

export type LogoWorkshopPanelProps = {
  apiBase?: string;
  storageKey?: string;
  createInitialBrief?: () => LogoWorkshopBrief;
  renderPreview?: (brand: LogoWorkshopBrandTarget, tier: LogoWorkshopTier) => ReactNode;
  brandOptions?: { id: LogoWorkshopBrandTarget; label: string }[];
  tierOptions?: { id: LogoWorkshopTier; label: string }[];
  auditTitle?: string;
  auditDescription?: string;
  siblingWorkshops?: { label: string; href: string; note?: string }[];
};

function loadBrief(storageKey: string, createInitialBrief: () => LogoWorkshopBrief): LogoWorkshopBrief {
  if (typeof window === 'undefined') return createInitialBrief();
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return createInitialBrief();
    const parsed = JSON.parse(raw) as LogoWorkshopBrief;
    if (parsed.version !== 1) return createInitialBrief();
    return parsed;
  } catch {
    return createInitialBrief();
  }
}

function CurrentLogoPreview({
  brand,
  tier,
}: {
  brand: LogoWorkshopBrandTarget;
  tier: LogoWorkshopTier;
}) {
  if (brand === 'earnedstar') {
    return (
      <p className='max-w-sm text-center text-sm text-gray-400'>
        EarnedStar lockups live in <code className='text-gray-200'>earnedstar/src/components/brand/</code>
        — use brief export to iterate there.
      </p>
    );
  }

  const epBrand = brand as BrandId;

  if (tier === 'chrome') {
    if (epBrand === 'parts') {
      return <BrandLogo brand='parts' variant='horizontal' width={120} height={48} />;
    }
    return <PremiumBrandLogo brand={epBrand} sheen='hover' width={260} height={120} />;
  }
  if (tier === 'sticker') {
    if (epBrand === 'parts') {
      return (
        <p className='text-center text-sm text-gray-400'>Parts monogram has no sticker tier yet.</p>
      );
    }
    return <StickerLogo brand={epBrand} width={240} height={88} />;
  }
  if (tier === 'wordmark') {
    return (
      <BrandLogo
        brand={epBrand}
        variant='wordmark'
        width={240}
        height={36}
      />
    );
  }

  return <BrandLogo brand={epBrand} variant='flat' width={220} height={100} />;
}

function ReferenceTile({
  reference,
  onRemove,
}: {
  reference: LogoWorkshopReference;
  onRemove: (id: string) => void;
}) {
  const [broken, setBroken] = useState(false);
  const showImage = reference.previewUrl && !broken;

  return (
    <article className='overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-dark)] bg-white/5'>
      <div className='flex items-center justify-between gap-2 border-b border-[var(--border-dark)] px-3 py-2'>
        <div className='min-w-0'>
          <p className='truncate text-xs font-semibold text-gray-200'>{reference.label}</p>
          <p className='truncate text-[10px] uppercase tracking-wide text-gray-500'>{reference.source}</p>
        </div>
        {reference.source !== 'builtin' ? (
          <button
            type='button'
            onClick={() => onRemove(reference.id)}
            className='shrink-0 rounded px-2 py-1 text-[10px] font-semibold text-amber-200 hover:bg-white/10'
          >
            Remove
          </button>
        ) : null}
      </div>
      <div className='flex min-h-[140px] items-center justify-center bg-black/20 p-3'>
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- workshop mood board (external Pinterest URLs)
          <img
            src={reference.previewUrl}
            alt={reference.label}
            className='max-h-32 max-w-full rounded object-contain'
            onError={() => setBroken(true)}
          />
        ) : (
          <div className='space-y-2 px-3 text-center text-xs text-gray-400'>
            <p>Pinterest pin link saved — preview needs a direct image URL.</p>
            <a
              href={reference.sourceUrl}
              target='_blank'
              rel='noreferrer'
              className='font-semibold text-[var(--color-blueberry)] hover:underline'
            >
              Open pin →
            </a>
          </div>
        )}
      </div>
      {reference.notes ? (
        <p className='border-t border-[var(--border-dark)] px-3 py-2 text-[11px] text-gray-500'>
          {reference.notes}
        </p>
      ) : null}
    </article>
  );
}

export function LogoWorkshopPanel({
  apiBase = '/api/design-lab/logo-workshop',
  storageKey = 'expedia-design-lab-logo-workshop-v1',
  createInitialBrief = createEmptyBrief,
  renderPreview,
  brandOptions = BRAND_OPTIONS,
  tierOptions = TIER_OPTIONS,
  auditTitle,
  auditDescription,
  siblingWorkshops,
}: LogoWorkshopPanelProps) {
  const [brief, setBrief] = useState<LogoWorkshopBrief>(createInitialBrief);
  const [referenceInput, setReferenceInput] = useState('');
  const [referenceLabel, setReferenceLabel] = useState('Pinterest reference');
  const [status, setStatus] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBrief(loadBrief(storageKey, createInitialBrief));
    setHydrated(true);
  }, [storageKey, createInitialBrief]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(brief));
  }, [brief, hydrated, storageKey]);

  const cursorPrompt = useMemo(() => buildCursorLogoPrompt(brief), [brief]);

  const patchBrief = useCallback((partial: Partial<LogoWorkshopBrief>) => {
    setBrief((current) => ({
      ...current,
      ...partial,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const addReference = useCallback(() => {
    const ref = parseReferenceInput(referenceInput, referenceLabel);
    if (!ref) {
      setStatus('Paste a Pinterest pin URL or a direct image URL (i.pinimg.com).');
      return;
    }
    setBrief((current) => ({
      ...current,
      updatedAt: new Date().toISOString(),
      references: [...current.references, ref],
    }));
    setReferenceInput('');
    setStatus(`Added ${ref.label}.`);
  }, [referenceInput, referenceLabel]);

  const resolvePinterest = useCallback(async () => {
    if (!referenceInput.trim()) {
      setStatus('Paste a Pinterest pin URL first.');
      return;
    }
    setStatus('Resolving Pinterest preview…');
    try {
      const params = new URLSearchParams({
        action: 'resolve-pinterest',
        url: referenceInput.trim(),
      });
      const res = await fetch(`${apiBase}?${params}`);
      const data = (await res.json()) as {
        ok?: boolean;
        previewUrl?: string | null;
        error?: string;
        source?: string;
      };
      if (!data.ok || !data.previewUrl) {
        setStatus(data.error ?? 'Could not resolve Pinterest image.');
        return;
      }
      const ref = parseReferenceInput(data.previewUrl, referenceLabel || 'Pinterest pin');
      if (!ref) return;
      const enriched = {
        ...ref,
        sourceUrl: referenceInput.trim(),
        previewUrl: data.previewUrl,
        notes: `Resolved via ${data.source ?? 'pinterest'}.`,
      };
      setBrief((current) => ({
        ...current,
        updatedAt: new Date().toISOString(),
        references: [...current.references, enriched],
      }));
      setReferenceInput('');
      setStatus(`Resolved Pinterest image (${data.source}).`);
    } catch {
      setStatus('Pinterest resolve failed — paste i.pinimg.com URL directly.');
    }
  }, [referenceInput, referenceLabel]);

  const removeReference = useCallback((id: string) => {
    setBrief((current) => ({
      ...current,
      updatedAt: new Date().toISOString(),
      references: current.references.filter((ref) => ref.id !== id),
    }));
  }, []);

  const handleUpload = useCallback(async (file: File | null) => {
    if (!file) return;
    const form = new FormData();
    form.append('brief', JSON.stringify(brief));
    form.append('file', file);
    form.append('label', referenceLabel || file.name);

    setStatus('Uploading reference to brand/logos/reference/workshop/…');
    try {
      const res = await fetch(apiBase, { method: 'POST', body: form });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        reference?: LogoWorkshopReference;
        savedBriefPath?: string;
      };
      if (!res.ok || !data.ok || !data.reference) {
        setStatus(data.error ?? 'Upload failed.');
        return;
      }
      const uploaded = data.reference;
      setBrief((current) => ({
        ...current,
        updatedAt: new Date().toISOString(),
        references: [...current.references, uploaded],
      }));
      setStatus(`Saved ${data.reference.previewUrl}${data.savedBriefPath ? ` · brief ${data.savedBriefPath}` : ''}`);
    } catch {
      setStatus('Upload failed — is the dev server running?');
    }
  }, [brief, referenceLabel]);

  const saveBriefToRepo = useCallback(async () => {
    setStatus('Saving brief JSON to brand/logos/workshop/briefs/…');
    try {
      const res = await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; savedBriefPath?: string };
      if (!res.ok || !data.ok) {
        setStatus(data.error ?? 'Save failed.');
        return;
      }
      setStatus(`Brief saved: ${data.savedBriefPath}`);
    } catch {
      setStatus('Save failed — dev API unavailable.');
    }
  }, [brief]);

  const copyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cursorPrompt);
      setStatus('Cursor prompt copied.');
    } catch {
      setStatus('Could not copy — select the prompt block manually.');
    }
  }, [cursorPrompt]);

  const resetBrief = useCallback(() => {
    setBrief(createInitialBrief());
    setStatus('Workshop reset with built-in reference seeds.');
  }, [createInitialBrief]);

  return (
    <div className='space-y-10'>
      {siblingWorkshops && siblingWorkshops.length > 0 ? (
        <DesignLabSection title='Sibling workshops' description='Jump between ExpediaParts chrome tiers and EarnedStar origami lab.'>
          <ul className='flex flex-wrap gap-3'>
            {siblingWorkshops.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className='inline-flex flex-col rounded-lg border border-[var(--border-dark)] bg-white/5 px-4 py-3 text-sm text-gray-200 hover:border-white/25'
                >
                  <span className='font-semibold text-white'>{link.label}</span>
                  {link.note ? <span className='mt-1 text-xs text-gray-500'>{link.note}</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </DesignLabSection>
      ) : null}

      <DesignLabSection
        title='Creative brief'
        description='Describe the logo you want. Pair with Pinterest references — inspiration only, never ship unlicensed art.'
      >
        <div className='grid gap-4 lg:grid-cols-2'>
          <label className='space-y-1 text-sm text-gray-300'>
            <span className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Brand</span>
            <select
              value={brief.brand}
              onChange={(e) => patchBrief({ brand: e.target.value as LogoWorkshopBrandTarget })}
              className='w-full rounded-lg border border-[var(--border-dark)] bg-white/5 px-3 py-2 text-white'
            >
              {brandOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className='space-y-1 text-sm text-gray-300'>
            <span className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Tier</span>
            <select
              value={brief.tier}
              onChange={(e) => patchBrief({ tier: e.target.value as LogoWorkshopTier })}
              className='w-full rounded-lg border border-[var(--border-dark)] bg-white/5 px-3 py-2 text-white'
            >
              {tierOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          {(
            [
              ['goal', 'Goal', 'e.g. Sharper REMAN block legibility at 120px width'],
              ['mood', 'Mood / keywords', 'machined · enamel · performance badge · cold precision'],
              ['mustInclude', 'Must include', 'REMAN block · navy field · horizontal nameplate'],
              ['mustAvoid', 'Must avoid', 'neon · SaaS gradient · cartoon chrome'],
              ['notes', 'Session notes', 'Compare against sticker cutline references'],
            ] as const
          ).map(([key, label, placeholder]) => (
            <label key={key} className='space-y-1 text-sm text-gray-300 lg:col-span-2'>
              <span className='text-xs font-semibold uppercase tracking-wide text-gray-500'>{label}</span>
              <textarea
                value={brief[key]}
                onChange={(e) => patchBrief({ [key]: e.target.value })}
                rows={key === 'notes' ? 3 : 2}
                placeholder={placeholder}
                className='w-full rounded-lg border border-[var(--border-dark)] bg-white/5 px-3 py-2 text-white placeholder:text-gray-500'
              />
            </label>
          ))}
        </div>
      </DesignLabSection>

      <DesignLabSection
        title='Pinterest & reference board'
        description='Paste a Pinterest pin URL or direct image link (right-click pin → Copy image address). Uploads save to brand/logos/reference/workshop/.'
      >
        <div className='mb-4 grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]'>
          <input
            value={referenceLabel}
            onChange={(e) => setReferenceLabel(e.target.value)}
            placeholder='Reference label'
            className='rounded-lg border border-[var(--border-dark)] bg-white/5 px-3 py-2 text-sm text-white'
          />
          <input
            value={referenceInput}
            onChange={(e) => setReferenceInput(e.target.value)}
            placeholder='https://www.pinterest.com/pin/… or https://i.pinimg.com/…'
            className='rounded-lg border border-[var(--border-dark)] bg-white/5 px-3 py-2 text-sm text-white md:col-span-1'
          />
          <button
            type='button'
            onClick={() => void resolvePinterest()}
            className='rounded-lg border border-[var(--border-dark)] px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-white/10'
          >
            Resolve Pinterest
          </button>
          <button
            type='button'
            onClick={addReference}
            className='rounded-lg bg-[var(--color-orange)] px-4 py-2 text-sm font-bold text-[var(--color-dark-blue)]'
          >
            Add reference
          </button>
        </div>

        <div className='mb-4 flex flex-wrap items-center gap-3'>
          <label className='cursor-pointer rounded-lg border border-dashed border-[var(--border-dark)] px-4 py-2 text-sm text-gray-300 hover:border-white/30'>
            Upload image
            <input
              type='file'
              accept='image/png,image/jpeg,image/webp,image/gif'
              className='hidden'
              onChange={(e) => void handleUpload(e.target.files?.[0] ?? null)}
            />
          </label>
          <button
            type='button'
            onClick={() => {
              const seeds = BUILTIN_REFERENCE_SEEDS.map((seed) => ({
                id: seed.id,
                source: 'builtin' as const,
                label: seed.label,
                sourceUrl: seed.previewUrl,
                previewUrl: seed.previewUrl,
                notes: seed.notes,
              }));
              patchBrief({ references: seeds });
              setStatus('Restored built-in reference seeds.');
            }}
            className='text-sm text-gray-400 underline hover:text-white'
          >
            Restore built-in seeds
          </button>
        </div>

        <DesignLabGrid>
          {brief.references.map((ref) => (
            <ReferenceTile key={ref.id} reference={ref} onRemove={removeReference} />
          ))}
        </DesignLabGrid>
      </DesignLabSection>

      <DesignLabSection title='Current mark vs brief'>
        <div className='grid gap-4 lg:grid-cols-2'>
          <DesignLabCard label='Production SVG today' surface='hero'>
            {renderPreview ? (
              renderPreview(brief.brand, brief.tier)
            ) : (
              <CurrentLogoPreview brand={brief.brand} tier={brief.tier} />
            )}
          </DesignLabCard>
          <DesignLabCard label='Brief snapshot' surface='navy'>
            <ul className='max-w-sm space-y-2 text-left text-sm text-gray-300'>
              <li>
                <span className='text-gray-500'>Goal:</span> {brief.goal || '—'}
              </li>
              <li>
                <span className='text-gray-500'>Mood:</span> {brief.mood || '—'}
              </li>
              <li>
                <span className='text-gray-500'>References:</span> {brief.references.length}
              </li>
            </ul>
          </DesignLabCard>
        </div>
      </DesignLabSection>

      <LogoWorkshopAiPanel
        apiBase={apiBase}
        auditTitle={auditTitle}
        auditDescription={auditDescription}
        brief={brief}
        onBriefLoaded={setBrief}
        onStatus={setStatus}
      />

      <DesignLabSection title='Quick export'>
        <div className='space-y-3'>
          <pre className='max-h-64 overflow-auto rounded-lg border border-[var(--border-dark)] bg-black/40 p-4 text-xs text-gray-300'>
            {cursorPrompt}
          </pre>
          <div className='flex flex-wrap gap-2'>
            <button
              type='button'
              onClick={() => void copyPrompt()}
              className='rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15'
            >
              Copy Cursor prompt
            </button>
            <button
              type='button'
              onClick={() => void saveBriefToRepo()}
              className='rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15'
            >
              Save brief to repo
            </button>
            <button
              type='button'
              onClick={resetBrief}
              className='rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-white'
            >
              Reset workshop
            </button>
          </div>
          {status ? <p className='text-sm text-amber-100/90'>{status}</p> : null}
        </div>
      </DesignLabSection>
    </div>
  );
}

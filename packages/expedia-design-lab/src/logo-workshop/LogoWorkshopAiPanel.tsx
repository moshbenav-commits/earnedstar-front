/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { DesignLabCard, DesignLabSection } from '../DesignLabShell';
import type { LogoWorkshopBrief } from './logoWorkshop';
import type { SvgLayerAudit } from './logoWorkshopSvg';

type SavedBriefMeta = {
  filename: string;
  path: string;
  updatedAt: string | null;
};

type IterationMeta = {
  filename: string;
  path: string;
  cursorTxt: string;
  figmaTxt: string;
};

type LogoWorkshopAiPanelProps = {
  apiBase?: string;
  brief: LogoWorkshopBrief;
  onBriefLoaded: (brief: LogoWorkshopBrief) => void;
  onStatus: (message: string) => void;
  auditTitle?: string;
  auditDescription?: string;
};

export type { LogoWorkshopAiPanelProps };

function LayerAuditTable({ audit }: { audit: SvgLayerAudit }) {
  if (!audit.target) {
    return (
      <p className='text-sm text-gray-400'>
        No SVG master mapped for this brand/tier. Pick ET/EE chrome or flat to audit layers.
      </p>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-[520px] text-left text-xs text-gray-300'>
        <thead>
          <tr className='border-b border-[var(--border-dark)] text-gray-500'>
            <th className='py-2 pr-3 font-semibold'>Layer</th>
            <th className='py-2 pr-3 font-semibold'>Status</th>
            <th className='py-2 font-semibold'>Note</th>
          </tr>
        </thead>
        <tbody>
          {audit.presentCanon.map((spec) => (
            <tr key={spec.id} className='border-b border-white/5'>
              <td className='py-2 pr-3 font-mono text-emerald-200'>{spec.id}</td>
              <td className='py-2 pr-3 text-emerald-300'>present</td>
              <td className='py-2 text-gray-500'>{spec.note}</td>
            </tr>
          ))}
          {audit.missingRequired.map((spec) => (
            <tr key={spec.id} className='border-b border-white/5'>
              <td className='py-2 pr-3 font-mono text-amber-200'>{spec.id}</td>
              <td className='py-2 pr-3 text-amber-300'>missing · required</td>
              <td className='py-2 text-gray-500'>{spec.note}</td>
            </tr>
          ))}
          {audit.missingOptional.map((spec) => (
            <tr key={spec.id} className='border-b border-white/5'>
              <td className='py-2 pr-3 font-mono text-gray-400'>{spec.id}</td>
              <td className='py-2 pr-3 text-gray-500'>missing · optional</td>
              <td className='py-2 text-gray-500'>{spec.note}</td>
            </tr>
          ))}
          {audit.unexpectedLayers.map((layer) => (
            <tr key={layer.id} className='border-b border-white/5'>
              <td className='py-2 pr-3 font-mono text-sky-200'>{layer.id}</td>
              <td className='py-2 pr-3 text-sky-300'>extra</td>
              <td className='py-2 text-gray-500'>Not in canon list — OK if intentional detail</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!audit.usesCanonNaming ? (
        <p className='mt-3 text-sm text-amber-100/90'>
          SVG uses non-canon group names — rename to L6/Shadow … L1/Typography for Figma parity and
          automated diff.
        </p>
      ) : null}
    </div>
  );
}

export function LogoWorkshopAiPanel({
  apiBase = '/api/design-lab/logo-workshop',
  brief,
  onBriefLoaded,
  onStatus,
  auditTitle = 'SVG chrome layer diff',
  auditDescription = 'Compares production SVG group IDs against EXPEDIAPARTS_LOGO_DESIGN_SYSTEM §7 canon.',
}: LogoWorkshopAiPanelProps) {
  const [audit, setAudit] = useState<SvgLayerAudit | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [savedBriefs, setSavedBriefs] = useState<SavedBriefMeta[]>([]);
  const [selectedBrief, setSelectedBrief] = useState('');
  const [iterationPrompt, setIterationPrompt] = useState('');
  const [cursorRef, setCursorRef] = useState('');
  const [figmaRef, setFigmaRef] = useState('');
  const [iterations, setIterations] = useState<IterationMeta[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshAudit = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        action: 'svg-audit',
        brand: brief.brand,
        tier: brief.tier,
      });
      const res = await fetch(`${apiBase}?${params}`);
      const data = (await res.json()) as {
        ok?: boolean;
        audit?: SvgLayerAudit;
        error?: string;
      };
      if (data.audit) setAudit(data.audit);
      setAuditError(data.error ?? null);
    } catch {
      setAuditError('Could not load SVG audit.');
    } finally {
      setLoading(false);
    }
  }, [brief.brand, brief.tier, apiBase]);

  const refreshBriefs = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}?action=briefs`);
      const data = (await res.json()) as { briefs?: SavedBriefMeta[] };
      setSavedBriefs(data.briefs ?? []);
    } catch {
      setSavedBriefs([]);
    }
  }, [apiBase]);

  const refreshIterations = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}?action=iterations`);
      const data = (await res.json()) as { iterations?: IterationMeta[] };
      setIterations(data.iterations ?? []);
    } catch {
      setIterations([]);
    }
  }, [apiBase]);

  useEffect(() => {
    void refreshAudit();
  }, [refreshAudit]);

  useEffect(() => {
    void refreshBriefs();
    void refreshIterations();
  }, [refreshBriefs, refreshIterations]);

  const loadBrief = useCallback(async () => {
    if (!selectedBrief) return;
    const res = await fetch(
      `${apiBase}?action=brief&file=${encodeURIComponent(selectedBrief)}`,
    );
    const data = (await res.json()) as { ok?: boolean; brief?: LogoWorkshopBrief; error?: string };
    if (!res.ok || !data.brief) {
      onStatus(data.error ?? 'Failed to load brief.');
      return;
    }
    onBriefLoaded(data.brief);
    onStatus(`Loaded ${selectedBrief}`);
  }, [onBriefLoaded, onStatus, selectedBrief, apiBase]);

  const iterateWithAi = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'iterate', brief }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        prompt?: string;
        audit?: SvgLayerAudit;
        artifacts?: {
          workshopMd: string;
          cursorTxt: string;
          figmaTxt: string;
          cursorAtReference: string;
          figmaAtReference: string;
        };
      };

      if (!res.ok || !data.ok || !data.prompt) {
        onStatus(data.error ?? 'Iterate failed.');
        return;
      }

      if (data.audit) setAudit(data.audit);
      setIterationPrompt(data.prompt);
      const atRef = data.artifacts?.cursorAtReference ?? '';
      const figmaAt = data.artifacts?.figmaAtReference ?? '';
      setCursorRef(atRef);
      setFigmaRef(figmaAt);

      try {
        await navigator.clipboard.writeText(data.prompt);
      } catch {
        // clipboard may fail — prompt still visible
      }

      onStatus(
        [
          'Iteration prompt copied to clipboard.',
          data.artifacts?.cursorTxt ? `Cursor: ${atRef}` : '',
          data.artifacts?.figmaTxt ? `Figma: ${figmaAt}` : '',
          data.artifacts?.workshopMd ? `Saved ${data.artifacts.workshopMd}` : '',
        ]
          .filter(Boolean)
          .join(' '),
      );

      void refreshBriefs();
      void refreshIterations();
    } catch {
      onStatus('Iterate failed — dev API unavailable.');
    } finally {
      setLoading(false);
    }
  }, [brief, onStatus, refreshBriefs, refreshIterations, apiBase]);

  return (
    <>
      <DesignLabSection
        title='Saved briefs'
        description='Load a prior workshop session from brand/logos/workshop/briefs/.'
      >
        <div className='flex flex-wrap items-center gap-2'>
          <select
            value={selectedBrief}
            onChange={(e) => setSelectedBrief(e.target.value)}
            className='min-w-[240px] rounded-lg border border-[var(--border-dark)] bg-white/5 px-3 py-2 text-sm text-white'
          >
            <option value=''>Select saved brief…</option>
            {savedBriefs.map((item) => (
              <option key={item.filename} value={item.filename}>
                {item.filename}
                {item.updatedAt ? ` · ${item.updatedAt.slice(0, 10)}` : ''}
              </option>
            ))}
          </select>
          <button
            type='button'
            onClick={() => void loadBrief()}
            disabled={!selectedBrief}
            className='rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 disabled:opacity-40'
          >
            Load brief
          </button>
          <button
            type='button'
            onClick={() => void refreshBriefs()}
            className='text-sm text-gray-400 underline hover:text-white'
          >
            Refresh list
          </button>
        </div>
      </DesignLabSection>

      <DesignLabSection
        title={auditTitle}
        description={auditDescription}
      >
        <div className='mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-400'>
          <span>
            Target:{' '}
            <code className='text-gray-200'>{audit?.target?.workspacePath ?? '—'}</code>
          </span>
          {audit ? (
            <span>
              Parity: <strong className='text-white'>{audit.parityScore}%</strong> required layers
            </span>
          ) : null}
          <button
            type='button'
            onClick={() => void refreshAudit()}
            className='text-gray-400 underline hover:text-white'
          >
            Re-audit SVG
          </button>
        </div>
        {auditError ? <p className='mb-3 text-sm text-amber-200/90'>{auditError}</p> : null}
        {audit ? <LayerAuditTable audit={audit} /> : null}
      </DesignLabSection>

      <DesignLabSection
        title='Iteration history'
        description='Saved AI + Figma handoff prompts from prior workshop sessions.'
      >
        {iterations.length === 0 ? (
          <p className='text-sm text-gray-500'>No iterations saved yet — click Iterate with AI below.</p>
        ) : (
          <ul className='space-y-2 text-sm text-gray-300'>
            {iterations.slice(0, 8).map((item) => (
              <li
                key={item.filename}
                className='rounded-lg border border-[var(--border-dark)] bg-white/5 px-3 py-2'
              >
                <p className='font-mono text-xs text-gray-400'>{item.filename}</p>
                <p className='mt-1'>
                  <code className='text-gray-200'>@{item.cursorTxt}</code>
                  {' · '}
                  <code className='text-gray-200'>@{item.figmaTxt}</code>
                </p>
              </li>
            ))}
          </ul>
        )}
      </DesignLabSection>

      <DesignLabSection
        title='Iterate with AI'
        description='Saves Cursor + Figma prompts to docs/prompts/cursor/ and brand/logos/workshop/iterations/.'
      >
        <DesignLabCard label='One-click handoff' surface='navy'>
          <div className='flex flex-col items-center gap-3'>
            <button
              type='button'
              onClick={() => void iterateWithAi()}
              disabled={loading}
              className='rounded-lg bg-[var(--color-orange)] px-6 py-3 text-sm font-bold text-[var(--color-dark-blue)] disabled:opacity-50'
            >
              {loading ? 'Preparing…' : 'Iterate with AI → copy prompt + save files'}
            </button>
            {cursorRef ? (
              <p className='max-w-lg text-center text-xs text-gray-400'>
                Cursor: <code className='text-gray-200'>{cursorRef}</code>
                {figmaRef ? (
                  <>
                    <br />
                    Figma: <code className='text-gray-200'>{figmaRef}</code>
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
        </DesignLabCard>

        {iterationPrompt ? (
          <pre className='mt-4 max-h-72 overflow-auto rounded-lg border border-[var(--border-dark)] bg-black/40 p-4 text-xs text-gray-300'>
            {iterationPrompt}
          </pre>
        ) : null}
      </DesignLabSection>
    </>
  );
}

#!/usr/bin/env node
/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/**
 * EarnedStar @earnedstar.com email DNS on GoDaddy (after Proton domain is added in admin).
 *
 * Prereq: In Proton → Organization → Domain names → Add earnedstar.com
 *         Copy the TXT / CNAME / MX values Proton shows (or pass via env below).
 *
 * GoDaddy API (production keys — store in earnedstar-back/.env.provision.local, never commit):
 *   GODADDY_API_KEY=
 *   GODADDY_API_SECRET=
 *
 * Optional overrides (defaults match Proton Mail standard records):
 *   PROTON_VERIFICATION_TXT=protonmail-verification=...
 *   PROTON_DKIM1_CNAME=protonmail.domainkey....domains.proton.ch.
 *   PROTON_DKIM2_CNAME=...
 *   PROTON_DKIM3_CNAME=...
 *
 * Usage:
 *   node scripts/provision-earnedstar-email-dns.mjs
 *   node scripts/provision-earnedstar-email-dns.mjs --dry-run
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOMAIN = 'earnedstar.com';
const DRY_RUN = process.argv.includes('--dry-run');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx);
    let val = trimmed.slice(idx + 1);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function loadEnv() {
  return {
    ...loadEnvFile(path.join(ROOT, '.env.provision.local')),
    ...loadEnvFile(path.join(ROOT, '.env')),
    ...process.env,
  };
}

async function godaddyRequest(env, method, urlPath, body) {
  const key = env.GODADDY_API_KEY?.trim();
  const secret = env.GODADDY_API_SECRET?.trim();
  if (!key || !secret) {
    throw new Error('Set GODADDY_API_KEY and GODADDY_API_SECRET in .env.provision.local');
  }
  const url = `https://api.godaddy.com${urlPath}`;
  if (DRY_RUN) {
    console.log(`[dry-run] ${method} ${url}`, body ? JSON.stringify(body).slice(0, 200) : '');
    return null;
  }
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `sso-key ${key}:${secret}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GoDaddy ${method} ${urlPath} → ${res.status}: ${text}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function upsertRecords(env, type, name, records) {
  const encodedName = encodeURIComponent(name);
  await godaddyRequest(env, 'PUT', `/v1/domains/${DOMAIN}/records/${type}/${encodedName}`, records);
  console.log(`  ✓ ${type} ${name || '@'}`);
}

async function main() {
  const env = loadEnv();
  const verification = env.PROTON_VERIFICATION_TXT?.trim();
  if (!verification) {
    console.error(
      'Missing PROTON_VERIFICATION_TXT.\n' +
        'Add earnedstar.com in Proton admin first, then paste the protonmail-verification TXT value into .env.provision.local',
    );
    process.exit(1);
  }

  const dkim1 = env.PROTON_DKIM1_CNAME?.trim();
  const dkim2 = env.PROTON_DKIM2_CNAME?.trim();
  const dkim3 = env.PROTON_DKIM3_CNAME?.trim();
  if (!dkim1 || !dkim2 || !dkim3) {
    console.error('Set PROTON_DKIM1_CNAME, PROTON_DKIM2_CNAME, PROTON_DKIM3_CNAME from Proton domain setup.');
    process.exit(1);
  }

  console.log(`Provisioning Proton mail DNS for ${DOMAIN}${DRY_RUN ? ' (dry-run)' : ''}…`);

  await upsertRecords(env, 'TXT', '@', [{ data: verification, ttl: 600 }]);
  await upsertRecords(env, 'TXT', '@', [
    { data: 'v=spf1 include:_spf.protonmail.ch ~all', ttl: 600 },
  ]);
  await upsertRecords(env, 'TXT', '_dmarc', [
    { data: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@earnedstar.com', ttl: 600 },
  ]);
  await upsertRecords(env, 'MX', '@', [
    { data: 'mail.protonmail.ch', priority: 10, ttl: 600 },
    { data: 'mailsec.protonmail.ch', priority: 20, ttl: 600 },
  ]);
  await upsertRecords(env, 'CNAME', 'protonmail._domainkey', [{ data: dkim1, ttl: 600 }]);
  await upsertRecords(env, 'CNAME', 'protonmail2._domainkey', [{ data: dkim2, ttl: 600 }]);
  await upsertRecords(env, 'CNAME', 'protonmail3._domainkey', [{ data: dkim3, ttl: 600 }]);

  console.log('Done. Verify domain in Proton admin, then create invitations@ and support@ users.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

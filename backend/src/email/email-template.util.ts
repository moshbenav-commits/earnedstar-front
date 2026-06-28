/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const TEMPLATE_NAMES = ['review-request', 'review-reminder', 'response-notification'] as const;

export type EmailTemplateName = (typeof TEMPLATE_NAMES)[number];

function emailsDir(): string {
  const candidates = [
    join(process.cwd(), 'emails'),
    join(__dirname, '..', '..', 'emails'),
    join(__dirname, '..', '..', '..', 'emails'),
  ];
  for (const dir of candidates) {
    if (existsSync(join(dir, 'review-request.html'))) return dir;
  }
  return candidates[0]!;
}

export function renderEmailTemplate(
  name: EmailTemplateName,
  vars: Record<string, string | number | undefined | null>,
): string {
  const filePath = join(emailsDir(), `${name}.html`);
  let html = readFileSync(filePath, 'utf8');
  for (const [key, value] of Object.entries(vars)) {
    const token = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(token, value == null ? '' : String(value));
  }
  return html;
}

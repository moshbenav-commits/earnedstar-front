/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class IndexNowService {
  private readonly logger = new Logger(IndexNowService.name);

  private siteUrl(): string {
    return (process.env.EARNEDSTAR_SITE_URL ?? 'https://earnedstar.com').replace(/\/$/, '');
  }

  isEnabled(): boolean {
    return Boolean(process.env.INDEXNOW_API_KEY?.trim());
  }

  profileUrl(slug: string): string {
    return `${this.siteUrl()}/reviews/${slug}`;
  }

  keyLocation(): string {
    return `${this.siteUrl()}/indexnow-key.txt`;
  }

  /** Fire-and-forget IndexNow ping for a merchant Review Profile. */
  async pingProfile(slug: string): Promise<void> {
    if (!this.isEnabled()) return;
    const url = this.profileUrl(slug);
    try {
      const host = new URL(this.siteUrl()).host;
      const key = process.env.INDEXNOW_API_KEY!.trim();
      const res = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host,
          key,
          keyLocation: this.keyLocation(),
          urlList: [url],
        }),
      });
      if (!res.ok) {
        this.logger.warn(`IndexNow ping failed (${res.status}) for ${url}`);
      } else {
        this.logger.log(`IndexNow pinged ${url}`);
      }
    } catch (err) {
      this.logger.warn(`IndexNow ping error for ${url}: ${err instanceof Error ? err.message : err}`);
    }
  }

  async pingAll(urls: string[]): Promise<{ ok: boolean; count: number }> {
    if (!this.isEnabled() || urls.length === 0) {
      return { ok: false, count: 0 };
    }
    const host = new URL(this.siteUrl()).host;
    const key = process.env.INDEXNOW_API_KEY!.trim();
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation: this.keyLocation(),
        urlList: urls.slice(0, 10000),
      }),
    });
    return { ok: res.ok, count: urls.length };
  }
}

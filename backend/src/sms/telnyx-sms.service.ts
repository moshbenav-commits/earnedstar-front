/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const TELNYX_MESSAGES_URL = 'https://api.telnyx.com/v2/messages';

@Injectable()
export class TelnyxSmsService {
  private readonly logger = new Logger(TelnyxSmsService.name);

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.apiKey() && this.fromNumber());
  }

  private apiKey(): string {
    return this.config.get<string>('TELNYX_API_KEY')?.trim() ?? '';
  }

  private fromNumber(): string {
    return (
      this.config.get<string>('TELNYX_SMS_FROM_NUMBER')?.trim() ||
      this.config.get<string>('TELNYX_BRAND_TOLLFREE')?.trim() ||
      ''
    );
  }

  private messagingProfileId(): string | undefined {
    const id = this.config.get<string>('TELNYX_MESSAGING_PROFILE_ID')?.trim();
    return id || undefined;
  }

  normalizePhone(phone: string): string {
    const trimmed = phone.trim();
    if (trimmed.startsWith('+')) return trimmed;
    const digits = trimmed.replace(/\D/g, '');
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    return `+${digits}`;
  }

  async send(to: string, text: string): Promise<{ sent: boolean; messageId?: string; reason?: string }> {
    if (!this.isConfigured()) {
      this.logger.warn('Telnyx SMS not configured — skipping send');
      return { sent: false, reason: 'sms_not_configured' };
    }

    const body: Record<string, unknown> = {
      from: this.fromNumber(),
      to: this.normalizePhone(to),
      text: text.slice(0, 1600),
    };
    const profileId = this.messagingProfileId();
    if (profileId) body.messaging_profile_id = profileId;

    const res = await fetch(TELNYX_MESSAGES_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey()}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    });

    const payload = (await res.json().catch(() => null)) as {
      data?: { id?: string };
      errors?: Array<{ detail?: string; title?: string }>;
    } | null;

    if (!res.ok) {
      const detail =
        payload?.errors?.[0]?.detail ||
        payload?.errors?.[0]?.title ||
        `Telnyx SMS failed (${res.status})`;
      this.logger.error(detail);
      return { sent: false, reason: detail };
    }

    return { sent: true, messageId: payload?.data?.id };
  }
}

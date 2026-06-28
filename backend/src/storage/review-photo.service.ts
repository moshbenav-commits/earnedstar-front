/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

@Injectable()
export class ReviewPhotoService {
  private readonly logger = new Logger(ReviewPhotoService.name);

  constructor(private readonly config: ConfigService) {}

  private supabaseUrl(): string | null {
    return this.config.get<string>('SUPABASE_URL')?.replace(/\/$/, '') ?? null;
  }

  private serviceRoleKey(): string | null {
    return this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY')?.trim() ?? null;
  }

  isConfigured(): boolean {
    return Boolean(this.supabaseUrl() && this.serviceRoleKey());
  }

  async uploadFromBase64(input: {
    businessId: string;
    filename: string;
    contentType: string;
    dataBase64: string;
  }): Promise<string> {
    if (!ALLOWED_TYPES.has(input.contentType)) {
      throw new BadRequestException('Only JPEG, PNG, WebP, and GIF images are allowed');
    }

    const buffer = Buffer.from(input.dataBase64, 'base64');
    if (buffer.length > MAX_BYTES) {
      throw new BadRequestException('Image must be 2 MB or smaller');
    }

    const ext = input.contentType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg';
    const objectPath = `${input.businessId}/${randomUUID()}.${ext}`;

    if (!this.isConfigured()) {
      this.logger.warn('Supabase storage not configured — returning data URL fallback');
      return `data:${input.contentType};base64,${input.dataBase64}`;
    }

    const base = this.supabaseUrl()!;
    const key = this.serviceRoleKey()!;
    const res = await fetch(`${base}/storage/v1/object/review-photos/${objectPath}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': input.contentType,
        'x-upsert': 'false',
      },
      body: buffer,
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => res.statusText);
      this.logger.error(`Storage upload failed: ${detail}`);
      throw new BadRequestException('Failed to upload photo');
    }

    return `${base}/storage/v1/object/public/review-photos/${objectPath}`;
  }
}

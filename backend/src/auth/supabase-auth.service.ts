/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type SupabaseAuthUser = {
  id: string;
  email?: string;
};

@Injectable()
export class SupabaseAuthService {
  private readonly supabaseUrl: string | null;
  private readonly serviceRoleKey: string | null;
  private readonly webhookSecret: string | null;

  constructor(private readonly config: ConfigService) {
    this.supabaseUrl = this.config.get<string>('SUPABASE_URL')?.replace(/\/$/, '') ?? null;
    this.serviceRoleKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY')?.trim() ?? null;
    this.webhookSecret = this.config.get<string>('EARNEDSTAR_WEBHOOK_SECRET')?.trim() ?? null;
  }

  isConfigured(): boolean {
    return Boolean(this.supabaseUrl && this.serviceRoleKey);
  }

  webhookSecretMatches(header: string | undefined): boolean {
    if (!this.webhookSecret) return false;
    return header === this.webhookSecret;
  }

  async verifyAccessToken(token: string | undefined): Promise<SupabaseAuthUser> {
    if (!token?.trim()) {
      throw new UnauthorizedException('Missing access token');
    }

    if (!this.isConfigured()) {
      if (process.env.EARNEDSTAR_AUTH_DEV_BYPASS === '1') {
        return { id: 'dev-owner', email: 'dev@earnedstar.local' };
      }
      throw new UnauthorizedException('Auth not configured');
    }

    const res = await fetch(`${this.supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: this.serviceRoleKey!,
      },
    });

    if (!res.ok) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const data = (await res.json()) as { id?: string; email?: string };
    if (!data.id) throw new UnauthorizedException('Invalid session user');
    return { id: data.id, email: data.email };
  }
}

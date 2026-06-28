/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type AuthorizeNetEnv = 'production' | 'sandbox';

type OpaqueData = {
  dataDescriptor: string;
  dataValue: string;
};

type ApiResponse = {
  subscriptionId?: string;
  profile?: { customerProfileId?: string; customerPaymentProfileId?: string };
  messages?: {
    resultCode?: string;
    message?: Array<{ code?: string; text?: string }>;
  };
};

@Injectable()
export class AuthorizeNetService {
  private readonly logger = new Logger(AuthorizeNetService.name);
  private readonly apiLoginId: string | null;
  private readonly transactionKey: string | null;
  private readonly env: AuthorizeNetEnv;

  constructor(private readonly config: ConfigService) {
    this.apiLoginId = this.config.get<string>('AUTHNET_API_LOGIN_ID')?.trim() ?? null;
    this.transactionKey = this.config.get<string>('AUTHNET_TRANSACTION_KEY')?.trim() ?? null;
    const rawEnv = this.config.get<string>('AUTHNET_ENV')?.trim().toLowerCase();
    this.env = rawEnv === 'sandbox' ? 'sandbox' : 'production';
  }

  isConfigured(): boolean {
    return Boolean(this.apiLoginId && this.transactionKey);
  }

  getPublicConfig(): {
    apiLoginId: string;
    publicClientKey: string;
    env: AuthorizeNetEnv;
  } | null {
    const publicClientKey = this.config.get<string>('AUTHNET_PUBLIC_CLIENT_KEY')?.trim() ?? null;
    if (!this.apiLoginId || !publicClientKey) return null;
    return { apiLoginId: this.apiLoginId, publicClientKey, env: this.env };
  }

  private apiUrl(): string {
    return this.env === 'sandbox'
      ? 'https://apitest.authorize.net/xml/v1/request.api'
      : 'https://api.authorize.net/xml/v1/request.api';
  }

  private async postApi(body: Record<string, unknown>): Promise<ApiResponse> {
    const res = await fetch(this.apiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new ServiceUnavailableException(`Authorize.net HTTP ${res.status}`);
    }
    return (await res.json()) as ApiResponse;
  }

  planAmountCents(plan: string): number {
    const map: Record<string, number> = {
      starter: 2900,
      growth: 9900,
      pro: 24900,
      agency: 49900,
    };
    return map[plan] ?? 9900;
  }

  async createArbSubscription(params: {
    plan: string;
    opaqueData: OpaqueData;
    customerEmail: string;
    customerName?: string;
    businessId: string;
  }) {
    if (!this.isConfigured()) {
      if (process.env.EARNEDSTAR_BILLING_DEV_BYPASS === '1') {
        return {
          subscriptionId: `dev-sub-${Date.now()}`,
          customerProfileId: `dev-profile-${params.businessId}`,
          mode: 'dev-bypass' as const,
        };
      }
      throw new ServiceUnavailableException(
        'Billing not configured (AUTHNET_API_LOGIN_ID / AUTHNET_TRANSACTION_KEY)',
      );
    }

    const amount = (this.planAmountCents(params.plan) / 100).toFixed(2);
    const interval = { length: 1, unit: 'months' };
    const body = {
      ARBCreateSubscriptionRequest: {
        merchantAuthentication: {
          name: this.apiLoginId,
          transactionKey: this.transactionKey,
        },
        subscription: {
          name: `EarnedStar ${params.plan}`,
          paymentSchedule: {
            interval,
            startDate: new Date().toISOString().slice(0, 10),
            totalOccurrences: 9999,
          },
          amount,
          payment: {
            opaqueData: {
              dataDescriptor: params.opaqueData.dataDescriptor,
              dataValue: params.opaqueData.dataValue,
            },
          },
          customer: {
            email: params.customerEmail,
            ...(params.customerName ? { id: params.customerName.slice(0, 20) } : {}),
          },
          order: {
            invoiceNumber: params.businessId.slice(0, 20),
            description: `EarnedStar ${params.plan} plan`,
          },
        },
      },
    };

    const response = await this.postApi(body);
    if (response.messages?.resultCode !== 'Ok' || !response.subscriptionId) {
      const msg =
        response.messages?.message?.[0]?.text ?? 'Authorize.net subscription failed';
      this.logger.error(msg);
      throw new ServiceUnavailableException(msg);
    }

    return {
      subscriptionId: response.subscriptionId,
      customerProfileId: response.profile?.customerProfileId ?? null,
      mode: 'live' as const,
    };
  }
}

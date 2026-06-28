/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmtpEmailService } from './smtp-email.service';
import { renderEmailTemplate } from './email-template.util';

@Injectable()
export class InvitationEmailService {
  private readonly logger = new Logger(InvitationEmailService.name);
  private readonly resendApiKey: string | null;
  private readonly resendFrom: string;
  private readonly siteUrl: string;

  constructor(
    private readonly smtp: SmtpEmailService,
    private readonly config: ConfigService,
  ) {
    this.resendApiKey = this.config.get<string>('RESEND_API_KEY')?.trim() ?? null;
    this.resendFrom =
      this.config.get<string>('RESEND_FROM')?.trim() ??
      'EarnedStar <invitations@earnedstar.com>';
    this.siteUrl = this.config.get<string>('EARNEDSTAR_SITE_URL')?.trim() ?? 'https://earnedstar.com';
  }

  isConfigured(): boolean {
    return this.smtp.isConfigured() || Boolean(this.resendApiKey);
  }

  async sendReviewInvitation(params: {
    to: string;
    merchantName: string;
    submitUrl: string;
    orderId: string;
    customerName?: string;
    fromName?: string;
    subjectTemplate?: string;
    productName?: string;
    logoUrl?: string;
    vehicleMake?: string;
  }): Promise<boolean> {
    const customerName = params.customerName ?? 'there';
    const subject =
      params.subjectTemplate
        ?.replace(/\{business\}/gi, params.merchantName)
        .replace(/\{order\}/gi, params.orderId)
        .trim() || `How did your ${params.productName ?? 'order'} work out?`;

    const html = renderEmailTemplate('review-request', {
      customer_name: customerName,
      business_name: params.merchantName,
      product_name: params.productName ?? `Order ${params.orderId}`,
      order_id: params.orderId,
      submit_url: params.submitUrl,
      brand_color: '#0F2044',
      logo_url: params.logoUrl ?? `${this.siteUrl}/apple-icon`,
      vehicle_make: params.vehicleMake ?? 'vehicle',
      unsubscribe_url: `${this.siteUrl}/support`,
      privacy_url: `${this.siteUrl}/privacy`,
    });

    const text = `Hi ${customerName},\n\nShare your verified review for order ${params.orderId} from ${params.merchantName}:\n${params.submitUrl}\n\nEarnedStar`;

    return this.deliver({
      to: params.to,
      subject,
      html,
      text,
      fromName: params.fromName,
    });
  }

  async sendReviewReminder(params: {
    to: string;
    merchantName: string;
    submitUrl: string;
    customerName?: string;
    productName?: string;
    vehicleMake?: string;
  }): Promise<boolean> {
    const customerName = params.customerName ?? 'there';
    const subject = `Just a quick reminder — your review for ${params.productName ?? 'your order'}`;

    const html = renderEmailTemplate('review-reminder', {
      customer_name: customerName,
      business_name: params.merchantName,
      product_name: params.productName ?? 'your recent order',
      submit_url: params.submitUrl,
      brand_color: '#0F2044',
      vehicle_make: params.vehicleMake ?? 'vehicle',
    });

    const text = `Hi ${customerName}, reminder to review ${params.productName ?? 'your order'}: ${params.submitUrl}`;

    return this.deliver({ to: params.to, subject, html, text });
  }

  async sendResponseNotification(params: {
    to: string;
    customerName: string;
    merchantName: string;
    productName?: string;
    responseText: string;
    reviewUrl: string;
  }): Promise<boolean> {
    const subject = `${params.merchantName} responded to your review`;

    const html = renderEmailTemplate('response-notification', {
      customer_name: params.customerName,
      business_name: params.merchantName,
      product_name: params.productName ?? 'your order',
      response_text: params.responseText,
      review_url: params.reviewUrl,
    });

    const text = `${params.merchantName} replied to your review: "${params.responseText}"\n${params.reviewUrl}`;

    return this.deliver({ to: params.to, subject, html, text });
  }

  private async deliver(input: {
    to: string;
    subject: string;
    html: string;
    text: string;
    fromName?: string;
  }): Promise<boolean> {
    const smtp = this.smtp.resolveConfig();
    const mailbox = this.extractEmail(smtp.from);
    const fromOverride = input.fromName ? `The ${input.fromName} Team <${mailbox}>` : undefined;

    if (this.smtp.isConfigured()) {
      const result = await this.smtp.send({
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        from: fromOverride,
      });
      if (result.sent) return true;
      this.logger.warn(`SMTP failed (${result.reason}) — trying Resend fallback if configured`);
    }

    if (this.resendApiKey) {
      return this.sendViaResend(input.to, input.subject, input.html);
    }

    this.logger.warn(`No email provider — skipped send to ${input.to}`);
    return false;
  }

  private extractEmail(from: string): string {
    const m = from.match(/<([^>]+)>/);
    return m?.[1] ?? from;
  }

  private async sendViaResend(to: string, subject: string, html: string): Promise<boolean> {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.resendFrom,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      this.logger.error(`Resend failed for ${to}: ${await res.text()}`);
      return false;
    }
    return true;
  }
}

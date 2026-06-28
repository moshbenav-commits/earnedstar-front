/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  replyTo?: string;
  source: 'environment' | 'none';
};

/**
 * Mail Gorilla–compatible SMTP (same env contract as expedia-parts-back MailGorillaSettingsService).
 * Use a dedicated EarnedStar mailbox, e.g. invitations@earnedstar.com via Proton/Google SMTP.
 */
@Injectable()
export class SmtpEmailService {
  private readonly logger = new Logger(SmtpEmailService.name);
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null = null;
  private transporterKey = '';

  constructor(private readonly config: ConfigService) {}

  resolveConfig(): SmtpConfig {
    const host = this.config.get<string>('SMTP_HOST')?.trim() ?? '';
    if (!host) {
      return {
        host: '',
        port: 587,
        user: '',
        pass: '',
        from: 'EarnedStar <invitations@earnedstar.com>',
        source: 'none',
      };
    }

    const port = Number(this.config.get<string>('SMTP_PORT') ?? 587) || 587;
    return {
      host,
      port,
      user: this.config.get<string>('SMTP_USER')?.trim() ?? '',
      pass: this.config.get<string>('SMTP_PASS') ?? '',
      from:
        this.config.get<string>('SMTP_FROM')?.trim() ??
        'EarnedStar Invitations <invitations@earnedstar.com>',
      replyTo: this.config.get<string>('SMTP_REPLY_TO')?.trim() || undefined,
      source: 'environment',
    };
  }

  isConfigured(): boolean {
    const smtp = this.resolveConfig();
    return Boolean(smtp.host && smtp.user && smtp.pass);
  }

  private getTransporter(smtp: SmtpConfig) {
    const key = `${smtp.host}|${smtp.port}|${smtp.user}`;
    if (this.transporter && this.transporterKey === key) return this.transporter;

    this.transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: { user: smtp.user, pass: smtp.pass },
    });
    this.transporterKey = key;
    return this.transporter;
  }

  async send(params: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    from?: string;
    replyTo?: string;
  }): Promise<{ sent: boolean; mode: 'smtp' | 'log'; reason?: string }> {
    const smtp = this.resolveConfig();

    if (!smtp.host) {
      this.logger.warn(
        `SMTP not configured — preview only. To: ${params.to} | Subject: ${params.subject}`,
      );
      return { sent: false, mode: 'log', reason: 'smtp_not_configured' };
    }

    if (!smtp.user || !smtp.pass) {
      this.logger.warn('SMTP_HOST set but SMTP_USER / SMTP_PASS missing');
      return { sent: false, mode: 'log', reason: 'smtp_credentials_missing' };
    }

    try {
      const transporter = this.getTransporter(smtp);
      await transporter.sendMail({
        from: params.from ?? smtp.from,
        to: params.to,
        replyTo: params.replyTo ?? smtp.replyTo,
        subject: params.subject,
        html: params.html,
        text: params.text,
      });
      return { sent: true, mode: 'smtp' };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`SMTP send failed for ${params.to}: ${message}`);
      return { sent: false, mode: 'log', reason: message };
    }
  }
}

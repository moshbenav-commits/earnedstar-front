/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Controller, Get } from '@nestjs/common';
import { SmtpEmailService } from '../email/smtp-email.service';
import { InvitationEmailService } from '../email/invitation-email.service';

@Controller('earnedstar/email')
export class EarnedstarEmailController {
  constructor(
    private readonly smtp: SmtpEmailService,
    private readonly invitations: InvitationEmailService,
  ) {}

  @Get('status')
  status() {
    const smtp = this.smtp.resolveConfig();
    return {
      provider: smtp.source === 'environment' && this.smtp.isConfigured() ? 'smtp' : 'unconfigured',
      smtp: {
        configured: this.smtp.isConfigured(),
        host: smtp.host || null,
        from: smtp.from,
        replyTo: smtp.replyTo ?? null,
      },
      invitationsReady: this.invitations.isConfigured(),
      hint: this.smtp.isConfigured()
        ? 'Mail Gorilla SMTP ready — invitations@earnedstar.com'
        : 'Set SMTP_HOST, SMTP_USER, SMTP_PASS on earnedstar-back Vercel',
    };
  }
}

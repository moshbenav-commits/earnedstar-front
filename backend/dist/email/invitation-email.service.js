"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InvitationEmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationEmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const smtp_email_service_1 = require("./smtp-email.service");
const email_template_util_1 = require("./email-template.util");
let InvitationEmailService = InvitationEmailService_1 = class InvitationEmailService {
    constructor(smtp, config) {
        this.smtp = smtp;
        this.config = config;
        this.logger = new common_1.Logger(InvitationEmailService_1.name);
        this.resendApiKey = this.config.get('RESEND_API_KEY')?.trim() ?? null;
        this.resendFrom =
            this.config.get('RESEND_FROM')?.trim() ??
                'EarnedStar <invitations@earnedstar.com>';
        this.siteUrl = this.config.get('EARNEDSTAR_SITE_URL')?.trim() ?? 'https://earnedstar.com';
    }
    isConfigured() {
        return this.smtp.isConfigured() || Boolean(this.resendApiKey);
    }
    async sendReviewInvitation(params) {
        const customerName = params.customerName ?? 'there';
        const subject = params.subjectTemplate
            ?.replace(/\{business\}/gi, params.merchantName)
            .replace(/\{order\}/gi, params.orderId)
            .trim() || `How did your ${params.productName ?? 'order'} work out?`;
        const html = (0, email_template_util_1.renderEmailTemplate)('review-request', {
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
    async sendReviewReminder(params) {
        const customerName = params.customerName ?? 'there';
        const subject = `Just a quick reminder — your review for ${params.productName ?? 'your order'}`;
        const html = (0, email_template_util_1.renderEmailTemplate)('review-reminder', {
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
    async sendResponseNotification(params) {
        const subject = `${params.merchantName} responded to your review`;
        const html = (0, email_template_util_1.renderEmailTemplate)('response-notification', {
            customer_name: params.customerName,
            business_name: params.merchantName,
            product_name: params.productName ?? 'your order',
            response_text: params.responseText,
            review_url: params.reviewUrl,
        });
        const text = `${params.merchantName} replied to your review: "${params.responseText}"\n${params.reviewUrl}`;
        return this.deliver({ to: params.to, subject, html, text });
    }
    async deliver(input) {
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
            if (result.sent)
                return true;
            this.logger.warn(`SMTP failed (${result.reason}) — trying Resend fallback if configured`);
        }
        if (this.resendApiKey) {
            return this.sendViaResend(input.to, input.subject, input.html);
        }
        this.logger.warn(`No email provider — skipped send to ${input.to}`);
        return false;
    }
    extractEmail(from) {
        const m = from.match(/<([^>]+)>/);
        return m?.[1] ?? from;
    }
    async sendViaResend(to, subject, html) {
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
};
exports.InvitationEmailService = InvitationEmailService;
exports.InvitationEmailService = InvitationEmailService = InvitationEmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [smtp_email_service_1.SmtpEmailService,
        config_1.ConfigService])
], InvitationEmailService);
//# sourceMappingURL=invitation-email.service.js.map
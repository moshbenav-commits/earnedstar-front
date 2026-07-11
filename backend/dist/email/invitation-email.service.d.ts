import { ConfigService } from '@nestjs/config';
import { SmtpEmailService } from './smtp-email.service';
export declare class InvitationEmailService {
    private readonly smtp;
    private readonly config;
    private readonly logger;
    private readonly resendApiKey;
    private readonly resendFrom;
    private readonly siteUrl;
    constructor(smtp: SmtpEmailService, config: ConfigService);
    isConfigured(): boolean;
    sendReviewInvitation(params: {
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
    }): Promise<boolean>;
    sendReviewReminder(params: {
        to: string;
        merchantName: string;
        submitUrl: string;
        customerName?: string;
        productName?: string;
        vehicleMake?: string;
    }): Promise<boolean>;
    sendResponseNotification(params: {
        to: string;
        customerName: string;
        merchantName: string;
        productName?: string;
        responseText: string;
        reviewUrl: string;
    }): Promise<boolean>;
    private deliver;
    private extractEmail;
    private sendViaResend;
}

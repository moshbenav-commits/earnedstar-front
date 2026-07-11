import { SmtpEmailService } from '../email/smtp-email.service';
import { InvitationEmailService } from '../email/invitation-email.service';
export declare class EarnedstarEmailController {
    private readonly smtp;
    private readonly invitations;
    constructor(smtp: SmtpEmailService, invitations: InvitationEmailService);
    status(): {
        provider: string;
        smtp: {
            configured: boolean;
            host: string | null;
            from: string;
            replyTo: string | null;
        };
        invitationsReady: boolean;
        hint: string;
    };
}

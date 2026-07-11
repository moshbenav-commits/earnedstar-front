import { ConfigService } from '@nestjs/config';
export declare class TelnyxSmsService {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    isConfigured(): boolean;
    private apiKey;
    private fromNumber;
    private messagingProfileId;
    normalizePhone(phone: string): string;
    send(to: string, text: string): Promise<{
        sent: boolean;
        messageId?: string;
        reason?: string;
    }>;
}

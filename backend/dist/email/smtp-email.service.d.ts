import { ConfigService } from '@nestjs/config';
export type SmtpConfig = {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
    replyTo?: string;
    source: 'environment' | 'none';
};
export declare class SmtpEmailService {
    private readonly config;
    private readonly logger;
    private transporter;
    private transporterKey;
    constructor(config: ConfigService);
    resolveConfig(): SmtpConfig;
    isConfigured(): boolean;
    private getTransporter;
    send(params: {
        to: string;
        subject: string;
        html: string;
        text?: string;
        from?: string;
        replyTo?: string;
    }): Promise<{
        sent: boolean;
        mode: 'smtp' | 'log';
        reason?: string;
    }>;
}

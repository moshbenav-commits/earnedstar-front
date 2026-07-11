import { ConfigService } from '@nestjs/config';
type AuthorizeNetEnv = 'production' | 'sandbox';
type OpaqueData = {
    dataDescriptor: string;
    dataValue: string;
};
export declare class AuthorizeNetService {
    private readonly config;
    private readonly logger;
    private readonly apiLoginId;
    private readonly transactionKey;
    private readonly env;
    constructor(config: ConfigService);
    isConfigured(): boolean;
    getPublicConfig(): {
        apiLoginId: string;
        publicClientKey: string;
        env: AuthorizeNetEnv;
    } | null;
    private apiUrl;
    private postApi;
    planAmountCents(plan: string): number;
    createArbSubscription(params: {
        plan: string;
        opaqueData: OpaqueData;
        customerEmail: string;
        customerName?: string;
        businessId: string;
    }): Promise<{
        subscriptionId: string;
        customerProfileId: string;
        mode: "dev-bypass";
    } | {
        subscriptionId: string;
        customerProfileId: string | null;
        mode: "live";
    }>;
}
export {};

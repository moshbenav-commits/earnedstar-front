import { ConfigService } from '@nestjs/config';
export type SupabaseAuthUser = {
    id: string;
    email?: string;
};
export declare class SupabaseAuthService {
    private readonly config;
    private readonly supabaseUrl;
    private readonly serviceRoleKey;
    private readonly webhookSecret;
    constructor(config: ConfigService);
    isConfigured(): boolean;
    webhookSecretMatches(header: string | undefined): boolean;
    verifyAccessToken(token: string | undefined): Promise<SupabaseAuthUser>;
}

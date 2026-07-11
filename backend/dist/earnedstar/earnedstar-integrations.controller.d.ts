import { EarnedstarService } from './earnedstar.service';
import { ConnectShopifyDto } from './dto/earnedstar.dto';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';
export declare class EarnedstarIntegrationsController {
    private readonly earnedstar;
    constructor(earnedstar: EarnedstarService);
    status(req: {
        merchantUser: SupabaseAuthUser;
    }): Promise<{
        connected: boolean;
        shop: null;
        webhookUrl: string;
        installSteps: string[];
        merchantSlug?: undefined;
        webhookSecretEnv?: undefined;
    } | {
        connected: boolean;
        shop: string | null;
        merchantSlug: string;
        webhookUrl: string;
        webhookSecretEnv: string;
        installSteps?: undefined;
    }>;
    connect(req: {
        merchantUser: SupabaseAuthUser;
    }, dto: ConnectShopifyDto): Promise<{
        ok: boolean;
        shop: string;
        status: string;
    }>;
}

import { AuthorizeNetService } from '../payments/authorize-net.service';
import { EarnedstarService } from './earnedstar.service';
import { SubscribeBillingDto } from './dto/earnedstar.dto';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';
export declare class EarnedstarBillingController {
    private readonly authorizeNet;
    private readonly earnedstar;
    constructor(authorizeNet: AuthorizeNetService, earnedstar: EarnedstarService);
    status(): {
        provider: string;
        mode: string;
        ready: boolean;
        acceptJs: boolean;
        publicConfig: {
            apiLoginId: string;
            publicClientKey: string;
            env: "production" | "sandbox";
        } | undefined;
    };
    publicConfig(): {
        apiLoginId: string;
        publicClientKey: string;
        env: "production" | "sandbox";
    } | {
        configured: boolean;
    };
    subscribe(req: {
        merchantUser: SupabaseAuthUser;
    }, dto: SubscribeBillingDto): Promise<{
        plan: string;
        subscriptionId: string;
        customerProfileId: string;
        mode: "dev-bypass";
        ok: boolean;
    } | {
        plan: string;
        subscriptionId: string;
        customerProfileId: string | null;
        mode: "live";
        ok: boolean;
    }>;
    authorizeNetWebhook(body: Record<string, unknown>): {
        ok: boolean;
        received: boolean;
        event: {};
    };
}

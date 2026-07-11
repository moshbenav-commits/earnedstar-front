import { EarnedstarService } from './earnedstar.service';
import { OrderFulfilledWebhookDto } from './dto/earnedstar.dto';
import { SupabaseAuthService } from '../auth/supabase-auth.service';
export declare class EarnedstarWebhooksController {
    private readonly earnedstar;
    private readonly auth;
    constructor(earnedstar: EarnedstarService, auth: SupabaseAuthService);
    orderFulfilled(secret: string | undefined, dto: OrderFulfilledWebhookDto): Promise<{
        success: boolean;
        request_id: string | undefined;
        status: string;
        submitUrl: string;
    }>;
}

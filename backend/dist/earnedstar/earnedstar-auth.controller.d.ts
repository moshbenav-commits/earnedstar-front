import { EarnedstarService } from './earnedstar.service';
import { ProvisionMerchantDto, UpdateMerchantProfileDto } from './dto/earnedstar.dto';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';
export declare class EarnedstarAuthController {
    private readonly earnedstar;
    constructor(earnedstar: EarnedstarService);
    me(req: {
        merchantUser: SupabaseAuthUser;
    }): Promise<import("./earnedstar.service").EarnedStarMerchant>;
    provision(dto: ProvisionMerchantDto): Promise<{
        ok: boolean;
        merchantId: string;
        slug: string;
        existing: boolean;
    } | {
        ok: boolean;
        merchantId: string | undefined;
        slug: string | undefined;
        existing?: undefined;
    }>;
    updateProfile(req: {
        merchantUser: SupabaseAuthUser;
    }, dto: UpdateMerchantProfileDto): Promise<{
        ok: boolean;
        merchant: import("./earnedstar.service").EarnedStarMerchant;
    }>;
}

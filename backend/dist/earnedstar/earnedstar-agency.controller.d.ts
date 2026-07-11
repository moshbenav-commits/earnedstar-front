import { EarnedstarService } from './earnedstar.service';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';
import { CompleteOnboardingDto, CreateAgencyClientDto } from './dto/earnedstar.dto';
export declare class EarnedstarAgencyController {
    private readonly earnedstar;
    constructor(earnedstar: EarnedstarService);
    list(req: {
        merchantUser: SupabaseAuthUser;
    }): Promise<import("pg").QueryResultRow[]>;
    create(req: {
        merchantUser: SupabaseAuthUser;
    }, dto: CreateAgencyClientDto): Promise<{
        ok: boolean;
        slug: string;
        name: string;
        clientId?: undefined;
    } | {
        ok: boolean;
        clientId: string | undefined;
        slug: string | undefined;
        name: string;
    }>;
}
export declare class EarnedstarOnboardingController {
    private readonly earnedstar;
    constructor(earnedstar: EarnedstarService);
    status(req: {
        merchantUser: SupabaseAuthUser;
    }): Promise<{
        completed: boolean;
        step: number;
    }>;
    complete(req: {
        merchantUser: SupabaseAuthUser;
    }, dto: CompleteOnboardingDto): Promise<{
        ok: boolean;
        completed: boolean;
        slug?: undefined;
    } | {
        ok: boolean;
        completed: boolean;
        slug: string;
    }>;
}

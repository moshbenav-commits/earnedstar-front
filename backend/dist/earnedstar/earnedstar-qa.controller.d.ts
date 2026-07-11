import { EarnedstarService } from './earnedstar.service';
import { CreateQaItemDto, PublicAskQaDto, UpdateQaItemDto } from './dto/earnedstar.dto';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';
export declare class EarnedstarQaController {
    private readonly earnedstar;
    constructor(earnedstar: EarnedstarService);
    listPublic(slug: string): Promise<import("pg").QueryResultRow[]>;
    askPublic(slug: string, dto: PublicAskQaDto): Promise<{
        ok: boolean;
        id: string | undefined;
    }>;
    list(req: {
        merchantUser: SupabaseAuthUser;
    }): Promise<import("pg").QueryResultRow[]>;
    create(req: {
        merchantUser: SupabaseAuthUser;
    }, dto: CreateQaItemDto): Promise<{
        ok: boolean;
        id: string;
        question: string;
        answer: string | null;
        published: boolean;
    } | {
        ok: boolean;
        id: string | undefined;
        published: boolean;
        question?: undefined;
        answer?: undefined;
    }>;
    update(req: {
        merchantUser: SupabaseAuthUser;
    }, id: string, dto: UpdateQaItemDto): Promise<{
        ok: boolean;
        id: string;
    }>;
    remove(req: {
        merchantUser: SupabaseAuthUser;
    }, id: string): Promise<{
        ok: boolean;
    }>;
}

import { EarnedstarService } from './earnedstar.service';
import { InviteTeamMemberDto } from './dto/earnedstar.dto';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';
export declare class EarnedstarTeamController {
    private readonly earnedstar;
    constructor(earnedstar: EarnedstarService);
    list(req: {
        merchantUser: SupabaseAuthUser;
    }): Promise<{
        seats: {
            used: number;
            limit: 1 | 3 | 10 | -1;
        };
        members: {
            id: string;
            email: string;
            role: string;
            status: string;
        }[];
    } | {
        seats: {
            used: number;
            limit: 1 | 3 | 10 | -1;
        };
        members: {
            status: string;
        }[];
    }>;
    invite(req: {
        merchantUser: SupabaseAuthUser;
    }, dto: InviteTeamMemberDto): Promise<{
        ok: boolean;
        email: string;
        role: "admin" | "viewer";
        status: string;
        id?: undefined;
    } | {
        ok: boolean;
        id: string | undefined;
        email: string;
        role: "admin" | "viewer";
        status: string;
    }>;
    remove(req: {
        merchantUser: SupabaseAuthUser;
    }, id: string): Promise<{
        ok: boolean;
    }>;
}

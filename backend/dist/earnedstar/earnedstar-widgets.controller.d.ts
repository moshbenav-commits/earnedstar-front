import { EarnedstarService } from './earnedstar.service';
import { CreateWidgetDto } from './dto/earnedstar.dto';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';
export declare class EarnedstarWidgetsController {
    private readonly earnedstar;
    constructor(earnedstar: EarnedstarService);
    list(req: {
        merchantUser: SupabaseAuthUser;
    }): Promise<{
        embed_code: string;
        id: string;
        name: string;
        widget_type: string;
        config: Record<string, unknown>;
        created_at: string;
    }[] | ({
        id: string;
        name: string;
        widget_type: string;
        embed_code: string;
        config: {
            color: string;
            size: number;
            max?: undefined;
        };
    } | {
        id: string;
        name: string;
        widget_type: string;
        embed_code: string;
        config: {
            max: number;
            color?: undefined;
            size?: undefined;
        };
    })[]>;
    create(req: {
        merchantUser: SupabaseAuthUser;
    }, dto: CreateWidgetDto): Promise<{
        ok: boolean;
        widget: {
            id: string | undefined;
            name: string;
            widget_type: string;
            config: Record<string, unknown>;
            embed_code: string;
        };
    }>;
    remove(req: {
        merchantUser: SupabaseAuthUser;
    }, widgetId: string): Promise<{
        ok: boolean;
    }>;
}

import { EarnedstarService } from './earnedstar.service';
import { BulkSendInvitationsDto, SendInvitationDto } from './dto/earnedstar.dto';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';
export declare class EarnedstarInvitationsController {
    private readonly earnedstar;
    constructor(earnedstar: EarnedstarService);
    lookup(token: string): Promise<{
        token: string;
        status: string;
        merchant_name: string;
        merchant_slug: string;
        order_id: string;
        customer_name: string | null;
        product_name: string | null;
        purchased_at: string | null;
    } | {
        token: string;
        status: string;
        merchant_name: string;
        merchant_slug: string;
        order_id: string;
    }>;
    send(req: {
        merchantUser: SupabaseAuthUser;
    }, slug: string | undefined, dto: SendInvitationDto): Promise<{
        ok: boolean;
        invitationId: string;
        token: string;
        status: string;
        submitUrl: string;
        channel: "link" | "email" | "sms";
        scheduled?: undefined;
        send_at_days?: undefined;
    } | {
        ok: boolean;
        invitationId: string | undefined;
        token: string | undefined;
        status: string;
        submitUrl: string;
        channel: "link" | "email" | "sms";
        scheduled: boolean;
        send_at_days: number;
    }>;
    bulk(req: {
        merchantUser: SupabaseAuthUser;
    }, slug: string | undefined, dto: BulkSendInvitationsDto): Promise<{
        ok: boolean;
        sent: number;
        failed: number;
        results: {
            order_id: string;
            ok: boolean;
            error?: string;
            submitUrl?: string;
        }[];
    }>;
    resend(req: {
        merchantUser: SupabaseAuthUser;
    }, id: string, slug: string | undefined): Promise<{
        ok: boolean;
        invitationId: string;
        token: string;
        status: string;
        submitUrl: string;
        channel: "link" | "email" | "sms";
        scheduled?: undefined;
        send_at_days?: undefined;
    } | {
        ok: boolean;
        invitationId: string | undefined;
        token: string | undefined;
        status: string;
        submitUrl: string;
        channel: "link" | "email" | "sms";
        scheduled: boolean;
        send_at_days: number;
    }>;
}

import type { Response } from 'express';
import { EarnedstarService } from './earnedstar.service';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';
export declare class EarnedstarDashboardController {
    private readonly earnedstar;
    constructor(earnedstar: EarnedstarService);
    overview(slug?: string): Promise<{
        merchant: import("./earnedstar.service").EarnedStarMerchant;
        stats: {
            totalReviews: number;
            weeklyDeltaPct: number;
            avgRating: number;
            inviteResponseRate: number;
            googleSellerRating: number;
            googleSellerActive: boolean;
        };
        ratingDistribution: {
            stars: number;
            count: number;
            pct: number;
        }[];
        recentReviews: import("./earnedstar.service").EarnedStarReview[];
    }>;
    reviews(slug?: string, limit?: string): Promise<import("./earnedstar.service").EarnedStarReview[]>;
    invitations(slug?: string, limit?: string): Promise<import("pg").QueryResultRow[]>;
    analytics(slug?: string): Promise<{
        invitationTrend: {
            week: string;
            sent: number;
            completed: number;
        }[];
        reviewVelocity: {
            week: string;
            published: number;
            pending: number;
        }[];
        sentiment: {
            positive: number;
            neutral: number;
            negative: number;
        };
    }>;
    exportReviews(req: {
        merchantUser: SupabaseAuthUser;
    }, slug: string | undefined, res: Response): Promise<void>;
    publicSchema(merchantSlug: string): {
        '@context': string;
        '@type': string;
        name: string;
        url: string;
        image: string | undefined;
        aggregateRating: {
            '@type': string;
            ratingValue: number;
            reviewCount: number;
            bestRating: number;
            worstRating: number;
        };
    } | Promise<{
        '@context': string;
        '@type': string;
        name: string;
        url: string;
        image: string | undefined;
        aggregateRating: {
            '@type': string;
            ratingValue: number;
            reviewCount: number;
            bestRating: number;
            worstRating: number;
        };
    }>;
}

import { EarnedstarService } from './earnedstar.service';
import { ModerateReviewDto, RespondReviewDto, SubmitReviewDto, UploadReviewPhotoDto } from './dto/earnedstar.dto';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';
export declare class EarnedstarReviewsController {
    private readonly earnedstar;
    constructor(earnedstar: EarnedstarService);
    embed(apiKey: string): Promise<{
        merchant: {
            name: string;
            slug: string;
            avg_rating: number;
            review_count: number;
            logo_url: string | null;
        };
        reviews: {
            id: string;
            customer_name: string;
            rating_overall: number;
            review_text: string | null;
            created_at: string;
            photos: string[];
        }[];
    }>;
    list(merchantSlug: string, limit?: string, offset?: string, page?: string, sort?: string, minRating?: string, ymmYear?: string, ymmMake?: string, ymmModel?: string, hasPhotos?: string): Promise<import("./earnedstar.service").EarnedStarReview[]>;
    submit(dto: SubmitReviewDto): Promise<{
        ok: boolean;
        reviewId: string;
        status: string;
        message: string;
        fraud_score?: undefined;
    } | {
        ok: boolean;
        reviewId: string | undefined;
        status: "published" | "pending" | "flagged";
        fraud_score: number;
        message?: undefined;
    }>;
    upload(dto: UploadReviewPhotoDto): Promise<{
        ok: boolean;
        url: string;
    }>;
    moderate(req: {
        merchantUser: SupabaseAuthUser;
    }, reviewId: string, dto: ModerateReviewDto): Promise<{
        ok: boolean;
        reviewId: string;
        status: "published" | "rejected";
    }>;
    respond(req: {
        merchantUser: SupabaseAuthUser;
    }, reviewId: string, dto: RespondReviewDto): Promise<{
        ok: boolean;
        reviewId: string;
        business_response: string;
    }>;
}

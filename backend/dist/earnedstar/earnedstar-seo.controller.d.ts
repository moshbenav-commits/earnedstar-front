import { EarnedstarService } from './earnedstar.service';
import { EarnedstarAiSeoService } from './earnedstar-ai-seo.service';
import { SuggestQaAnswerDto } from './dto/earnedstar.dto';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';
export declare class EarnedstarSeoController {
    private readonly earnedstar;
    private readonly aiSeo;
    constructor(earnedstar: EarnedstarService, aiSeo: EarnedstarAiSeoService);
    listSitemapMerchants(): Promise<{
        slug: string;
        lastModified: string;
    }[]>;
    health(req: {
        merchantUser: SupabaseAuthUser;
    }): Promise<{
        profile_url: string;
        checks: {
            profile_indexable: boolean;
            meta_filled: boolean;
            faq_schema: boolean;
            syndication_available: boolean;
            review_summary_fresh: boolean;
        };
        counts: {
            published_reviews: number;
            published_qa: number;
        };
        review_summary_ai: null;
        review_summary_generated_at: null;
        indexnow_enabled: boolean;
        plan_features?: undefined;
    } | {
        profile_url: string;
        checks: {
            profile_indexable: boolean;
            meta_filled: boolean;
            faq_schema: boolean;
            syndication_available: boolean;
            review_summary_fresh: boolean;
        };
        counts: {
            published_reviews: number;
            published_qa: number;
        };
        review_summary_ai: string | null;
        review_summary_generated_at: string | null;
        indexnow_enabled: boolean;
        plan_features: {
            ai_meta_suggestions: boolean;
            ai_review_summary: boolean;
            ai_qa_suggestions: boolean;
        };
    }>;
    suggestMeta(req: {
        merchantUser: SupabaseAuthUser;
    }): Promise<{
        seo_title: string;
        seo_description: string;
        source: "ai";
    } | {
        seo_title: string;
        seo_description: string;
        source: "template";
    }>;
    regenerateSummary(req: {
        merchantUser: SupabaseAuthUser;
    }): Promise<{
        ok: boolean;
        message: string;
        summary?: undefined;
        generated_at?: undefined;
    } | {
        ok: boolean;
        summary: string;
        generated_at: string;
        message?: undefined;
    }>;
    suggestQaAnswer(req: {
        merchantUser: SupabaseAuthUser;
    }, dto: SuggestQaAnswerDto): Promise<{
        draft: string;
        sources: {
            review_ids: string[];
        };
        source: "ai";
    } | {
        draft: string;
        sources: {
            review_ids: string[];
        };
        source: "template";
    }>;
}

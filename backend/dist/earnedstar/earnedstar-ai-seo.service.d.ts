import { PostgresService } from '../database/postgres.service';
import { PlanLimitsService } from './plan-limits.service';
export declare class EarnedstarAiSeoService {
    private readonly postgres;
    private readonly planLimits;
    private readonly logger;
    constructor(postgres: PostgresService, planLimits: PlanLimitsService);
    private model;
    private callLlm;
    private getMerchantContext;
    private getReviewSnippets;
    private getPublishedQaPairs;
    private trim;
    suggestMeta(businessId: string, plan: string): Promise<{
        seo_title: string;
        seo_description: string;
        source: "ai";
    } | {
        seo_title: string;
        seo_description: string;
        source: "template";
    }>;
    suggestQaAnswer(businessId: string, plan: string, question: string): Promise<{
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
    regenerateReviewSummary(businessId: string, plan: string): Promise<{
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
    isSummaryFresh(generatedAt: string | null | undefined): boolean;
}

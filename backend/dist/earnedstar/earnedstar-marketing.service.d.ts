import { PostgresService } from '../database/postgres.service';
export type TrustCounterPayload = {
    verified_reviews: number;
    fraud_blocked_this_month: number;
    avg_dispute_sla_hours: number;
    reviews_ransomed: number;
};
export type ReviewAuditPayload = {
    estimated_fake_review_pct: number;
    risk_level: 'low' | 'moderate' | 'high' | 'critical';
    top_patterns: string[];
    recommendation: string;
};
export declare class EarnedstarMarketingService {
    private readonly postgres;
    private readonly logger;
    constructor(postgres: PostgresService);
    getTrustCounter(): Promise<TrustCounterPayload>;
    runReviewAudit(url: string): Promise<{
        url: string;
        audit: ReviewAuditPayload;
    }>;
    private detectPlatform;
    private fallbackAudit;
    private callAuditLlm;
}

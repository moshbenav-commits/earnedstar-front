"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EarnedstarAiSeoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarnedstarAiSeoService = void 0;
const common_1 = require("@nestjs/common");
const postgres_service_1 = require("../database/postgres.service");
const plan_limits_service_1 = require("./plan-limits.service");
let EarnedstarAiSeoService = EarnedstarAiSeoService_1 = class EarnedstarAiSeoService {
    constructor(postgres, planLimits) {
        this.postgres = postgres;
        this.planLimits = planLimits;
        this.logger = new common_1.Logger(EarnedstarAiSeoService_1.name);
    }
    model() {
        return process.env.EARNEDSTAR_SEO_LLM_MODEL ?? 'gpt-4o-mini';
    }
    async callLlm(system, user) {
        const apiKey = process.env.OPENAI_API_KEY?.trim();
        if (!apiKey)
            return null;
        try {
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.model(),
                    temperature: 0.35,
                    response_format: { type: 'json_object' },
                    messages: [
                        { role: 'system', content: system },
                        { role: 'user', content: user },
                    ],
                }),
            });
            if (!res.ok) {
                this.logger.warn(`OpenAI SEO call failed: ${res.status}`);
                return null;
            }
            const data = (await res.json());
            const content = data.choices?.[0]?.message?.content;
            if (!content)
                return null;
            this.logger.log(`AI SEO tokens: ${data.usage?.total_tokens ?? '?'}`);
            return JSON.parse(content);
        }
        catch (err) {
            this.logger.warn(`OpenAI SEO error: ${err instanceof Error ? err.message : err}`);
            return null;
        }
    }
    async getMerchantContext(businessId) {
        if (!this.postgres.isConfigured())
            return null;
        return this.postgres.queryOne(`SELECT id::text, name, slug, website_url, review_count, avg_rating::float8 AS avg_rating, plan
       FROM businesses WHERE id = $1::uuid LIMIT 1`, [businessId]);
    }
    async getReviewSnippets(businessId, limit = 30) {
        if (!this.postgres.isConfigured())
            return [];
        return this.postgres.queryMany(`SELECT r.id::text, r.rating_overall::float8 AS rating_overall, r.review_text,
              r.review_title, p.name AS product_name
       FROM reviews r
       LEFT JOIN products p ON p.id = r.product_id
       WHERE r.business_id = $1::uuid AND r.status = 'published' AND r.review_text IS NOT NULL
       ORDER BY r.created_at DESC
       LIMIT $2`, [businessId, limit]);
    }
    async getPublishedQaPairs(businessId, limit = 10) {
        if (!this.postgres.isConfigured())
            return [];
        return this.postgres.queryMany(`SELECT question, answer FROM qa_items
       WHERE business_id = $1::uuid AND published = true AND answer IS NOT NULL
       ORDER BY answered_at DESC NULLS LAST LIMIT $2`, [businessId, limit]);
    }
    trim(text, max) {
        const t = text.trim();
        if (t.length <= max)
            return t;
        return `${t.slice(0, max - 1).trim()}…`;
    }
    async suggestMeta(businessId, plan) {
        this.planLimits.assertCanUseAiMeta(plan);
        const merchant = await this.getMerchantContext(businessId);
        if (!merchant)
            throw new Error('Merchant not found');
        const reviews = await this.getReviewSnippets(businessId, 15);
        const themes = reviews
            .slice(0, 5)
            .map((r) => r.review_text?.slice(0, 120))
            .filter(Boolean)
            .join(' | ');
        const system = `You write SEO meta for an e-commerce Review Profile. Output JSON only: {"seo_title":"","seo_description":""}.
Rules: seo_title max 60 chars, seo_description max 155 chars. Mention verified purchase reviews only when grounded in context.
Never invent shipping policies, warranties, or product specs. No competitor names.`;
        const user = JSON.stringify({
            store_name: merchant.name,
            review_count: merchant.review_count,
            avg_rating: merchant.avg_rating,
            sample_review_themes: themes,
        });
        const llm = await this.callLlm(system, user);
        if (llm?.seo_title && llm?.seo_description) {
            return {
                seo_title: this.trim(String(llm.seo_title), 60),
                seo_description: this.trim(String(llm.seo_description), 155),
                source: 'ai',
            };
        }
        const count = merchant.review_count.toLocaleString();
        return {
            seo_title: this.trim(`${merchant.name} Reviews — ${count} Verified | EarnedStar`, 60),
            seo_description: this.trim(`Read ${count} verified purchase reviews of ${merchant.name}. ${merchant.avg_rating}/5 average. Every review tied to a real order.`, 155),
            source: 'template',
        };
    }
    async suggestQaAnswer(businessId, plan, question) {
        this.planLimits.assertCanUseAiQa(plan);
        const merchant = await this.getMerchantContext(businessId);
        if (!merchant)
            throw new Error('Merchant not found');
        const reviews = await this.getReviewSnippets(businessId, 30);
        const qa = await this.getPublishedQaPairs(businessId, 10);
        const system = `You draft a merchant FAQ answer for a Review Profile. Output JSON only: {"draft":"","review_ids":[]}.
Rules: 2-4 sentences, helpful and factual. Use only facts from provided reviews and Q&A. 
Include review_ids (array of id strings) that informed the answer. Never invent policies or guarantees.
Mention "verified purchase" only if supported by review context.`;
        const user = JSON.stringify({
            store_name: merchant.name,
            question: question.trim(),
            reviews: reviews.map((r) => ({
                id: r.id,
                rating: r.rating_overall,
                product: r.product_name,
                text: r.review_text?.slice(0, 280),
            })),
            existing_qa: qa,
        });
        const llm = await this.callLlm(system, user);
        if (llm?.draft) {
            const ids = Array.isArray(llm.review_ids)
                ? llm.review_ids.map(String).filter((id) => reviews.some((r) => r.id === id))
                : reviews.slice(0, 3).map((r) => r.id);
            return {
                draft: String(llm.draft).trim(),
                sources: { review_ids: ids },
                source: 'ai',
            };
        }
        const top = reviews[0];
        const draft = top
            ? `Based on verified customer feedback, shoppers often mention: "${this.trim(top.review_text ?? '', 140)}" We invite you to browse our published reviews for more detail.`
            : `Thanks for your question. We're gathering more verified reviews to answer this accurately — check back soon or contact us through our website.`;
        return {
            draft,
            sources: { review_ids: top ? [top.id] : [] },
            source: 'template',
        };
    }
    async regenerateReviewSummary(businessId, plan) {
        this.planLimits.assertCanUseAiReviewSummary(plan);
        const merchant = await this.getMerchantContext(businessId);
        if (!merchant)
            throw new Error('Merchant not found');
        if (merchant.review_count < 5) {
            return { ok: false, message: 'At least 5 published reviews required' };
        }
        const reviews = await this.getReviewSnippets(businessId, 40);
        const system = `Write a 1-2 sentence "What customers say" summary for a store Review Profile. Output JSON: {"summary":""}.
Rules: Neutral, third-person, grounded only in review snippets. No invented claims. Max 220 chars.`;
        const user = JSON.stringify({
            store_name: merchant.name,
            avg_rating: merchant.avg_rating,
            review_count: merchant.review_count,
            snippets: reviews.map((r) => ({
                rating: r.rating_overall,
                text: r.review_text?.slice(0, 200),
            })),
        });
        const llm = await this.callLlm(system, user);
        let summary;
        if (llm?.summary) {
            summary = this.trim(String(llm.summary), 220);
        }
        else {
            const positive = reviews.filter((r) => r.rating_overall >= 4).length;
            const pct = Math.round((positive / Math.max(reviews.length, 1)) * 100);
            summary = `Customers rate ${merchant.name} ${merchant.avg_rating}/5 across ${merchant.review_count.toLocaleString()} verified reviews — ${pct}% of recent feedback is 4–5 stars.`;
        }
        if (this.postgres.isConfigured()) {
            await this.postgres.query(`UPDATE businesses SET review_summary_ai = $2, review_summary_generated_at = now() WHERE id = $1::uuid`, [businessId, summary]);
        }
        return { ok: true, summary, generated_at: new Date().toISOString() };
    }
    isSummaryFresh(generatedAt) {
        if (!generatedAt)
            return false;
        const ageMs = Date.now() - new Date(generatedAt).getTime();
        return ageMs < 30 * 24 * 60 * 60 * 1000;
    }
};
exports.EarnedstarAiSeoService = EarnedstarAiSeoService;
exports.EarnedstarAiSeoService = EarnedstarAiSeoService = EarnedstarAiSeoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [postgres_service_1.PostgresService,
        plan_limits_service_1.PlanLimitsService])
], EarnedstarAiSeoService);
//# sourceMappingURL=earnedstar-ai-seo.service.js.map
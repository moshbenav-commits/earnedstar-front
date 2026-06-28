/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Injectable, Logger } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { PlanLimitsService } from './plan-limits.service';

type ReviewSnippet = {
  id: string;
  rating_overall: number;
  review_text: string | null;
  review_title?: string | null;
  product_name?: string | null;
};

type MerchantSeoContext = {
  id: string;
  name: string;
  slug: string;
  website_url: string | null;
  review_count: number;
  avg_rating: number;
  plan: string;
};

@Injectable()
export class EarnedstarAiSeoService {
  private readonly logger = new Logger(EarnedstarAiSeoService.name);

  constructor(
    private readonly postgres: PostgresService,
    private readonly planLimits: PlanLimitsService,
  ) {}

  private model(): string {
    return process.env.EARNEDSTAR_SEO_LLM_MODEL ?? 'gpt-4o-mini';
  }

  private async callLlm(system: string, user: string): Promise<Record<string, unknown> | null> {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) return null;

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
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
        usage?: { total_tokens?: number };
      };
      const content = data.choices?.[0]?.message?.content;
      if (!content) return null;
      this.logger.log(`AI SEO tokens: ${data.usage?.total_tokens ?? '?'}`);
      return JSON.parse(content) as Record<string, unknown>;
    } catch (err) {
      this.logger.warn(`OpenAI SEO error: ${err instanceof Error ? err.message : err}`);
      return null;
    }
  }

  private async getMerchantContext(businessId: string): Promise<MerchantSeoContext | null> {
    if (!this.postgres.isConfigured()) return null;
    return this.postgres.queryOne<MerchantSeoContext>(
      `SELECT id::text, name, slug, website_url, review_count, avg_rating::float8 AS avg_rating, plan
       FROM businesses WHERE id = $1::uuid LIMIT 1`,
      [businessId],
    );
  }

  private async getReviewSnippets(businessId: string, limit = 30): Promise<ReviewSnippet[]> {
    if (!this.postgres.isConfigured()) return [];
    return this.postgres.queryMany<ReviewSnippet>(
      `SELECT r.id::text, r.rating_overall::float8 AS rating_overall, r.review_text,
              r.review_title, p.name AS product_name
       FROM reviews r
       LEFT JOIN products p ON p.id = r.product_id
       WHERE r.business_id = $1::uuid AND r.status = 'published' AND r.review_text IS NOT NULL
       ORDER BY r.created_at DESC
       LIMIT $2`,
      [businessId, limit],
    );
  }

  private async getPublishedQaPairs(businessId: string, limit = 10) {
    if (!this.postgres.isConfigured()) return [];
    return this.postgres.queryMany<{ question: string; answer: string }>(
      `SELECT question, answer FROM qa_items
       WHERE business_id = $1::uuid AND published = true AND answer IS NOT NULL
       ORDER BY answered_at DESC NULLS LAST LIMIT $2`,
      [businessId, limit],
    );
  }

  private trim(text: string, max: number): string {
    const t = text.trim();
    if (t.length <= max) return t;
    return `${t.slice(0, max - 1).trim()}…`;
  }

  async suggestMeta(businessId: string, plan: string) {
    this.planLimits.assertCanUseAiMeta(plan);
    const merchant = await this.getMerchantContext(businessId);
    if (!merchant) throw new Error('Merchant not found');

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
        source: 'ai' as const,
      };
    }

    const count = merchant.review_count.toLocaleString();
    return {
      seo_title: this.trim(`${merchant.name} Reviews — ${count} Verified | EarnedStar`, 60),
      seo_description: this.trim(
        `Read ${count} verified purchase reviews of ${merchant.name}. ${merchant.avg_rating}/5 average. Every review tied to a real order.`,
        155,
      ),
      source: 'template' as const,
    };
  }

  async suggestQaAnswer(businessId: string, plan: string, question: string) {
    this.planLimits.assertCanUseAiQa(plan);
    const merchant = await this.getMerchantContext(businessId);
    if (!merchant) throw new Error('Merchant not found');

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
        ? (llm.review_ids as unknown[]).map(String).filter((id) => reviews.some((r) => r.id === id))
        : reviews.slice(0, 3).map((r) => r.id);
      return {
        draft: String(llm.draft).trim(),
        sources: { review_ids: ids },
        source: 'ai' as const,
      };
    }

    const top = reviews[0];
    const draft = top
      ? `Based on verified customer feedback, shoppers often mention: "${this.trim(top.review_text ?? '', 140)}" We invite you to browse our published reviews for more detail.`
      : `Thanks for your question. We're gathering more verified reviews to answer this accurately — check back soon or contact us through our website.`;

    return {
      draft,
      sources: { review_ids: top ? [top.id] : [] },
      source: 'template' as const,
    };
  }

  async regenerateReviewSummary(businessId: string, plan: string) {
    this.planLimits.assertCanUseAiReviewSummary(plan);
    const merchant = await this.getMerchantContext(businessId);
    if (!merchant) throw new Error('Merchant not found');
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
    let summary: string;
    if (llm?.summary) {
      summary = this.trim(String(llm.summary), 220);
    } else {
      const positive = reviews.filter((r) => r.rating_overall >= 4).length;
      const pct = Math.round((positive / Math.max(reviews.length, 1)) * 100);
      summary = `Customers rate ${merchant.name} ${merchant.avg_rating}/5 across ${merchant.review_count.toLocaleString()} verified reviews — ${pct}% of recent feedback is 4–5 stars.`;
    }

    if (this.postgres.isConfigured()) {
      await this.postgres.query(
        `UPDATE businesses SET review_summary_ai = $2, review_summary_generated_at = now() WHERE id = $1::uuid`,
        [businessId, summary],
      );
    }

    return { ok: true, summary, generated_at: new Date().toISOString() };
  }

  isSummaryFresh(generatedAt: string | null | undefined): boolean {
    if (!generatedAt) return false;
    const ageMs = Date.now() - new Date(generatedAt).getTime();
    return ageMs < 30 * 24 * 60 * 60 * 1000;
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudScoringService = void 0;
const common_1 = require("@nestjs/common");
const DISPOSABLE_DOMAINS = ['mailinator.com', 'guerrillamail.com', 'tempmail.com', 'yopmail.com'];
let FraudScoringService = class FraudScoringService {
    similarityScore(a, b) {
        const tokenize = (s) => new Set(s
            .toLowerCase()
            .split(/\W+/)
            .filter((w) => w.length > 3));
        const tokensA = tokenize(a);
        const tokensB = tokenize(b);
        if (!tokensA.size || !tokensB.size)
            return 0;
        let intersection = 0;
        tokensA.forEach((t) => {
            if (tokensB.has(t))
                intersection += 1;
        });
        return intersection / Math.max(tokensA.size, tokensB.size);
    }
    scoreSubmission(dto, recentTexts = []) {
        let score = 12;
        const reasons = [];
        const text = dto.review_text.trim();
        const words = text.split(/\s+/).filter(Boolean);
        if (text.length < 30) {
            score += 18;
            reasons.push('short_body');
        }
        const caps = text.replace(/[^A-Z]/g, '').length;
        if (text.length > 0 && caps / text.length > 0.45) {
            score += 22;
            reasons.push('excessive_caps');
        }
        const unique = new Set(words.map((w) => w.toLowerCase()));
        if (words.length >= 8 && unique.size / words.length < 0.45) {
            score += 20;
            reasons.push('repetitive_language');
        }
        if (dto.rating_overall <= 2 && text.length < 80) {
            score += 15;
            reasons.push('low_rating_thin_detail');
        }
        const domain = dto.customer_email.split('@')[1]?.toLowerCase() ?? '';
        if (DISPOSABLE_DOMAINS.some((d) => domain.endsWith(d))) {
            score += 25;
            reasons.push('disposable_email');
        }
        if (/https?:\/\//i.test(text)) {
            score += 12;
            reasons.push('external_link');
        }
        for (const prior of recentTexts) {
            if (!prior?.trim())
                continue;
            const sim = this.similarityScore(text, prior);
            if (sim >= 0.72) {
                score += 28;
                reasons.push('similar_to_existing_review');
                break;
            }
        }
        score = Math.min(100, Math.max(0, score));
        let status = 'published';
        if (score > 60)
            status = 'flagged';
        else if (score > 30)
            status = 'pending';
        return { score, reasons, status };
    }
};
exports.FraudScoringService = FraudScoringService;
exports.FraudScoringService = FraudScoringService = __decorate([
    (0, common_1.Injectable)()
], FraudScoringService);
//# sourceMappingURL=fraud-scoring.service.js.map
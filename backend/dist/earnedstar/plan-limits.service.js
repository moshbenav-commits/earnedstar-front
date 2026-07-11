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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanLimitsService = void 0;
const common_1 = require("@nestjs/common");
const postgres_service_1 = require("../database/postgres.service");
const plan_limits_1 = require("./plan-limits");
let PlanLimitsService = class PlanLimitsService {
    constructor(postgres) {
        this.postgres = postgres;
    }
    limitsFor(plan) {
        return plan_limits_1.PLAN_LIMITS[(0, plan_limits_1.normalizePlan)(plan)];
    }
    async assertCanSendInvitation(businessId, plan, channel) {
        const limits = this.limitsFor(plan);
        if (channel === 'sms' && !limits.sms) {
            throw new common_1.ForbiddenException('SMS invitations require Growth plan or higher');
        }
        if (limits.monthly_requests < 0)
            return;
        if (!this.postgres.isConfigured())
            return;
        const row = await this.postgres.queryOne(`SELECT COUNT(*)::int AS count
       FROM review_requests
       WHERE business_id = $1::uuid
         AND created_at >= date_trunc('month', now())`, [businessId]);
        const used = row?.count ?? 0;
        if (used >= limits.monthly_requests) {
            throw new common_1.ForbiddenException(`Monthly invitation limit reached (${limits.monthly_requests}). Upgrade your plan to send more.`);
        }
    }
    planAllowsVideo(plan) {
        return this.limitsFor(plan).video;
    }
    assertCanAccessAnalytics(plan) {
        if (!this.limitsFor(plan).analytics) {
            throw new common_1.ForbiddenException('Analytics require Growth plan or higher');
        }
    }
    assertCanAccessQa(plan) {
        const limits = this.limitsFor(plan);
        if (!limits.qa_module) {
            throw new common_1.ForbiddenException('Q&A SEO module requires Pro plan or higher');
        }
    }
    assertCanAccessSyndication(plan) {
        const limits = this.limitsFor(plan);
        if (!limits.syndication) {
            throw new common_1.ForbiddenException('Review syndication feeds require Pro plan or higher');
        }
    }
    assertCanUseAiMeta(plan) {
        const limits = this.limitsFor(plan);
        if (!limits.ai_meta_suggestions) {
            throw new common_1.ForbiddenException('AI meta suggestions require Growth plan or higher');
        }
    }
    assertCanUseAiReviewSummary(plan) {
        const limits = this.limitsFor(plan);
        if (!limits.ai_review_summary) {
            throw new common_1.ForbiddenException('AI review summaries require Growth plan or higher');
        }
    }
    assertCanUseAiQa(plan) {
        const limits = this.limitsFor(plan);
        if (!limits.ai_qa_suggestions) {
            throw new common_1.ForbiddenException('AI Q&A answer drafts require Pro plan or higher');
        }
    }
    async assertCanAddTeamMember(businessId, plan) {
        const limits = this.limitsFor(plan);
        if (limits.users < 0)
            return;
        if (!this.postgres.isConfigured())
            return;
        const row = await this.postgres.queryOne(`SELECT COUNT(*)::int AS count FROM team_members WHERE business_id = $1::uuid`, [businessId]);
        const used = (row?.count ?? 0) + 1;
        if (used >= limits.users) {
            throw new common_1.ForbiddenException(`Team seat limit reached (${limits.users}). Upgrade your plan or remove a member.`);
        }
    }
    async assertCanCreateWidget(businessId, plan) {
        const limits = this.limitsFor(plan);
        if (limits.widgets < 0)
            return;
        if (!this.postgres.isConfigured())
            return;
        const row = await this.postgres.queryOne(`SELECT COUNT(*)::int AS count FROM review_widgets WHERE business_id = $1::uuid`, [businessId]);
        const used = row?.count ?? 0;
        if (used >= limits.widgets) {
            throw new common_1.ForbiddenException(`Widget limit reached (${limits.widgets}). Upgrade your plan or remove an existing widget.`);
        }
    }
};
exports.PlanLimitsService = PlanLimitsService;
exports.PlanLimitsService = PlanLimitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [postgres_service_1.PostgresService])
], PlanLimitsService);
//# sourceMappingURL=plan-limits.service.js.map
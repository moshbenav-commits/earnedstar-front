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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarnedstarSeoController = void 0;
const common_1 = require("@nestjs/common");
const earnedstar_service_1 = require("./earnedstar.service");
const earnedstar_ai_seo_service_1 = require("./earnedstar-ai-seo.service");
const earnedstar_dto_1 = require("./dto/earnedstar.dto");
const merchant_auth_guard_1 = require("../auth/merchant-auth.guard");
let EarnedstarSeoController = class EarnedstarSeoController {
    constructor(earnedstar, aiSeo) {
        this.earnedstar = earnedstar;
        this.aiSeo = aiSeo;
    }
    listSitemapMerchants() {
        return this.earnedstar.listSitemapMerchants();
    }
    health(req) {
        return this.earnedstar.getSeoHealthForOwner(req.merchantUser.id);
    }
    async suggestMeta(req) {
        const merchant = await this.earnedstar.getMerchantForOwner(req.merchantUser.id);
        return this.aiSeo.suggestMeta(merchant.id, merchant.plan);
    }
    async regenerateSummary(req) {
        const merchant = await this.earnedstar.getMerchantForOwner(req.merchantUser.id);
        return this.aiSeo.regenerateReviewSummary(merchant.id, merchant.plan);
    }
    async suggestQaAnswer(req, dto) {
        const merchant = await this.earnedstar.getMerchantForOwner(req.merchantUser.id);
        return this.aiSeo.suggestQaAnswer(merchant.id, merchant.plan, dto.question);
    }
};
exports.EarnedstarSeoController = EarnedstarSeoController;
__decorate([
    (0, common_1.Get)('sitemap-merchants'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EarnedstarSeoController.prototype, "listSitemapMerchants", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EarnedstarSeoController.prototype, "health", null);
__decorate([
    (0, common_1.Post)('suggest-meta'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EarnedstarSeoController.prototype, "suggestMeta", null);
__decorate([
    (0, common_1.Post)('regenerate-summary'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EarnedstarSeoController.prototype, "regenerateSummary", null);
__decorate([
    (0, common_1.Post)('suggest-qa-answer'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, earnedstar_dto_1.SuggestQaAnswerDto]),
    __metadata("design:returntype", Promise)
], EarnedstarSeoController.prototype, "suggestQaAnswer", null);
exports.EarnedstarSeoController = EarnedstarSeoController = __decorate([
    (0, common_1.Controller)('earnedstar/seo'),
    __metadata("design:paramtypes", [earnedstar_service_1.EarnedstarService,
        earnedstar_ai_seo_service_1.EarnedstarAiSeoService])
], EarnedstarSeoController);
//# sourceMappingURL=earnedstar-seo.controller.js.map
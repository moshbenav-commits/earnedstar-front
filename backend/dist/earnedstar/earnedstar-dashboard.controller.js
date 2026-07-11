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
exports.EarnedstarDashboardController = void 0;
const common_1 = require("@nestjs/common");
const earnedstar_service_1 = require("./earnedstar.service");
const merchant_auth_guard_1 = require("../auth/merchant-auth.guard");
let EarnedstarDashboardController = class EarnedstarDashboardController {
    constructor(earnedstar) {
        this.earnedstar = earnedstar;
    }
    overview(slug) {
        return this.earnedstar.getDashboardOverview(slug ?? 'meridian-gear');
    }
    reviews(slug, limit) {
        const n = limit ? Math.min(parseInt(limit, 10) || 100, 200) : 100;
        return this.earnedstar.listMerchantReviews(slug ?? 'meridian-gear', n);
    }
    invitations(slug, limit) {
        const n = limit ? Math.min(parseInt(limit, 10) || 50, 100) : 50;
        return this.earnedstar.listInvitations(slug ?? 'meridian-gear', n);
    }
    analytics(slug) {
        return this.earnedstar.getAnalyticsDashboard(slug ?? 'meridian-gear');
    }
    async exportReviews(req, slug, res) {
        const payload = await this.earnedstar.exportReviewsCsvForOwner(req.merchantUser.id, slug);
        res.setHeader('Content-Disposition', `attachment; filename="${payload.filename}"`);
        res.send(payload.csv);
    }
    publicSchema(merchantSlug) {
        return this.earnedstar.getAggregateSchema(merchantSlug);
    }
};
exports.EarnedstarDashboardController = EarnedstarDashboardController;
__decorate([
    (0, common_1.Get)('dashboard/overview'),
    __param(0, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EarnedstarDashboardController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)('dashboard/reviews'),
    __param(0, (0, common_1.Query)('slug')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EarnedstarDashboardController.prototype, "reviews", null);
__decorate([
    (0, common_1.Get)('dashboard/invitations'),
    __param(0, (0, common_1.Query)('slug')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EarnedstarDashboardController.prototype, "invitations", null);
__decorate([
    (0, common_1.Get)('dashboard/analytics'),
    __param(0, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EarnedstarDashboardController.prototype, "analytics", null);
__decorate([
    (0, common_1.Get)('dashboard/export/reviews.csv'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    (0, common_1.Header)('Content-Type', 'text/csv; charset=utf-8'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('slug')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], EarnedstarDashboardController.prototype, "exportReviews", null);
__decorate([
    (0, common_1.Get)('schema/:merchantSlug'),
    __param(0, (0, common_1.Param)('merchantSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EarnedstarDashboardController.prototype, "publicSchema", null);
exports.EarnedstarDashboardController = EarnedstarDashboardController = __decorate([
    (0, common_1.Controller)('earnedstar'),
    __metadata("design:paramtypes", [earnedstar_service_1.EarnedstarService])
], EarnedstarDashboardController);
//# sourceMappingURL=earnedstar-dashboard.controller.js.map
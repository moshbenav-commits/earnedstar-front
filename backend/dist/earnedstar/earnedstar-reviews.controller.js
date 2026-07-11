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
exports.EarnedstarReviewsController = void 0;
const common_1 = require("@nestjs/common");
const earnedstar_service_1 = require("./earnedstar.service");
const earnedstar_dto_1 = require("./dto/earnedstar.dto");
const merchant_auth_guard_1 = require("../auth/merchant-auth.guard");
let EarnedstarReviewsController = class EarnedstarReviewsController {
    constructor(earnedstar) {
        this.earnedstar = earnedstar;
    }
    embed(apiKey) {
        return this.earnedstar.getPublicEmbedByApiKey(apiKey);
    }
    list(merchantSlug, limit, offset, page, sort, minRating, ymmYear, ymmMake, ymmModel, hasPhotos) {
        const n = limit ? Math.min(parseInt(limit, 10) || 50, 100) : 50;
        const pageNum = page ? Math.max(parseInt(page, 10) || 1, 1) : 1;
        const off = offset
            ? Math.max(parseInt(offset, 10) || 0, 0)
            : (pageNum - 1) * n;
        return this.earnedstar.listPublishedReviews(merchantSlug, n, off, {
            sort,
            min_rating: minRating ? parseInt(minRating, 10) : undefined,
            ymm_year: ymmYear ? parseInt(ymmYear, 10) : undefined,
            ymm_make: ymmMake,
            ymm_model: ymmModel,
            has_photos: hasPhotos === '1' || hasPhotos === 'true',
        });
    }
    submit(dto) {
        return this.earnedstar.submitReview(dto);
    }
    upload(dto) {
        return this.earnedstar.uploadReviewPhoto(dto);
    }
    moderate(req, reviewId, dto) {
        return this.earnedstar.moderateReviewForOwner(req.merchantUser.id, reviewId, dto);
    }
    respond(req, reviewId, dto) {
        return this.earnedstar.respondToReviewForOwner(req.merchantUser.id, reviewId, dto);
    }
};
exports.EarnedstarReviewsController = EarnedstarReviewsController;
__decorate([
    (0, common_1.Get)('embed/:apiKey'),
    __param(0, (0, common_1.Param)('apiKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EarnedstarReviewsController.prototype, "embed", null);
__decorate([
    (0, common_1.Get)(':merchantSlug'),
    __param(0, (0, common_1.Param)('merchantSlug')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('sort')),
    __param(5, (0, common_1.Query)('min_rating')),
    __param(6, (0, common_1.Query)('ymm_year')),
    __param(7, (0, common_1.Query)('ymm_make')),
    __param(8, (0, common_1.Query)('ymm_model')),
    __param(9, (0, common_1.Query)('has_photos')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], EarnedstarReviewsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('submit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [earnedstar_dto_1.SubmitReviewDto]),
    __metadata("design:returntype", void 0)
], EarnedstarReviewsController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)('upload'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [earnedstar_dto_1.UploadReviewPhotoDto]),
    __metadata("design:returntype", void 0)
], EarnedstarReviewsController.prototype, "upload", null);
__decorate([
    (0, common_1.Post)(':reviewId/moderate'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('reviewId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, earnedstar_dto_1.ModerateReviewDto]),
    __metadata("design:returntype", void 0)
], EarnedstarReviewsController.prototype, "moderate", null);
__decorate([
    (0, common_1.Patch)(':reviewId/respond'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('reviewId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, earnedstar_dto_1.RespondReviewDto]),
    __metadata("design:returntype", void 0)
], EarnedstarReviewsController.prototype, "respond", null);
exports.EarnedstarReviewsController = EarnedstarReviewsController = __decorate([
    (0, common_1.Controller)('earnedstar/reviews'),
    __metadata("design:paramtypes", [earnedstar_service_1.EarnedstarService])
], EarnedstarReviewsController);
//# sourceMappingURL=earnedstar-reviews.controller.js.map
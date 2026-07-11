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
exports.EarnedstarFeedsController = void 0;
const common_1 = require("@nestjs/common");
const earnedstar_service_1 = require("./earnedstar.service");
const google_reviews_feed_service_1 = require("./google-reviews-feed.service");
let EarnedstarFeedsController = class EarnedstarFeedsController {
    constructor(earnedstar, googleFeed) {
        this.earnedstar = earnedstar;
        this.googleFeed = googleFeed;
    }
    async googleReviewsXml(slug, res) {
        const payload = await this.earnedstar.getGoogleSellerFeed(slug);
        const xml = this.googleFeed.buildProductReviewsXml(payload.merchant, payload.reviews);
        res.send(xml);
    }
    async trustpilotJson(slug) {
        return this.earnedstar.getTrustpilotExport(slug);
    }
};
exports.EarnedstarFeedsController = EarnedstarFeedsController;
__decorate([
    (0, common_1.Get)('google-reviews/:slug.xml'),
    (0, common_1.Header)('Content-Type', 'application/xml; charset=utf-8'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EarnedstarFeedsController.prototype, "googleReviewsXml", null);
__decorate([
    (0, common_1.Get)('trustpilot/:slug.json'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EarnedstarFeedsController.prototype, "trustpilotJson", null);
exports.EarnedstarFeedsController = EarnedstarFeedsController = __decorate([
    (0, common_1.Controller)('earnedstar/feeds'),
    __metadata("design:paramtypes", [earnedstar_service_1.EarnedstarService,
        google_reviews_feed_service_1.GoogleReviewsFeedService])
], EarnedstarFeedsController);
//# sourceMappingURL=earnedstar-feeds.controller.js.map
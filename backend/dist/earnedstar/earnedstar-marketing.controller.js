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
exports.EarnedstarMarketingController = void 0;
const common_1 = require("@nestjs/common");
const earnedstar_marketing_service_1 = require("./earnedstar-marketing.service");
const earnedstar_dto_1 = require("./dto/earnedstar.dto");
let EarnedstarMarketingController = class EarnedstarMarketingController {
    constructor(marketing) {
        this.marketing = marketing;
    }
    getTrustCounter() {
        return this.marketing.getTrustCounter();
    }
    runReviewAudit(dto) {
        return this.marketing.runReviewAudit(dto.url);
    }
};
exports.EarnedstarMarketingController = EarnedstarMarketingController;
__decorate([
    (0, common_1.Get)('trust-counter'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EarnedstarMarketingController.prototype, "getTrustCounter", null);
__decorate([
    (0, common_1.Post)('review-audit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [earnedstar_dto_1.ReviewAuditDto]),
    __metadata("design:returntype", void 0)
], EarnedstarMarketingController.prototype, "runReviewAudit", null);
exports.EarnedstarMarketingController = EarnedstarMarketingController = __decorate([
    (0, common_1.Controller)('earnedstar/marketing'),
    __metadata("design:paramtypes", [earnedstar_marketing_service_1.EarnedstarMarketingService])
], EarnedstarMarketingController);
//# sourceMappingURL=earnedstar-marketing.controller.js.map
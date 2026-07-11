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
exports.EarnedstarOnboardingController = exports.EarnedstarAgencyController = void 0;
const common_1 = require("@nestjs/common");
const earnedstar_service_1 = require("./earnedstar.service");
const merchant_auth_guard_1 = require("../auth/merchant-auth.guard");
const earnedstar_dto_1 = require("./dto/earnedstar.dto");
let EarnedstarAgencyController = class EarnedstarAgencyController {
    constructor(earnedstar) {
        this.earnedstar = earnedstar;
    }
    list(req) {
        return this.earnedstar.listAgencyClients(req.merchantUser.id);
    }
    create(req, dto) {
        return this.earnedstar.createAgencyClient(req.merchantUser.id, dto);
    }
};
exports.EarnedstarAgencyController = EarnedstarAgencyController;
__decorate([
    (0, common_1.Get)('clients'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EarnedstarAgencyController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('clients'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, earnedstar_dto_1.CreateAgencyClientDto]),
    __metadata("design:returntype", void 0)
], EarnedstarAgencyController.prototype, "create", null);
exports.EarnedstarAgencyController = EarnedstarAgencyController = __decorate([
    (0, common_1.Controller)('earnedstar/agency'),
    __metadata("design:paramtypes", [earnedstar_service_1.EarnedstarService])
], EarnedstarAgencyController);
let EarnedstarOnboardingController = class EarnedstarOnboardingController {
    constructor(earnedstar) {
        this.earnedstar = earnedstar;
    }
    status(req) {
        return this.earnedstar.getOnboardingStatus(req.merchantUser.id);
    }
    complete(req, dto) {
        return this.earnedstar.completeOnboarding(req.merchantUser.id, dto);
    }
};
exports.EarnedstarOnboardingController = EarnedstarOnboardingController;
__decorate([
    (0, common_1.Get)('status'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EarnedstarOnboardingController.prototype, "status", null);
__decorate([
    (0, common_1.Post)('complete'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, earnedstar_dto_1.CompleteOnboardingDto]),
    __metadata("design:returntype", void 0)
], EarnedstarOnboardingController.prototype, "complete", null);
exports.EarnedstarOnboardingController = EarnedstarOnboardingController = __decorate([
    (0, common_1.Controller)('earnedstar/onboarding'),
    __metadata("design:paramtypes", [earnedstar_service_1.EarnedstarService])
], EarnedstarOnboardingController);
//# sourceMappingURL=earnedstar-agency.controller.js.map
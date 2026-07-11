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
exports.EarnedstarBillingController = void 0;
const common_1 = require("@nestjs/common");
const authorize_net_service_1 = require("../payments/authorize-net.service");
const earnedstar_service_1 = require("./earnedstar.service");
const earnedstar_dto_1 = require("./dto/earnedstar.dto");
const merchant_auth_guard_1 = require("../auth/merchant-auth.guard");
let EarnedstarBillingController = class EarnedstarBillingController {
    constructor(authorizeNet, earnedstar) {
        this.authorizeNet = authorizeNet;
        this.earnedstar = earnedstar;
    }
    status() {
        const publicConfig = this.authorizeNet.getPublicConfig();
        return {
            provider: 'authorize.net',
            mode: process.env.AUTHNET_ENV ?? 'sandbox',
            ready: this.authorizeNet.isConfigured() || process.env.EARNEDSTAR_BILLING_DEV_BYPASS === '1',
            acceptJs: Boolean(publicConfig),
            publicConfig: publicConfig ?? undefined,
        };
    }
    publicConfig() {
        return this.authorizeNet.getPublicConfig() ?? { configured: false };
    }
    async subscribe(req, dto) {
        const merchant = await this.earnedstar.getMerchantForOwner(req.merchantUser.id);
        const result = await this.authorizeNet.createArbSubscription({
            plan: dto.plan,
            opaqueData: { dataDescriptor: dto.dataDescriptor, dataValue: dto.dataValue },
            customerEmail: dto.customer_email,
            customerName: dto.customer_name,
            businessId: merchant.id,
        });
        await this.earnedstar.updateMerchantBilling(merchant.id, {
            plan: dto.plan,
            authnet_subscription_id: result.subscriptionId,
            authnet_customer_profile_id: result.customerProfileId ?? undefined,
        });
        return { ok: true, ...result, plan: dto.plan };
    }
    authorizeNetWebhook(body) {
        return { ok: true, received: true, event: body?.eventType ?? 'unknown' };
    }
};
exports.EarnedstarBillingController = EarnedstarBillingController;
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EarnedstarBillingController.prototype, "status", null);
__decorate([
    (0, common_1.Get)('public-config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EarnedstarBillingController.prototype, "publicConfig", null);
__decorate([
    (0, common_1.Post)('subscribe'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, earnedstar_dto_1.SubscribeBillingDto]),
    __metadata("design:returntype", Promise)
], EarnedstarBillingController.prototype, "subscribe", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EarnedstarBillingController.prototype, "authorizeNetWebhook", null);
exports.EarnedstarBillingController = EarnedstarBillingController = __decorate([
    (0, common_1.Controller)('earnedstar/billing'),
    __metadata("design:paramtypes", [authorize_net_service_1.AuthorizeNetService,
        earnedstar_service_1.EarnedstarService])
], EarnedstarBillingController);
//# sourceMappingURL=earnedstar-billing.controller.js.map
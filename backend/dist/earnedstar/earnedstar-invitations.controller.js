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
exports.EarnedstarInvitationsController = void 0;
const common_1 = require("@nestjs/common");
const earnedstar_service_1 = require("./earnedstar.service");
const earnedstar_dto_1 = require("./dto/earnedstar.dto");
const merchant_auth_guard_1 = require("../auth/merchant-auth.guard");
let EarnedstarInvitationsController = class EarnedstarInvitationsController {
    constructor(earnedstar) {
        this.earnedstar = earnedstar;
    }
    lookup(token) {
        return this.earnedstar.getInvitationByToken(token);
    }
    send(req, slug, dto) {
        return this.earnedstar.sendInvitationForOwner(req.merchantUser.id, slug, dto);
    }
    bulk(req, slug, dto) {
        return this.earnedstar.bulkSendInvitationsForOwner(req.merchantUser.id, slug, dto);
    }
    resend(req, id, slug) {
        return this.earnedstar.resendInvitationForOwner(req.merchantUser.id, slug, id);
    }
};
exports.EarnedstarInvitationsController = EarnedstarInvitationsController;
__decorate([
    (0, common_1.Get)('lookup/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EarnedstarInvitationsController.prototype, "lookup", null);
__decorate([
    (0, common_1.Post)('send'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('slug')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, earnedstar_dto_1.SendInvitationDto]),
    __metadata("design:returntype", void 0)
], EarnedstarInvitationsController.prototype, "send", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('slug')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, earnedstar_dto_1.BulkSendInvitationsDto]),
    __metadata("design:returntype", void 0)
], EarnedstarInvitationsController.prototype, "bulk", null);
__decorate([
    (0, common_1.Post)(':id/resend'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], EarnedstarInvitationsController.prototype, "resend", null);
exports.EarnedstarInvitationsController = EarnedstarInvitationsController = __decorate([
    (0, common_1.Controller)('earnedstar/invitations'),
    __metadata("design:paramtypes", [earnedstar_service_1.EarnedstarService])
], EarnedstarInvitationsController);
//# sourceMappingURL=earnedstar-invitations.controller.js.map
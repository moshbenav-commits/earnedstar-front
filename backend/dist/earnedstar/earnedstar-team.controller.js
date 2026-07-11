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
exports.EarnedstarTeamController = void 0;
const common_1 = require("@nestjs/common");
const earnedstar_service_1 = require("./earnedstar.service");
const earnedstar_dto_1 = require("./dto/earnedstar.dto");
const merchant_auth_guard_1 = require("../auth/merchant-auth.guard");
let EarnedstarTeamController = class EarnedstarTeamController {
    constructor(earnedstar) {
        this.earnedstar = earnedstar;
    }
    list(req) {
        return this.earnedstar.listTeamMembersForOwner(req.merchantUser.id);
    }
    invite(req, dto) {
        return this.earnedstar.inviteTeamMemberForOwner(req.merchantUser.id, dto);
    }
    remove(req, id) {
        return this.earnedstar.removeTeamMemberForOwner(req.merchantUser.id, id);
    }
};
exports.EarnedstarTeamController = EarnedstarTeamController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EarnedstarTeamController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('invite'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, earnedstar_dto_1.InviteTeamMemberDto]),
    __metadata("design:returntype", void 0)
], EarnedstarTeamController.prototype, "invite", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EarnedstarTeamController.prototype, "remove", null);
exports.EarnedstarTeamController = EarnedstarTeamController = __decorate([
    (0, common_1.Controller)('earnedstar/team'),
    __metadata("design:paramtypes", [earnedstar_service_1.EarnedstarService])
], EarnedstarTeamController);
//# sourceMappingURL=earnedstar-team.controller.js.map
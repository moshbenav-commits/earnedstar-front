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
exports.EarnedstarQaController = void 0;
const common_1 = require("@nestjs/common");
const earnedstar_service_1 = require("./earnedstar.service");
const earnedstar_dto_1 = require("./dto/earnedstar.dto");
const merchant_auth_guard_1 = require("../auth/merchant-auth.guard");
let EarnedstarQaController = class EarnedstarQaController {
    constructor(earnedstar) {
        this.earnedstar = earnedstar;
    }
    listPublic(slug) {
        return this.earnedstar.listPublishedQa(slug);
    }
    askPublic(slug, dto) {
        return this.earnedstar.publicAskQa(slug, dto.question, dto.asked_by);
    }
    list(req) {
        return this.earnedstar.listQaForOwner(req.merchantUser.id);
    }
    create(req, dto) {
        return this.earnedstar.createQaForOwner(req.merchantUser.id, dto);
    }
    update(req, id, dto) {
        return this.earnedstar.updateQaForOwner(req.merchantUser.id, id, dto);
    }
    remove(req, id) {
        return this.earnedstar.deleteQaForOwner(req.merchantUser.id, id);
    }
};
exports.EarnedstarQaController = EarnedstarQaController;
__decorate([
    (0, common_1.Get)('public/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EarnedstarQaController.prototype, "listPublic", null);
__decorate([
    (0, common_1.Post)('public/:slug/ask'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, earnedstar_dto_1.PublicAskQaDto]),
    __metadata("design:returntype", void 0)
], EarnedstarQaController.prototype, "askPublic", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EarnedstarQaController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, earnedstar_dto_1.CreateQaItemDto]),
    __metadata("design:returntype", void 0)
], EarnedstarQaController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, earnedstar_dto_1.UpdateQaItemDto]),
    __metadata("design:returntype", void 0)
], EarnedstarQaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EarnedstarQaController.prototype, "remove", null);
exports.EarnedstarQaController = EarnedstarQaController = __decorate([
    (0, common_1.Controller)('earnedstar/qa'),
    __metadata("design:paramtypes", [earnedstar_service_1.EarnedstarService])
], EarnedstarQaController);
//# sourceMappingURL=earnedstar-qa.controller.js.map
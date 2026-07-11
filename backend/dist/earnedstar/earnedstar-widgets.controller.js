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
exports.EarnedstarWidgetsController = void 0;
const common_1 = require("@nestjs/common");
const earnedstar_service_1 = require("./earnedstar.service");
const earnedstar_dto_1 = require("./dto/earnedstar.dto");
const merchant_auth_guard_1 = require("../auth/merchant-auth.guard");
let EarnedstarWidgetsController = class EarnedstarWidgetsController {
    constructor(earnedstar) {
        this.earnedstar = earnedstar;
    }
    list(req) {
        return this.earnedstar.listWidgetsForOwner(req.merchantUser.id);
    }
    create(req, dto) {
        return this.earnedstar.createWidgetForOwner(req.merchantUser.id, dto);
    }
    remove(req, widgetId) {
        return this.earnedstar.deleteWidgetForOwner(req.merchantUser.id, widgetId);
    }
};
exports.EarnedstarWidgetsController = EarnedstarWidgetsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EarnedstarWidgetsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, earnedstar_dto_1.CreateWidgetDto]),
    __metadata("design:returntype", void 0)
], EarnedstarWidgetsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':widgetId'),
    (0, common_1.UseGuards)(merchant_auth_guard_1.MerchantAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EarnedstarWidgetsController.prototype, "remove", null);
exports.EarnedstarWidgetsController = EarnedstarWidgetsController = __decorate([
    (0, common_1.Controller)('earnedstar/widgets'),
    __metadata("design:paramtypes", [earnedstar_service_1.EarnedstarService])
], EarnedstarWidgetsController);
//# sourceMappingURL=earnedstar-widgets.controller.js.map
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
exports.EarnedstarWidgetPublicController = void 0;
const common_1 = require("@nestjs/common");
const earnedstar_service_1 = require("./earnedstar.service");
let EarnedstarWidgetPublicController = class EarnedstarWidgetPublicController {
    constructor(earnedstar) {
        this.earnedstar = earnedstar;
    }
    getBySlug(slug, max) {
        const n = max ? Math.min(parseInt(max, 10) || 12, 24) : 12;
        return this.earnedstar.getPublicWidgetBySlug(slug, n);
    }
};
exports.EarnedstarWidgetPublicController = EarnedstarWidgetPublicController;
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Query)('max')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EarnedstarWidgetPublicController.prototype, "getBySlug", null);
exports.EarnedstarWidgetPublicController = EarnedstarWidgetPublicController = __decorate([
    (0, common_1.Controller)('earnedstar/widget'),
    __metadata("design:paramtypes", [earnedstar_service_1.EarnedstarService])
], EarnedstarWidgetPublicController);
//# sourceMappingURL=earnedstar-widget-public.controller.js.map
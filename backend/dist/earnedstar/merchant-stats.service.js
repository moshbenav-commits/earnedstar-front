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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantStatsService = void 0;
const common_1 = require("@nestjs/common");
const postgres_service_1 = require("../database/postgres.service");
let MerchantStatsService = class MerchantStatsService {
    constructor(postgres) {
        this.postgres = postgres;
    }
    async refreshForBusiness(businessId) {
        await this.postgres.query(`UPDATE businesses b SET
         review_count = sub.cnt,
         avg_rating = sub.avg
       FROM (
         SELECT COUNT(*)::int AS cnt, COALESCE(AVG(rating_overall), 0)::decimal(3,2) AS avg
         FROM reviews WHERE business_id = $1::uuid AND status = 'published'
       ) sub
       WHERE b.id = $1::uuid`, [businessId]);
    }
};
exports.MerchantStatsService = MerchantStatsService;
exports.MerchantStatsService = MerchantStatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [postgres_service_1.PostgresService])
], MerchantStatsService);
//# sourceMappingURL=merchant-stats.service.js.map
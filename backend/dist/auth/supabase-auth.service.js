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
exports.SupabaseAuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let SupabaseAuthService = class SupabaseAuthService {
    constructor(config) {
        this.config = config;
        this.supabaseUrl = this.config.get('SUPABASE_URL')?.replace(/\/$/, '') ?? null;
        this.serviceRoleKey = this.config.get('SUPABASE_SERVICE_ROLE_KEY')?.trim() ?? null;
        this.webhookSecret = this.config.get('EARNEDSTAR_WEBHOOK_SECRET')?.trim() ?? null;
    }
    isConfigured() {
        return Boolean(this.supabaseUrl && this.serviceRoleKey);
    }
    webhookSecretMatches(header) {
        if (!this.webhookSecret)
            return false;
        return header === this.webhookSecret;
    }
    async verifyAccessToken(token) {
        if (!token?.trim()) {
            throw new common_1.UnauthorizedException('Missing access token');
        }
        if (!this.isConfigured()) {
            if (process.env.EARNEDSTAR_AUTH_DEV_BYPASS === '1') {
                return { id: 'dev-owner', email: 'dev@earnedstar.local' };
            }
            throw new common_1.UnauthorizedException('Auth not configured');
        }
        const res = await fetch(`${this.supabaseUrl}/auth/v1/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                apikey: this.serviceRoleKey,
            },
        });
        if (!res.ok) {
            throw new common_1.UnauthorizedException('Invalid or expired session');
        }
        const data = (await res.json());
        if (!data.id)
            throw new common_1.UnauthorizedException('Invalid session user');
        return { id: data.id, email: data.email };
    }
};
exports.SupabaseAuthService = SupabaseAuthService;
exports.SupabaseAuthService = SupabaseAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseAuthService);
//# sourceMappingURL=supabase-auth.service.js.map
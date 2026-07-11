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
var AuthorizeNetService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeNetService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AuthorizeNetService = AuthorizeNetService_1 = class AuthorizeNetService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(AuthorizeNetService_1.name);
        this.apiLoginId = this.config.get('AUTHNET_API_LOGIN_ID')?.trim() ?? null;
        this.transactionKey = this.config.get('AUTHNET_TRANSACTION_KEY')?.trim() ?? null;
        const rawEnv = this.config.get('AUTHNET_ENV')?.trim().toLowerCase();
        this.env = rawEnv === 'sandbox' ? 'sandbox' : 'production';
    }
    isConfigured() {
        return Boolean(this.apiLoginId && this.transactionKey);
    }
    getPublicConfig() {
        const publicClientKey = this.config.get('AUTHNET_PUBLIC_CLIENT_KEY')?.trim() ?? null;
        if (!this.apiLoginId || !publicClientKey)
            return null;
        return { apiLoginId: this.apiLoginId, publicClientKey, env: this.env };
    }
    apiUrl() {
        return this.env === 'sandbox'
            ? 'https://apitest.authorize.net/xml/v1/request.api'
            : 'https://api.authorize.net/xml/v1/request.api';
    }
    async postApi(body) {
        const res = await fetch(this.apiUrl(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            throw new common_1.ServiceUnavailableException(`Authorize.net HTTP ${res.status}`);
        }
        return (await res.json());
    }
    planAmountCents(plan) {
        const map = {
            starter: 2900,
            growth: 9900,
            pro: 24900,
            agency: 49900,
        };
        return map[plan] ?? 9900;
    }
    async createArbSubscription(params) {
        if (!this.isConfigured()) {
            if (process.env.EARNEDSTAR_BILLING_DEV_BYPASS === '1') {
                return {
                    subscriptionId: `dev-sub-${Date.now()}`,
                    customerProfileId: `dev-profile-${params.businessId}`,
                    mode: 'dev-bypass',
                };
            }
            throw new common_1.ServiceUnavailableException('Billing not configured (AUTHNET_API_LOGIN_ID / AUTHNET_TRANSACTION_KEY)');
        }
        const amount = (this.planAmountCents(params.plan) / 100).toFixed(2);
        const interval = { length: 1, unit: 'months' };
        const body = {
            ARBCreateSubscriptionRequest: {
                merchantAuthentication: {
                    name: this.apiLoginId,
                    transactionKey: this.transactionKey,
                },
                subscription: {
                    name: `EarnedStar ${params.plan}`,
                    paymentSchedule: {
                        interval,
                        startDate: new Date().toISOString().slice(0, 10),
                        totalOccurrences: 9999,
                    },
                    amount,
                    payment: {
                        opaqueData: {
                            dataDescriptor: params.opaqueData.dataDescriptor,
                            dataValue: params.opaqueData.dataValue,
                        },
                    },
                    customer: {
                        email: params.customerEmail,
                        ...(params.customerName ? { id: params.customerName.slice(0, 20) } : {}),
                    },
                    order: {
                        invoiceNumber: params.businessId.slice(0, 20),
                        description: `EarnedStar ${params.plan} plan`,
                    },
                },
            },
        };
        const response = await this.postApi(body);
        if (response.messages?.resultCode !== 'Ok' || !response.subscriptionId) {
            const msg = response.messages?.message?.[0]?.text ?? 'Authorize.net subscription failed';
            this.logger.error(msg);
            throw new common_1.ServiceUnavailableException(msg);
        }
        return {
            subscriptionId: response.subscriptionId,
            customerProfileId: response.profile?.customerProfileId ?? null,
            mode: 'live',
        };
    }
};
exports.AuthorizeNetService = AuthorizeNetService;
exports.AuthorizeNetService = AuthorizeNetService = AuthorizeNetService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthorizeNetService);
//# sourceMappingURL=authorize-net.service.js.map
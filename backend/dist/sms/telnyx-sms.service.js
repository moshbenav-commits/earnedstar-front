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
var TelnyxSmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelnyxSmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const TELNYX_MESSAGES_URL = 'https://api.telnyx.com/v2/messages';
let TelnyxSmsService = TelnyxSmsService_1 = class TelnyxSmsService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(TelnyxSmsService_1.name);
    }
    isConfigured() {
        return Boolean(this.apiKey() && this.fromNumber());
    }
    apiKey() {
        return this.config.get('TELNYX_API_KEY')?.trim() ?? '';
    }
    fromNumber() {
        return (this.config.get('TELNYX_SMS_FROM_NUMBER')?.trim() ||
            this.config.get('TELNYX_BRAND_TOLLFREE')?.trim() ||
            '');
    }
    messagingProfileId() {
        const id = this.config.get('TELNYX_MESSAGING_PROFILE_ID')?.trim();
        return id || undefined;
    }
    normalizePhone(phone) {
        const trimmed = phone.trim();
        if (trimmed.startsWith('+'))
            return trimmed;
        const digits = trimmed.replace(/\D/g, '');
        if (digits.length === 10)
            return `+1${digits}`;
        if (digits.length === 11 && digits.startsWith('1'))
            return `+${digits}`;
        return `+${digits}`;
    }
    async send(to, text) {
        if (!this.isConfigured()) {
            this.logger.warn('Telnyx SMS not configured — skipping send');
            return { sent: false, reason: 'sms_not_configured' };
        }
        const body = {
            from: this.fromNumber(),
            to: this.normalizePhone(to),
            text: text.slice(0, 1600),
        };
        const profileId = this.messagingProfileId();
        if (profileId)
            body.messaging_profile_id = profileId;
        const res = await fetch(TELNYX_MESSAGES_URL, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey()}`,
            },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(15_000),
        });
        const payload = (await res.json().catch(() => null));
        if (!res.ok) {
            const detail = payload?.errors?.[0]?.detail ||
                payload?.errors?.[0]?.title ||
                `Telnyx SMS failed (${res.status})`;
            this.logger.error(detail);
            return { sent: false, reason: detail };
        }
        return { sent: true, messageId: payload?.data?.id };
    }
};
exports.TelnyxSmsService = TelnyxSmsService;
exports.TelnyxSmsService = TelnyxSmsService = TelnyxSmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TelnyxSmsService);
//# sourceMappingURL=telnyx-sms.service.js.map
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
var ReviewPhotoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewPhotoService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
let ReviewPhotoService = ReviewPhotoService_1 = class ReviewPhotoService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(ReviewPhotoService_1.name);
    }
    supabaseUrl() {
        return this.config.get('SUPABASE_URL')?.replace(/\/$/, '') ?? null;
    }
    serviceRoleKey() {
        return this.config.get('SUPABASE_SERVICE_ROLE_KEY')?.trim() ?? null;
    }
    isConfigured() {
        return Boolean(this.supabaseUrl() && this.serviceRoleKey());
    }
    async uploadFromBase64(input) {
        if (!ALLOWED_TYPES.has(input.contentType)) {
            throw new common_1.BadRequestException('Only JPEG, PNG, WebP, and GIF images are allowed');
        }
        const buffer = Buffer.from(input.dataBase64, 'base64');
        if (buffer.length > MAX_BYTES) {
            throw new common_1.BadRequestException('Image must be 2 MB or smaller');
        }
        const ext = input.contentType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg';
        const objectPath = `${input.businessId}/${(0, crypto_1.randomUUID)()}.${ext}`;
        if (!this.isConfigured()) {
            this.logger.warn('Supabase storage not configured — returning data URL fallback');
            return `data:${input.contentType};base64,${input.dataBase64}`;
        }
        const base = this.supabaseUrl();
        const key = this.serviceRoleKey();
        const res = await fetch(`${base}/storage/v1/object/review-photos/${objectPath}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': input.contentType,
                'x-upsert': 'false',
            },
            body: buffer,
            signal: AbortSignal.timeout(20_000),
        });
        if (!res.ok) {
            const detail = await res.text().catch(() => res.statusText);
            this.logger.error(`Storage upload failed: ${detail}`);
            throw new common_1.BadRequestException('Failed to upload photo');
        }
        return `${base}/storage/v1/object/public/review-photos/${objectPath}`;
    }
};
exports.ReviewPhotoService = ReviewPhotoService;
exports.ReviewPhotoService = ReviewPhotoService = ReviewPhotoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ReviewPhotoService);
//# sourceMappingURL=review-photo.service.js.map
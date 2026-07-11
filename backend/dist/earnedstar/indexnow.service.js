"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var IndexNowService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexNowService = void 0;
const common_1 = require("@nestjs/common");
let IndexNowService = IndexNowService_1 = class IndexNowService {
    constructor() {
        this.logger = new common_1.Logger(IndexNowService_1.name);
    }
    siteUrl() {
        return (process.env.EARNEDSTAR_SITE_URL ?? 'https://earnedstar.com').replace(/\/$/, '');
    }
    isEnabled() {
        return Boolean(process.env.INDEXNOW_API_KEY?.trim());
    }
    profileUrl(slug) {
        return `${this.siteUrl()}/reviews/${slug}`;
    }
    keyLocation() {
        return `${this.siteUrl()}/indexnow-key.txt`;
    }
    async pingProfile(slug) {
        if (!this.isEnabled())
            return;
        const url = this.profileUrl(slug);
        try {
            const host = new URL(this.siteUrl()).host;
            const key = process.env.INDEXNOW_API_KEY.trim();
            const res = await fetch('https://api.indexnow.org/indexnow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify({
                    host,
                    key,
                    keyLocation: this.keyLocation(),
                    urlList: [url],
                }),
            });
            if (!res.ok) {
                this.logger.warn(`IndexNow ping failed (${res.status}) for ${url}`);
            }
            else {
                this.logger.log(`IndexNow pinged ${url}`);
            }
        }
        catch (err) {
            this.logger.warn(`IndexNow ping error for ${url}: ${err instanceof Error ? err.message : err}`);
        }
    }
    async pingAll(urls) {
        if (!this.isEnabled() || urls.length === 0) {
            return { ok: false, count: 0 };
        }
        const host = new URL(this.siteUrl()).host;
        const key = process.env.INDEXNOW_API_KEY.trim();
        const res = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({
                host,
                key,
                keyLocation: this.keyLocation(),
                urlList: urls.slice(0, 10000),
            }),
        });
        return { ok: res.ok, count: urls.length };
    }
};
exports.IndexNowService = IndexNowService;
exports.IndexNowService = IndexNowService = IndexNowService_1 = __decorate([
    (0, common_1.Injectable)()
], IndexNowService);
//# sourceMappingURL=indexnow.service.js.map
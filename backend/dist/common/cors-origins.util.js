"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_EARNEDSTAR_CORS_ORIGINS = void 0;
exports.resolveCorsOrigins = resolveCorsOrigins;
exports.DEFAULT_EARNEDSTAR_CORS_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://earnedstar.com',
    'https://www.earnedstar.com',
    'https://earnedstar.vercel.app',
    'https://earnedstar-front.vercel.app',
];
function resolveCorsOrigins() {
    const raw = process.env.CORS_ORIGIN?.trim();
    if (!raw)
        return [...exports.DEFAULT_EARNEDSTAR_CORS_ORIGINS];
    const configured = raw.split(',').map((s) => s.trim()).filter(Boolean);
    return [...new Set([...configured, ...exports.DEFAULT_EARNEDSTAR_CORS_ORIGINS])];
}
//# sourceMappingURL=cors-origins.util.js.map
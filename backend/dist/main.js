"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const cors_origins_util_1 = require("./common/cors-origins.util");
let cachedApp = null;
async function createApp() {
    const expressApp = (0, express_1.default)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
    app.setGlobalPrefix('api');
    app.enableCors({ origin: (0, cors_origins_util_1.resolveCorsOrigins)(), credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    await app.init();
    return expressApp;
}
async function bootstrap() {
    const port = Number(process.env.PORT) || 8081;
    const host = process.env.HOST || '::';
    const expressApp = await createApp();
    await expressApp.listen(port, host);
    console.log(`EarnedStar API listening on http://localhost:${port}/api`);
}
async function handler(req, res) {
    if (!cachedApp)
        cachedApp = await createApp();
    return cachedApp(req, res);
}
if (!process.env.VERCEL) {
    bootstrap();
}
//# sourceMappingURL=main.js.map
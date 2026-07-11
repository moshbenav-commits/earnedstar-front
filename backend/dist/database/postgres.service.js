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
var PostgresService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pg_1 = require("pg");
let PostgresService = PostgresService_1 = class PostgresService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(PostgresService_1.name);
        this.pool = null;
    }
    async onModuleInit() {
        const url = this.config.get('DATABASE_URL')?.trim();
        if (!url) {
            this.logger.log('DATABASE_URL not set — mock mode enabled');
            return;
        }
        this.pool = new pg_1.Pool({
            connectionString: url,
            ssl: { rejectUnauthorized: false },
            max: 5,
            idleTimeoutMillis: 30_000,
            connectionTimeoutMillis: 10_000,
        });
        this.logger.log('Postgres pool initialized');
    }
    async onModuleDestroy() {
        await this.pool?.end();
        this.pool = null;
    }
    isConfigured() {
        return Boolean(this.config.get('DATABASE_URL')?.trim());
    }
    async ping() {
        if (!this.isConfigured())
            return { configured: false, connected: false };
        if (!this.pool)
            return { configured: true, connected: false, error: 'Pool not initialized' };
        let client;
        try {
            client = await this.pool.connect();
            const row = await client.query('SELECT current_database() AS db');
            return { configured: true, connected: true, database: row.rows[0]?.db };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { configured: true, connected: false, error: message };
        }
        finally {
            client?.release();
        }
    }
    async query(text, params) {
        if (!this.pool)
            throw new Error('Postgres is not configured (set DATABASE_URL)');
        return this.pool.query(text, params);
    }
    async queryOne(text, params) {
        const result = await this.query(text, params);
        return result.rows[0] ?? null;
    }
    async queryMany(text, params) {
        const result = await this.query(text, params);
        return result.rows;
    }
};
exports.PostgresService = PostgresService;
exports.PostgresService = PostgresService = PostgresService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PostgresService);
//# sourceMappingURL=postgres.service.js.map
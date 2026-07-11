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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var SmtpEmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmtpEmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
let SmtpEmailService = SmtpEmailService_1 = class SmtpEmailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(SmtpEmailService_1.name);
        this.transporter = null;
        this.transporterKey = '';
    }
    resolveConfig() {
        const host = this.config.get('SMTP_HOST')?.trim() ?? '';
        if (!host) {
            return {
                host: '',
                port: 587,
                user: '',
                pass: '',
                from: 'EarnedStar <invitations@earnedstar.com>',
                source: 'none',
            };
        }
        const port = Number(this.config.get('SMTP_PORT') ?? 587) || 587;
        return {
            host,
            port,
            user: this.config.get('SMTP_USER')?.trim() ?? '',
            pass: this.config.get('SMTP_PASS') ?? '',
            from: this.config.get('SMTP_FROM')?.trim() ??
                'EarnedStar Invitations <invitations@earnedstar.com>',
            replyTo: this.config.get('SMTP_REPLY_TO')?.trim() || undefined,
            source: 'environment',
        };
    }
    isConfigured() {
        const smtp = this.resolveConfig();
        return Boolean(smtp.host && smtp.user && smtp.pass);
    }
    getTransporter(smtp) {
        const key = `${smtp.host}|${smtp.port}|${smtp.user}`;
        if (this.transporter && this.transporterKey === key)
            return this.transporter;
        this.transporter = nodemailer_1.default.createTransport({
            host: smtp.host,
            port: smtp.port,
            secure: smtp.port === 465,
            auth: { user: smtp.user, pass: smtp.pass },
        });
        this.transporterKey = key;
        return this.transporter;
    }
    async send(params) {
        const smtp = this.resolveConfig();
        if (!smtp.host) {
            this.logger.warn(`SMTP not configured — preview only. To: ${params.to} | Subject: ${params.subject}`);
            return { sent: false, mode: 'log', reason: 'smtp_not_configured' };
        }
        if (!smtp.user || !smtp.pass) {
            this.logger.warn('SMTP_HOST set but SMTP_USER / SMTP_PASS missing');
            return { sent: false, mode: 'log', reason: 'smtp_credentials_missing' };
        }
        try {
            const transporter = this.getTransporter(smtp);
            await transporter.sendMail({
                from: params.from ?? smtp.from,
                to: params.to,
                replyTo: params.replyTo ?? smtp.replyTo,
                subject: params.subject,
                html: params.html,
                text: params.text,
            });
            return { sent: true, mode: 'smtp' };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            this.logger.error(`SMTP send failed for ${params.to}: ${message}`);
            return { sent: false, mode: 'log', reason: message };
        }
    }
};
exports.SmtpEmailService = SmtpEmailService;
exports.SmtpEmailService = SmtpEmailService = SmtpEmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SmtpEmailService);
//# sourceMappingURL=smtp-email.service.js.map
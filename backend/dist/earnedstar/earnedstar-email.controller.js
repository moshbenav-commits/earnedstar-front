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
exports.EarnedstarEmailController = void 0;
const common_1 = require("@nestjs/common");
const smtp_email_service_1 = require("../email/smtp-email.service");
const invitation_email_service_1 = require("../email/invitation-email.service");
let EarnedstarEmailController = class EarnedstarEmailController {
    constructor(smtp, invitations) {
        this.smtp = smtp;
        this.invitations = invitations;
    }
    status() {
        const smtp = this.smtp.resolveConfig();
        return {
            provider: smtp.source === 'environment' && this.smtp.isConfigured() ? 'smtp' : 'unconfigured',
            smtp: {
                configured: this.smtp.isConfigured(),
                host: smtp.host || null,
                from: smtp.from,
                replyTo: smtp.replyTo ?? null,
            },
            invitationsReady: this.invitations.isConfigured(),
            hint: this.smtp.isConfigured()
                ? 'Mail Gorilla SMTP ready — invitations@earnedstar.com'
                : 'Set SMTP_HOST, SMTP_USER, SMTP_PASS on earnedstar-back Vercel',
        };
    }
};
exports.EarnedstarEmailController = EarnedstarEmailController;
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EarnedstarEmailController.prototype, "status", null);
exports.EarnedstarEmailController = EarnedstarEmailController = __decorate([
    (0, common_1.Controller)('earnedstar/email'),
    __metadata("design:paramtypes", [smtp_email_service_1.SmtpEmailService,
        invitation_email_service_1.InvitationEmailService])
], EarnedstarEmailController);
//# sourceMappingURL=earnedstar-email.controller.js.map
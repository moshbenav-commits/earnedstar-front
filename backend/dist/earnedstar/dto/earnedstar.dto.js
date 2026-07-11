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
exports.ReviewAuditDto = exports.SuggestQaAnswerDto = exports.OrderFulfilledWebhookDto = exports.SubscribeBillingDto = exports.ProvisionMerchantDto = exports.BulkSendInvitationsDto = exports.SendInvitationDto = exports.UpdateMerchantProfileDto = exports.CompleteOnboardingDto = exports.UpdateQaItemDto = exports.PublicAskQaDto = exports.CreateQaItemDto = exports.CreateAgencyClientDto = exports.ConnectShopifyDto = exports.CreateWidgetDto = exports.InviteTeamMemberDto = exports.RespondReviewDto = exports.ModerateReviewDto = exports.UploadReviewPhotoDto = exports.SubmitReviewDto = void 0;
const class_validator_1 = require("class-validator");
class SubmitReviewDto {
}
exports.SubmitReviewDto = SubmitReviewDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], SubmitReviewDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], SubmitReviewDto.prototype, "rating_overall", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitReviewDto.prototype, "review_title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20),
    __metadata("design:type", String)
], SubmitReviewDto.prototype, "review_text", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], SubmitReviewDto.prototype, "customer_name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SubmitReviewDto.prototype, "customer_email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitReviewDto.prototype, "order_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(5),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SubmitReviewDto.prototype, "photos", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitReviewDto.prototype, "video_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], SubmitReviewDto.prototype, "rating_fitment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], SubmitReviewDto.prototype, "rating_quality", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], SubmitReviewDto.prototype, "rating_shipping", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], SubmitReviewDto.prototype, "rating_description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], SubmitReviewDto.prototype, "rating_install", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SubmitReviewDto.prototype, "ymm_year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitReviewDto.prototype, "ymm_make", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitReviewDto.prototype, "ymm_model", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitReviewDto.prototype, "ymm_trim", void 0);
class UploadReviewPhotoDto {
}
exports.UploadReviewPhotoDto = UploadReviewPhotoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], UploadReviewPhotoDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], UploadReviewPhotoDto.prototype, "filename", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], UploadReviewPhotoDto.prototype, "content_type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], UploadReviewPhotoDto.prototype, "data_base64", void 0);
class ModerateReviewDto {
}
exports.ModerateReviewDto = ModerateReviewDto;
__decorate([
    (0, class_validator_1.IsIn)(['published', 'rejected']),
    __metadata("design:type", String)
], ModerateReviewDto.prototype, "status", void 0);
class RespondReviewDto {
}
exports.RespondReviewDto = RespondReviewDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    __metadata("design:type", String)
], RespondReviewDto.prototype, "business_response", void 0);
class InviteTeamMemberDto {
}
exports.InviteTeamMemberDto = InviteTeamMemberDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InviteTeamMemberDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['admin', 'viewer']),
    __metadata("design:type", String)
], InviteTeamMemberDto.prototype, "role", void 0);
class CreateWidgetDto {
}
exports.CreateWidgetDto = CreateWidgetDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateWidgetDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['badge', 'carousel', 'list', 'testimonial', 'grid', 'floating']),
    __metadata("design:type", String)
], CreateWidgetDto.prototype, "widget_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateWidgetDto.prototype, "config", void 0);
class ConnectShopifyDto {
}
exports.ConnectShopifyDto = ConnectShopifyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], ConnectShopifyDto.prototype, "shop", void 0);
class CreateAgencyClientDto {
}
exports.CreateAgencyClientDto = CreateAgencyClientDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateAgencyClientDto.prototype, "business_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgencyClientDto.prototype, "website_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgencyClientDto.prototype, "slug", void 0);
class CreateQaItemDto {
}
exports.CreateQaItemDto = CreateQaItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    __metadata("design:type", String)
], CreateQaItemDto.prototype, "question", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQaItemDto.prototype, "answer", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQaItemDto.prototype, "asked_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateQaItemDto.prototype, "published", void 0);
class PublicAskQaDto {
}
exports.PublicAskQaDto = PublicAskQaDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], PublicAskQaDto.prototype, "question", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], PublicAskQaDto.prototype, "asked_by", void 0);
class UpdateQaItemDto {
}
exports.UpdateQaItemDto = UpdateQaItemDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    __metadata("design:type", String)
], UpdateQaItemDto.prototype, "question", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQaItemDto.prototype, "answer", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateQaItemDto.prototype, "published", void 0);
class CompleteOnboardingDto {
}
exports.CompleteOnboardingDto = CompleteOnboardingDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "business_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "website_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "industry", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "email_from_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "email_subject_template", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(3),
    (0, class_validator_1.Max)(14),
    __metadata("design:type", Number)
], CompleteOnboardingDto.prototype, "invite_delay_days", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "logo_url", void 0);
class UpdateMerchantProfileDto {
}
exports.UpdateMerchantProfileDto = UpdateMerchantProfileDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "website_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(70),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "seo_title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "seo_description", void 0);
class SendInvitationDto {
}
exports.SendInvitationDto = SendInvitationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SendInvitationDto.prototype, "customer_email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendInvitationDto.prototype, "customer_phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendInvitationDto.prototype, "customer_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendInvitationDto.prototype, "order_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['email', 'sms', 'link']),
    __metadata("design:type", String)
], SendInvitationDto.prototype, "channel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(14),
    __metadata("design:type", Number)
], SendInvitationDto.prototype, "delay_days", void 0);
class BulkSendInvitationsDto {
}
exports.BulkSendInvitationsDto = BulkSendInvitationsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(100),
    __metadata("design:type", Array)
], BulkSendInvitationsDto.prototype, "invitations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['email', 'sms', 'link']),
    __metadata("design:type", String)
], BulkSendInvitationsDto.prototype, "default_channel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(14),
    __metadata("design:type", Number)
], BulkSendInvitationsDto.prototype, "default_delay_days", void 0);
class ProvisionMerchantDto {
}
exports.ProvisionMerchantDto = ProvisionMerchantDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], ProvisionMerchantDto.prototype, "owner_id", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ProvisionMerchantDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], ProvisionMerchantDto.prototype, "business_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProvisionMerchantDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProvisionMerchantDto.prototype, "plan", void 0);
class SubscribeBillingDto {
}
exports.SubscribeBillingDto = SubscribeBillingDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscribeBillingDto.prototype, "plan", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SubscribeBillingDto.prototype, "customer_email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscribeBillingDto.prototype, "customer_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscribeBillingDto.prototype, "dataDescriptor", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscribeBillingDto.prototype, "dataValue", void 0);
class OrderFulfilledWebhookDto {
}
exports.OrderFulfilledWebhookDto = OrderFulfilledWebhookDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderFulfilledWebhookDto.prototype, "order_id", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], OrderFulfilledWebhookDto.prototype, "customer_email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderFulfilledWebhookDto.prototype, "customer_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderFulfilledWebhookDto.prototype, "merchant_slug", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderFulfilledWebhookDto.prototype, "product_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderFulfilledWebhookDto.prototype, "delivery_date", void 0);
class SuggestQaAnswerDto {
}
exports.SuggestQaAnswerDto = SuggestQaAnswerDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], SuggestQaAnswerDto.prototype, "question", void 0);
class ReviewAuditDto {
}
exports.ReviewAuditDto = ReviewAuditDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], ReviewAuditDto.prototype, "url", void 0);
//# sourceMappingURL=earnedstar.dto.js.map
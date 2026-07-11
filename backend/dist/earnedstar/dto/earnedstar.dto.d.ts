export declare class SubmitReviewDto {
    token: string;
    rating_overall: number;
    review_title?: string;
    review_text: string;
    customer_name: string;
    customer_email: string;
    order_id?: string;
    photos?: string[];
    video_url?: string;
    rating_fitment?: number;
    rating_quality?: number;
    rating_shipping?: number;
    rating_description?: number;
    rating_install?: number;
    ymm_year?: number;
    ymm_make?: string;
    ymm_model?: string;
    ymm_trim?: string;
}
export declare class UploadReviewPhotoDto {
    token: string;
    filename: string;
    content_type: string;
    data_base64: string;
}
export declare class ModerateReviewDto {
    status: 'published' | 'rejected';
}
export declare class RespondReviewDto {
    business_response: string;
}
export declare class InviteTeamMemberDto {
    email: string;
    role?: 'admin' | 'viewer';
}
export declare class CreateWidgetDto {
    name: string;
    widget_type: string;
    config?: Record<string, unknown>;
}
export declare class ConnectShopifyDto {
    shop: string;
}
export declare class CreateAgencyClientDto {
    business_name: string;
    website_url?: string;
    slug?: string;
}
export declare class CreateQaItemDto {
    question: string;
    answer?: string;
    asked_by?: string;
    published?: boolean;
}
export declare class PublicAskQaDto {
    question: string;
    asked_by?: string;
}
export declare class UpdateQaItemDto {
    question?: string;
    answer?: string;
    published?: boolean;
}
export declare class CompleteOnboardingDto {
    business_name?: string;
    website_url?: string;
    industry?: string;
    platform?: string;
    email_from_name?: string;
    email_subject_template?: string;
    invite_delay_days?: number;
    logo_url?: string;
}
export declare class UpdateMerchantProfileDto {
    name?: string;
    website_url?: string;
    seo_title?: string;
    seo_description?: string;
}
export declare class SendInvitationDto {
    customer_email?: string;
    customer_phone?: string;
    customer_name?: string;
    order_id: string;
    channel?: 'email' | 'sms' | 'link';
    delay_days?: number;
}
export declare class BulkSendInvitationsDto {
    invitations: SendInvitationDto[];
    default_channel?: 'email' | 'sms' | 'link';
    default_delay_days?: number;
}
export declare class ProvisionMerchantDto {
    owner_id: string;
    email: string;
    business_name: string;
    slug?: string;
    plan?: string;
}
export declare class SubscribeBillingDto {
    plan: string;
    customer_email: string;
    customer_name?: string;
    dataDescriptor: string;
    dataValue: string;
}
export declare class OrderFulfilledWebhookDto {
    order_id: string;
    customer_email: string;
    customer_name?: string;
    merchant_slug?: string;
    product_name?: string;
    delivery_date?: string;
}
export declare class SuggestQaAnswerDto {
    question: string;
}
export declare class ReviewAuditDto {
    url: string;
}

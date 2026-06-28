/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class SubmitReviewDto {
  @IsString()
  @MinLength(1)
  token!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating_overall!: number;

  @IsOptional()
  @IsString()
  review_title?: string;

  @IsString()
  @MinLength(20)
  review_text!: string;

  @IsString()
  @MinLength(1)
  customer_name!: string;

  @IsEmail()
  customer_email!: string;

  @IsOptional()
  @IsString()
  order_id?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  photos?: string[];

  @IsOptional()
  @IsString()
  video_url?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating_fitment?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating_quality?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating_shipping?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating_description?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating_install?: number;

  @IsOptional()
  @IsInt()
  ymm_year?: number;

  @IsOptional()
  @IsString()
  ymm_make?: string;

  @IsOptional()
  @IsString()
  ymm_model?: string;

  @IsOptional()
  @IsString()
  ymm_trim?: string;
}

export class UploadReviewPhotoDto {
  @IsString()
  @MinLength(1)
  token!: string;

  @IsString()
  @MinLength(1)
  filename!: string;

  @IsString()
  @MinLength(3)
  content_type!: string;

  @IsString()
  @MinLength(1)
  data_base64!: string;
}

export class ModerateReviewDto {
  @IsIn(['published', 'rejected'])
  status!: 'published' | 'rejected';
}

export class RespondReviewDto {
  @IsString()
  @MinLength(5)
  business_response!: string;
}

export class InviteTeamMemberDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsIn(['admin', 'viewer'])
  role?: 'admin' | 'viewer';
}

export class CreateWidgetDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsIn(['badge', 'carousel', 'list', 'testimonial', 'grid', 'floating'])
  widget_type!: string;

  @IsOptional()
  config?: Record<string, unknown>;
}

export class ConnectShopifyDto {
  @IsString()
  @MinLength(3)
  shop!: string;
}

export class CreateAgencyClientDto {
  @IsString()
  @MinLength(1)
  business_name!: string;

  @IsOptional()
  @IsString()
  website_url?: string;

  @IsOptional()
  @IsString()
  slug?: string;
}

export class CreateQaItemDto {
  @IsString()
  @MinLength(5)
  question!: string;

  @IsOptional()
  @IsString()
  answer?: string;

  @IsOptional()
  @IsString()
  asked_by?: string;

  @IsOptional()
  published?: boolean;
}

export class PublicAskQaDto {
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  question!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  asked_by?: string;
}

export class UpdateQaItemDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  question?: string;

  @IsOptional()
  @IsString()
  answer?: string;

  @IsOptional()
  published?: boolean;
}

export class CompleteOnboardingDto {
  @IsOptional()
  @IsString()
  business_name?: string;

  @IsOptional()
  @IsString()
  website_url?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  email_from_name?: string;

  @IsOptional()
  @IsString()
  email_subject_template?: string;

  @IsOptional()
  @IsInt()
  @Min(3)
  @Max(14)
  invite_delay_days?: number;

  @IsOptional()
  @IsString()
  logo_url?: string;
}

export class UpdateMerchantProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  website_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(70)
  seo_title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  seo_description?: string;
}

export class SendInvitationDto {
  @IsOptional()
  @IsEmail()
  customer_email?: string;

  @IsOptional()
  @IsString()
  customer_phone?: string;

  @IsOptional()
  @IsString()
  customer_name?: string;

  @IsString()
  order_id!: string;

  @IsOptional()
  @IsIn(['email', 'sms', 'link'])
  channel?: 'email' | 'sms' | 'link';

  /** Days after today to send (0 = immediately). */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(14)
  delay_days?: number;
}

export class BulkSendInvitationsDto {
  @IsArray()
  @ArrayMaxSize(100)
  invitations!: SendInvitationDto[];

  @IsOptional()
  @IsIn(['email', 'sms', 'link'])
  default_channel?: 'email' | 'sms' | 'link';

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(14)
  default_delay_days?: number;
}

export class ProvisionMerchantDto {
  @IsString()
  @MinLength(1)
  owner_id!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  business_name!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  plan?: string;
}

export class SubscribeBillingDto {
  @IsString()
  plan!: string;

  @IsEmail()
  customer_email!: string;

  @IsOptional()
  @IsString()
  customer_name?: string;

  @IsString()
  dataDescriptor!: string;

  @IsString()
  dataValue!: string;
}

export class OrderFulfilledWebhookDto {
  @IsString()
  order_id!: string;

  @IsEmail()
  customer_email!: string;

  @IsOptional()
  @IsString()
  customer_name?: string;

  @IsOptional()
  @IsString()
  merchant_slug?: string;

  @IsOptional()
  @IsString()
  product_name?: string;

  @IsOptional()
  @IsString()
  delivery_date?: string;
}

export class SuggestQaAnswerDto {
  @IsString()
  @MinLength(3)
  question!: string;
}

export class ReviewAuditDto {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  url!: string;
}

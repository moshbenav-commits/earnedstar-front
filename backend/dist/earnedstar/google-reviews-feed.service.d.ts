import type { EarnedStarMerchant, EarnedStarReview } from './earnedstar.service';
export declare class GoogleReviewsFeedService {
    buildProductReviewsXml(merchant: EarnedStarMerchant, reviews: EarnedStarReview[]): string;
}

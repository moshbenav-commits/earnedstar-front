import { EarnedstarService } from './earnedstar.service';
export declare class EarnedstarMerchantsController {
    private readonly earnedstar;
    constructor(earnedstar: EarnedstarService);
    profile(slug: string): Promise<{
        merchant: import("./earnedstar.service").EarnedStarMerchant;
        ratingDistribution: {
            stars: number;
            count: number;
            pct: number;
        }[];
        attributeAverages: {
            fitment: number;
            quality: number;
            shipping: number;
            description: number;
            install: number;
        };
    }>;
    getBySlug(slug: string): Promise<import("./earnedstar.service").EarnedStarMerchant>;
    schema(slug: string): {
        '@context': string;
        '@type': string;
        name: string;
        url: string;
        image: string | undefined;
        aggregateRating: {
            '@type': string;
            ratingValue: number;
            reviewCount: number;
            bestRating: number;
            worstRating: number;
        };
    } | Promise<{
        '@context': string;
        '@type': string;
        name: string;
        url: string;
        image: string | undefined;
        aggregateRating: {
            '@type': string;
            ratingValue: number;
            reviewCount: number;
            bestRating: number;
            worstRating: number;
        };
    }>;
}

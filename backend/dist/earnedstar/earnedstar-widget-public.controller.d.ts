import { EarnedstarService } from './earnedstar.service';
export declare class EarnedstarWidgetPublicController {
    private readonly earnedstar;
    constructor(earnedstar: EarnedstarService);
    getBySlug(slug: string, max?: string): Promise<{
        merchant: {
            name: string;
            slug: string;
            avg_rating: number;
            review_count: number;
            logo_url: string | null;
            website_url: string | null;
        };
        reviews: {
            id: string;
            customer_name: string;
            rating_overall: number;
            review_text: string | null;
            created_at: string;
            photos: string[];
            product_name: string | null | undefined;
        }[];
        embed: {
            script: string;
            api_key: string | undefined;
        };
    }>;
}

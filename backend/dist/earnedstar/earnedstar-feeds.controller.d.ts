import type { Response } from 'express';
import { EarnedstarService } from './earnedstar.service';
import { GoogleReviewsFeedService } from './google-reviews-feed.service';
export declare class EarnedstarFeedsController {
    private readonly earnedstar;
    private readonly googleFeed;
    constructor(earnedstar: EarnedstarService, googleFeed: GoogleReviewsFeedService);
    googleReviewsXml(slug: string, res: Response): Promise<void>;
    trustpilotJson(slug: string): Promise<{
        businessUnit: {
            id: string;
            displayName: string;
            score: number;
            numberOfReviews: number;
            websiteUrl: string;
        };
        reviews: {
            id: string;
            consumer: {
                displayName: string;
            };
            stars: number;
            title: string;
            text: string | null;
            createdAt: string;
            verified: boolean;
        }[];
        exportedAt: string;
        source: string;
    }>;
}

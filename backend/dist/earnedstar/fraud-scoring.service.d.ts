import type { SubmitReviewDto } from '../earnedstar/dto/earnedstar.dto';
export type FraudVerdict = {
    score: number;
    reasons: string[];
    status: 'published' | 'pending' | 'flagged';
};
export declare class FraudScoringService {
    private similarityScore;
    scoreSubmission(dto: SubmitReviewDto, recentTexts?: string[]): FraudVerdict;
}

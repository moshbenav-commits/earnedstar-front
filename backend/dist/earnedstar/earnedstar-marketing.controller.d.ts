import { EarnedstarMarketingService } from './earnedstar-marketing.service';
import { ReviewAuditDto } from './dto/earnedstar.dto';
export declare class EarnedstarMarketingController {
    private readonly marketing;
    constructor(marketing: EarnedstarMarketingService);
    getTrustCounter(): Promise<import("./earnedstar-marketing.service").TrustCounterPayload>;
    runReviewAudit(dto: ReviewAuditDto): Promise<{
        url: string;
        audit: import("./earnedstar-marketing.service").ReviewAuditPayload;
    }>;
}

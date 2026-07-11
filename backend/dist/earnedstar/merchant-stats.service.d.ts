import { PostgresService } from '../database/postgres.service';
export declare class MerchantStatsService {
    private readonly postgres;
    constructor(postgres: PostgresService);
    refreshForBusiness(businessId: string): Promise<void>;
}

/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Injectable } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';

@Injectable()
export class MerchantStatsService {
  constructor(private readonly postgres: PostgresService) {}

  async refreshForBusiness(businessId: string): Promise<void> {
    await this.postgres.query(
      `UPDATE businesses b SET
         review_count = sub.cnt,
         avg_rating = sub.avg
       FROM (
         SELECT COUNT(*)::int AS cnt, COALESCE(AVG(rating_overall), 0)::decimal(3,2) AS avg
         FROM reviews WHERE business_id = $1::uuid AND status = 'published'
       ) sub
       WHERE b.id = $1::uuid`,
      [businessId],
    );
  }
}

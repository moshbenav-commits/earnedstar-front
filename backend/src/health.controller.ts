/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Controller, Get } from '@nestjs/common';
import { PostgresService } from './database/postgres.service';

@Controller('health')
export class HealthController {
  constructor(private readonly postgres: PostgresService) {}

  @Get()
  async check() {
    const postgres = await this.postgres.ping();
    return {
      status: 'ok',
      service: 'earnedstar-back',
      postgres,
    };
  }
}

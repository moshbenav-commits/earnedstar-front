/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Global, Module } from '@nestjs/common';
import { PostgresService } from './postgres.service';

@Global()
@Module({
  providers: [PostgresService],
  exports: [PostgresService],
})
export class DatabaseModule {}

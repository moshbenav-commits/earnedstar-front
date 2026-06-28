/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiRootController {
  @Get()
  root() {
    return {
      service: 'earnedstar-back',
      version: '0.1.0',
      docs: 'https://github.com/moshbenav-commits/earnedstar-back',
    };
  }
}

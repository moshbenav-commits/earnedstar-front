/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { type Express } from 'express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { resolveCorsOrigins } from './common/cors-origins.util';

let cachedApp: Express | null = null;

async function createApp(): Promise<Express> {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  app.setGlobalPrefix('api');
  app.enableCors({ origin: resolveCorsOrigins(), credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.init();
  return expressApp;
}

async function bootstrap() {
  const port = Number(process.env.PORT) || 8081;
  const host = process.env.HOST || '::';
  const expressApp = await createApp();
  await expressApp.listen(port, host);
  console.log(`EarnedStar API listening on http://localhost:${port}/api`);
}

export default async function handler(req: express.Request, res: express.Response) {
  if (!cachedApp) cachedApp = await createApp();
  return cachedApp(req, res);
}

if (!process.env.VERCEL) {
  bootstrap();
}

/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';

export type PostgresHealth = {
  configured: boolean;
  connected: boolean;
  database?: string;
  error?: string;
};

@Injectable()
export class PostgresService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PostgresService.name);
  private pool: Pool | null = null;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const url = this.config.get<string>('DATABASE_URL')?.trim();
    if (!url) {
      this.logger.log('DATABASE_URL not set — mock mode enabled');
      return;
    }

    this.pool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });

    this.logger.log('Postgres pool initialized');
  }

  async onModuleDestroy() {
    await this.pool?.end();
    this.pool = null;
  }

  isConfigured(): boolean {
    return Boolean(this.config.get<string>('DATABASE_URL')?.trim());
  }

  async ping(): Promise<PostgresHealth> {
    if (!this.isConfigured()) return { configured: false, connected: false };
    if (!this.pool) return { configured: true, connected: false, error: 'Pool not initialized' };

    let client: PoolClient | undefined;
    try {
      client = await this.pool.connect();
      const row = await client.query<{ db: string }>('SELECT current_database() AS db');
      return { configured: true, connected: true, database: row.rows[0]?.db };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { configured: true, connected: false, error: message };
    } finally {
      client?.release();
    }
  }

  async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> {
    if (!this.pool) throw new Error('Postgres is not configured (set DATABASE_URL)');
    return this.pool.query<T>(text, params);
  }

  async queryOne<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<T | null> {
    const result = await this.query<T>(text, params);
    return result.rows[0] ?? null;
  }

  async queryMany<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<T[]> {
    const result = await this.query<T>(text, params);
    return result.rows;
  }
}

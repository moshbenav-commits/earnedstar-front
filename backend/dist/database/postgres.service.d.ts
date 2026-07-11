import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type QueryResult, type QueryResultRow } from 'pg';
export type PostgresHealth = {
    configured: boolean;
    connected: boolean;
    database?: string;
    error?: string;
};
export declare class PostgresService implements OnModuleInit, OnModuleDestroy {
    private readonly config;
    private readonly logger;
    private pool;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    isConfigured(): boolean;
    ping(): Promise<PostgresHealth>;
    query<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]): Promise<QueryResult<T>>;
    queryOne<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]): Promise<T | null>;
    queryMany<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]): Promise<T[]>;
}

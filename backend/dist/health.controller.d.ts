import { PostgresService } from './database/postgres.service';
export declare class HealthController {
    private readonly postgres;
    constructor(postgres: PostgresService);
    check(): Promise<{
        status: string;
        service: string;
        postgres: import("./database/postgres.service").PostgresHealth;
    }>;
}

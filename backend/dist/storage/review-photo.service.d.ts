import { ConfigService } from '@nestjs/config';
export declare class ReviewPhotoService {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    private supabaseUrl;
    private serviceRoleKey;
    isConfigured(): boolean;
    uploadFromBase64(input: {
        businessId: string;
        filename: string;
        contentType: string;
        dataBase64: string;
    }): Promise<string>;
}

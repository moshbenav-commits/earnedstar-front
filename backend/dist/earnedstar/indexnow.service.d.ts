export declare class IndexNowService {
    private readonly logger;
    private siteUrl;
    isEnabled(): boolean;
    profileUrl(slug: string): string;
    keyLocation(): string;
    pingProfile(slug: string): Promise<void>;
    pingAll(urls: string[]): Promise<{
        ok: boolean;
        count: number;
    }>;
}

import { CanActivate, ExecutionContext } from '@nestjs/common';
import { SupabaseAuthService } from './supabase-auth.service';
export declare class MerchantAuthGuard implements CanActivate {
    private readonly auth;
    constructor(auth: SupabaseAuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

/** Mirrors @expedia/site-kit — see docs/fleet/PAYMENTS_INACTIVE.md */

export const PAYMENTS_INACTIVE_MESSAGE =
  'Enrollment / checkout coming soon — contact us to register';

export const PAYMENTS_INACTIVE_SHORT = 'Payments not yet active';

function parsePaymentsFlag(raw: string | undefined): boolean {
  if (!raw) return false;
  const v = raw.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

export function paymentsEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const publicFlag = env.NEXT_PUBLIC_PAYMENTS_ENABLED;
  const serverFlag = env.PAYMENTS_ENABLED;
  return parsePaymentsFlag(publicFlag) || parsePaymentsFlag(serverFlag);
}

export function pricingCtaHref(
  checkoutPath: string,
  fallbackPath = '/contact',
  env: NodeJS.ProcessEnv = process.env,
): string {
  return paymentsEnabled(env) ? checkoutPath : fallbackPath;
}

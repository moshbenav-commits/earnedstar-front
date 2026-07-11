declare const TEMPLATE_NAMES: readonly ["review-request", "review-reminder", "response-notification"];
export type EmailTemplateName = (typeof TEMPLATE_NAMES)[number];
export declare function renderEmailTemplate(name: EmailTemplateName, vars: Record<string, string | number | undefined | null>): string;
export {};

import type { PageSpeedData } from '../types.js';
/**
 * Fetch PageSpeed Insights for a URL.
 * Works without API key (rate-limited) or with key (25K/day).
 */
export declare function fetchPageSpeed(url: string, strategy?: 'mobile' | 'desktop'): Promise<PageSpeedData>;
/** Fetch both mobile and desktop PageSpeed data */
export declare function fetchPageSpeedFull(url: string): Promise<{
    mobile: PageSpeedData;
    desktop: PageSpeedData;
}>;
/** Quick DNS/HTTP check for a URL */
export declare function quickSiteCheck(url: string): Promise<{
    statusCode: number;
    redirects: boolean;
    hasSSL: boolean;
    responseTimeMs: number;
    headers: Record<string, string>;
}>;

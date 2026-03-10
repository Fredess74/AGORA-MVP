/* ═══════════════════════════════════════════════════════════
   Google PageSpeed Insights API Client
   ═══════════════════════════════════════════════════════════ */
import { config } from '../config.js';
/**
 * Fetch PageSpeed Insights for a URL.
 * Works without API key (rate-limited) or with key (25K/day).
 */
export async function fetchPageSpeed(url, strategy = 'mobile') {
    const params = new URLSearchParams({
        url,
        strategy,
        category: 'performance',
    });
    if (config.pageSpeedApiKey)
        params.set('key', config.pageSpeedApiKey);
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`;
    const res = await fetch(apiUrl);
    if (!res.ok)
        throw new Error(`PageSpeed API ${res.status}: ${res.statusText}`);
    const data = await res.json();
    const lhr = data.lighthouseResult;
    const audits = lhr?.audits || {};
    const categories = lhr?.categories || {};
    // Extract Core Web Vitals
    const perfScore = (categories.performance?.score ?? 0) * 100;
    const lcp = audits['largest-contentful-paint']?.numericValue ?? 0;
    const fid = audits['max-potential-fid']?.numericValue ?? 0;
    const cls = audits['cumulative-layout-shift']?.numericValue ?? 0;
    const fcp = audits['first-contentful-paint']?.numericValue ?? 0;
    const tti = audits['interactive']?.numericValue ?? 0;
    const si = audits['speed-index']?.numericValue ?? 0;
    const tbt = audits['total-blocking-time']?.numericValue ?? 0;
    // Extract opportunities
    const opportunities = Object.values(audits)
        .filter((a) => a.details?.type === 'opportunity' && a.details?.overallSavingsMs > 0)
        .map((a) => ({
        title: a.title || '',
        savings: `${Math.round(a.details.overallSavingsMs)}ms`,
    }))
        .slice(0, 5);
    // Extract diagnostics
    const diagnostics = Object.values(audits)
        .filter((a) => a.details?.type === 'table' && a.score !== null && a.score < 0.9)
        .map((a) => ({
        title: a.title || '',
        description: a.description || '',
    }))
        .slice(0, 5);
    return {
        url,
        strategy,
        performanceScore: Math.round(perfScore),
        lcpMs: Math.round(lcp),
        fidMs: Math.round(fid),
        clsScore: Math.round(cls * 1000) / 1000,
        fcpMs: Math.round(fcp),
        ttiMs: Math.round(tti),
        speedIndex: Math.round(si),
        totalBlockingTime: Math.round(tbt),
        opportunities,
        diagnostics,
    };
}
/** Fetch both mobile and desktop PageSpeed data */
export async function fetchPageSpeedFull(url) {
    const [mobile, desktop] = await Promise.all([
        fetchPageSpeed(url, 'mobile'),
        fetchPageSpeed(url, 'desktop'),
    ]);
    return { mobile, desktop };
}
/** Quick DNS/HTTP check for a URL */
export async function quickSiteCheck(url) {
    const start = Date.now();
    const res = await fetch(url, { redirect: 'follow' });
    const responseTimeMs = Date.now() - start;
    const secHeaders = {};
    const importantHeaders = [
        'strict-transport-security', 'content-security-policy',
        'x-frame-options', 'x-content-type-options', 'x-xss-protection',
        'referrer-policy', 'server',
    ];
    for (const h of importantHeaders) {
        const v = res.headers.get(h);
        if (v)
            secHeaders[h] = v;
    }
    return {
        statusCode: res.status,
        redirects: res.redirected,
        hasSSL: url.startsWith('https://') || res.url.startsWith('https://'),
        responseTimeMs,
        headers: secHeaders,
    };
}
//# sourceMappingURL=pagespeed.js.map
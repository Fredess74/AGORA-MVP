/* ═══════════════════════════════════════════════════════════
   WebPulse — Website Performance & SEO Auditor
   REAL WORK: Calls Google PageSpeed Insights API + HTTP checks
   ═══════════════════════════════════════════════════════════ */

import { BaseAgent } from '../base.js';
import { fetchPageSpeed, quickSiteCheck } from '../../external/pagespeed.js';
import type { StructuredTask, PageSpeedData } from '../../types.js';

export class WebPulseAgent extends BaseAgent {
    constructor() {
        super('WebPulse', 'specialist', `You are WebPulse, a website performance and SEO specialist.
You analyze real Google PageSpeed Insights data and HTTP response data to produce website audit reports.

Given real Core Web Vitals, performance scores, security headers, and response times, produce:
1. Executive Summary (overall site health in 3 sentences, include the performance score)
2. Core Web Vitals Assessment (LCP, FID, CLS — with ratings: Good/Needs Improvement/Poor)
3. Performance Analysis (FCP, TTI, Speed Index, Total Blocking Time)
4. Security Posture (SSL, security headers present/missing, server info)
5. Optimization Opportunities (from PageSpeed, with estimated time savings)
6. Mobile vs Desktop Comparison (if both provided)
7. Priority Recommendations (top 5, ordered by impact)

Core Web Vitals thresholds:
- LCP: Good <2500ms, Needs Improvement 2500-4000ms, Poor >4000ms
- FID: Good <100ms, Needs Improvement 100-300ms, Poor >300ms
- CLS: Good <0.1, Needs Improvement 0.1-0.25, Poor >0.25

Use ONLY the real data provided. Include exact numbers.
Format as clear Markdown with tables.`);
    }

    async audit(task: StructuredTask, onApiCall?: (api: string, detail: string) => void): Promise<{
        report: string;
        mobileData: PageSpeedData | null;
        desktopData: PageSpeedData | null;
        siteCheck: any;
        apiCalls: number;
        latencyMs: number;
    }> {
        const start = Date.now();
        let url = task.target;

        // Normalize URL
        if (!url.startsWith('http')) url = `https://${url}`;

        // Quick HTTP check first
        onApiCall?.('HTTP Check', `Testing connectivity: ${url}`);
        let siteCheck: any = null;
        try {
            siteCheck = await quickSiteCheck(url);
            onApiCall?.('HTTP Check', `Status: ${siteCheck.statusCode}, Response: ${siteCheck.responseTimeMs}ms, SSL: ${siteCheck.hasSSL ? '✅' : '❌'}`);
        } catch (e: any) {
            onApiCall?.('HTTP Check', `Warning: ${e.message}`);
        }

        // PageSpeed Insights — Mobile
        onApiCall?.('PageSpeed API', `Analyzing mobile performance for: ${url}`);
        let mobileData: PageSpeedData | null = null;
        try {
            mobileData = await fetchPageSpeed(url, 'mobile');
            onApiCall?.('PageSpeed API', `Mobile score: ${mobileData.performanceScore}/100, LCP: ${mobileData.lcpMs}ms`);
        } catch (e: any) {
            onApiCall?.('PageSpeed API', `Mobile analysis failed: ${e.message}`);
        }

        // PageSpeed Insights — Desktop
        onApiCall?.('PageSpeed API', `Analyzing desktop performance for: ${url}`);
        let desktopData: PageSpeedData | null = null;
        try {
            desktopData = await fetchPageSpeed(url, 'desktop');
            onApiCall?.('PageSpeed API', `Desktop score: ${desktopData.performanceScore}/100, LCP: ${desktopData.lcpMs}ms`);
        } catch (e: any) {
            onApiCall?.('PageSpeed API', `Desktop analysis failed: ${e.message}`);
        }

        // Compile data
        const dataSummary = JSON.stringify({
            url,
            siteCheck: siteCheck ? {
                statusCode: siteCheck.statusCode,
                responseTimeMs: siteCheck.responseTimeMs,
                hasSSL: siteCheck.hasSSL,
                redirects: siteCheck.redirects,
                securityHeaders: siteCheck.headers,
            } : null,
            mobile: mobileData ? {
                performanceScore: mobileData.performanceScore,
                lcpMs: mobileData.lcpMs,
                fidMs: mobileData.fidMs,
                cls: mobileData.clsScore,
                fcpMs: mobileData.fcpMs,
                ttiMs: mobileData.ttiMs,
                speedIndex: mobileData.speedIndex,
                totalBlockingTime: mobileData.totalBlockingTime,
                opportunities: mobileData.opportunities,
                diagnostics: mobileData.diagnostics,
            } : 'unavailable',
            desktop: desktopData ? {
                performanceScore: desktopData.performanceScore,
                lcpMs: desktopData.lcpMs,
                fidMs: desktopData.fidMs,
                cls: desktopData.clsScore,
                fcpMs: desktopData.fcpMs,
                ttiMs: desktopData.ttiMs,
                speedIndex: desktopData.speedIndex,
                totalBlockingTime: desktopData.totalBlockingTime,
                opportunities: desktopData.opportunities,
            } : 'unavailable',
        }, null, 2);

        onApiCall?.('Gemini AI', 'Analyzing performance data and generating audit report');

        const result = await this.call(
            `Analyze this website performance data and produce a comprehensive audit report:\n\n${dataSummary}`
        );

        return {
            report: result.content,
            mobileData,
            desktopData,
            siteCheck,
            apiCalls: 3, // HTTP check + mobile PSI + desktop PSI
            latencyMs: Date.now() - start,
        };
    }
}

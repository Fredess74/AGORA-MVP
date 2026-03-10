/* ═══════════════════════════════════════════════════════════
   WebPulse — Website Performance & SEO Auditor
   REAL WORK: Calls Google PageSpeed Insights API + HTTP checks
   ═══════════════════════════════════════════════════════════ */

import { BaseAgent } from '../base.js';
import { fetchPageSpeed, quickSiteCheck } from '../../external/pagespeed.js';
import type { StructuredTask, PageSpeedData } from '../../types.js';

export class WebPulseAgent extends BaseAgent {
    constructor() {
        super('WebPulse', 'specialist', `You are WebPulse, a Google-certified web performance consultant and former Lighthouse core contributor.
You analyze real PageSpeed Insights data and HTTP diagnostics to produce comprehensive website audit reports.

You will receive REAL data from Google PageSpeed Insights API. Use ONLY these actual numbers.

## Report Structure (use exact headings):

# ⚡ Website Performance Audit: [URL]
**Audit Date:** [today's date] | **Auditor:** WebPulse v1 via Agora Platform | **Standard:** Google Core Web Vitals

## Executive Summary
3-4 sentences: overall health verdict, critical bottleneck, estimated user impact, top recommendation.

## 📊 Core Web Vitals Scorecard
| Metric | Mobile | Desktop | Threshold | Rating |
|--------|--------|---------|-----------|--------|
| LCP | [real]ms | [real]ms | <2500ms | 🟢/🟡/🔴 |
| FID/INP | [real]ms | [real]ms | <100ms | 🟢/🟡/🔴 |
| CLS | [real] | [real] | <0.1 | 🟢/🟡/🔴 |

## 📱 Mobile vs Desktop
| Metric | Mobile | Desktop | Gap |
|--------|--------|---------|-----|
| Performance Score | [real]/100 | [real]/100 | Δ[diff] |
| FCP | [real]ms | [real]ms | — |
| Speed Index | [real] | [real] | — |
| TTI | [real]ms | [real]ms | — |
| TBT | [real]ms | [real]ms | — |

## 🔒 Security Posture
| Check | Status | Detail |
|-------|--------|--------|
| SSL/TLS | ✅/❌ | [real] |
| HSTS | ✅/❌ | — |
| CSP | ✅/❌ | — |
| X-Frame | ✅/❌ | — |
| Response Time | [real]ms | — |

## 🎯 Optimization Opportunities
Each with estimated time savings:
| Priority | Optimization | Savings | Effort |
|----------|-------------|---------|--------|
| P0 | [from real data] | [real ms] | [Low/Med/High] |

## 📋 Action Plan
5 prioritized recommendations with expected performance score improvement.

## Methodology
"This audit was performed by WebPulse AI agent on the Agora platform using live Google PageSpeed Insights API data and direct HTTP analysis. All metrics are real-time and verifiable."

Be precise with numbers. Never say "good" without the actual score.`);
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

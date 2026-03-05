import { validateConfig } from './config.js';
import { saveJSON, loadJSON, saveReport, getDateString, getWeekString, ensureDirs } from './utils/storage.js';
import { collectGitHub, type GitHubData } from './collector/github.js';
import { collectNpm, type NpmData } from './collector/npm.js';
import { collectHackerNews, type HackerNewsData } from './collector/hackernews.js';
import { enrichData, type EnrichedData } from './enricher/enricher.js';
import { analyzeData, type AnalysisResult } from './analyzer/analyzer.js';
import { generateReport } from './reporter/reporter.js';

const args = process.argv.slice(2);
const mode = args[0] || '--all';

async function runCollect(): Promise<{ github: GitHubData; npm: NpmData; hn: HackerNewsData }> {
    console.log('\n════════════════════════════════════════');
    console.log('  MODULE 1: COLLECTOR');
    console.log('════════════════════════════════════════\n');

    const date = getDateString();

    const github = await collectGitHub();
    saveJSON('raw', `github_${date}.json`, github);

    const npm = await collectNpm();
    saveJSON('raw', `npm_${date}.json`, npm);

    const hn = await collectHackerNews();
    saveJSON('raw', `hn_${date}.json`, hn);

    return { github, npm, hn };
}

async function runEnrich(github: GitHubData, hn: HackerNewsData, npm: NpmData): Promise<EnrichedData> {
    console.log('\n════════════════════════════════════════');
    console.log('  MODULE 2: ENRICHER');
    console.log('════════════════════════════════════════\n');

    const enriched = await enrichData(github, hn, npm);
    saveJSON('enriched', `enriched_${getDateString()}.json`, enriched);

    return enriched;
}

async function runAnalyze(enriched: EnrichedData, github: GitHubData): Promise<AnalysisResult> {
    console.log('\n════════════════════════════════════════');
    console.log('  MODULE 3: ANALYZER');
    console.log('════════════════════════════════════════\n');

    const analysis = await analyzeData(enriched, github);
    saveJSON('analysis', `analysis_${getDateString()}.json`, analysis);

    return analysis;
}

async function runReport(analysis: AnalysisResult, enriched: EnrichedData): Promise<string> {
    console.log('\n════════════════════════════════════════');
    console.log('  MODULE 4: REPORTER');
    console.log('════════════════════════════════════════\n');

    const report = await generateReport(analysis, enriched);
    saveReport(`report_${getWeekString()}.md`, report);
    saveJSON('analysis', `report_${getWeekString()}.json`, { analysis, enriched_summary: enriched.npm_summary });

    return report;
}

async function main() {
    console.log('');
    console.log('  🏛️  AGORA TREND ANALYSIS AGENT v0.1');
    console.log('  ═══════════════════════════════════');
    console.log(`  Mode: ${mode}`);
    console.log(`  Date: ${getDateString()}`);
    console.log('');

    if (!validateConfig()) {
        process.exit(1);
    }

    ensureDirs();

    const date = getDateString();
    const start = Date.now();

    try {
        if (mode === '--collect') {
            await runCollect();
        }
        else if (mode === '--enrich') {
            const github = loadJSON<GitHubData>('raw', `github_${date}.json`);
            const hn = loadJSON<HackerNewsData>('raw', `hn_${date}.json`);
            const npm = loadJSON<NpmData>('raw', `npm_${date}.json`);
            if (!github || !hn || !npm) {
                console.error('❌ No raw data found. Run --collect first.');
                process.exit(1);
            }
            await runEnrich(github, hn, npm);
        }
        else if (mode === '--analyze') {
            const enriched = loadJSON<EnrichedData>('enriched', `enriched_${date}.json`);
            const github = loadJSON<GitHubData>('raw', `github_${date}.json`);
            if (!enriched || !github) {
                console.error('❌ No enriched data found. Run --enrich first.');
                process.exit(1);
            }
            await runAnalyze(enriched, github);
        }
        else if (mode === '--report') {
            const analysis = loadJSON<AnalysisResult>('analysis', `analysis_${date}.json`);
            const enriched = loadJSON<EnrichedData>('enriched', `enriched_${date}.json`);
            if (!analysis || !enriched) {
                console.error('❌ No analysis data found. Run --analyze first.');
                process.exit(1);
            }
            await runReport(analysis, enriched);
        }
        else {
            // --all: Full pipeline
            const { github, npm, hn } = await runCollect();
            const enriched = await runEnrich(github, hn, npm);
            const analysis = await runAnalyze(enriched, github);
            const report = await runReport(analysis, enriched);

            console.log('\n════════════════════════════════════════');
            console.log('  ✅ PIPELINE COMPLETE');
            console.log('════════════════════════════════════════\n');
            console.log(`  ⏱  Duration: ${((Date.now() - start) / 1000).toFixed(1)}s`);
            console.log(`  📄 Report: reports/report_${getWeekString()}.md`);
            console.log(`  📊 Data: data/analysis/analysis_${date}.json`);
            console.log('');
        }
    } catch (err) {
        console.error('\n❌ Pipeline failed:', err);
        process.exit(1);
    }
}

main();

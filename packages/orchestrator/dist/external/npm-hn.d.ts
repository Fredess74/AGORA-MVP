import type { NpmPackageData, HackerNewsItem } from '../types.js';
export declare function fetchNpmPackage(name: string): Promise<NpmPackageData>;
export declare function fetchNpmDownloads(name: string): Promise<{
    weekly: number;
    monthly: number;
}>;
/** Fetch npm data for multiple packages in parallel */
export declare function fetchNpmBulk(packages: string[]): Promise<NpmPackageData[]>;
export declare function searchHackerNews(query: string, limit?: number): Promise<HackerNewsItem[]>;

/* ═══════════════════════════════════════════════════════════
   npm Registry + HackerNews Algolia API Clients
   ═══════════════════════════════════════════════════════════ */

import type { NpmPackageData, HackerNewsItem } from '../types.js';

// ── npm Registry (no auth required) ─────────────────────

export async function fetchNpmPackage(name: string): Promise<NpmPackageData> {
    const [meta, downloads] = await Promise.all([
        fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`).then(r => r.json()) as Promise<any>,
        fetch(`https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(name)}`).then(r => r.json()).catch(() => ({ downloads: 0 })) as Promise<any>,
    ]);
    const latest = meta['dist-tags']?.latest || '';
    const latestData = meta.versions?.[latest] || {};
    return {
        name: meta.name || name,
        version: latest,
        description: meta.description || '',
        weeklyDownloads: 0, // filled below
        monthlyDownloads: downloads.downloads || 0,
        dependencies: Object.keys(latestData.dependencies || {}).length,
        maintainers: (meta.maintainers || []).length,
        lastPublished: meta.time?.[latest] || '',
        license: latestData.license || meta.license || 'Unknown',
    };
}

export async function fetchNpmDownloads(name: string): Promise<{ weekly: number; monthly: number }> {
    const [weekly, monthly] = await Promise.all([
        fetch(`https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(name)}`).then(r => r.json()).catch(() => ({ downloads: 0 })) as Promise<any>,
        fetch(`https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(name)}`).then(r => r.json()).catch(() => ({ downloads: 0 })) as Promise<any>,
    ]);
    return { weekly: weekly.downloads || 0, monthly: monthly.downloads || 0 };
}

/** Fetch npm data for multiple packages in parallel */
export async function fetchNpmBulk(packages: string[]): Promise<NpmPackageData[]> {
    return Promise.all(packages.map(p => fetchNpmPackage(p).catch(() => ({
        name: p, version: '?', description: '', weeklyDownloads: 0,
        monthlyDownloads: 0, dependencies: 0, maintainers: 0,
        lastPublished: '', license: 'Unknown',
    }))));
}

// ── HackerNews Algolia (no auth required) ───────────────

export async function searchHackerNews(query: string, limit = 10): Promise<HackerNewsItem[]> {
    const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HN API ${res.status}`);
    const data = await res.json() as any;
    return (data.hits || []).map((hit: any) => ({
        title: hit.title || '',
        url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        points: hit.points || 0,
        numComments: hit.num_comments || 0,
        author: hit.author || '',
        createdAt: hit.created_at || '',
    }));
}

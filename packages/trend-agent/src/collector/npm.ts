import { CONFIG } from '../config.js';
import { sleep } from '../utils/llm.js';

interface NpmPackageData {
    name: string;
    description: string;
    version: string;
    downloads_last_week: number;
    downloads_last_month: number;
    repository: string | null;
    keywords: string[];
    collected_at: string;
}

export interface NpmData {
    packages: NpmPackageData[];
    collected_at: string;
}

async function getPackageInfo(name: string): Promise<{ description: string; version: string; repository: string | null; keywords: string[] } | null> {
    const res = await fetch(`https://registry.npmjs.org/${name}/latest`);
    if (!res.ok) return null;
    const data = await res.json() as any;
    return {
        description: data.description || '',
        version: data.version || '',
        repository: data.repository?.url || null,
        keywords: data.keywords || [],
    };
}

async function getDownloads(name: string, period: string): Promise<number> {
    const res = await fetch(`https://api.npmjs.org/downloads/point/${period}/${name}`);
    if (!res.ok) return 0;
    const data = await res.json() as { downloads: number };
    return data.downloads || 0;
}

export async function collectNpm(): Promise<NpmData> {
    console.log('📦 Collecting npm data...');

    const packages: NpmPackageData[] = [];

    for (const name of CONFIG.NPM_PACKAGES) {
        console.log(`  Package: ${name}`);

        const [info, weeklyDl, monthlyDl] = await Promise.all([
            getPackageInfo(name),
            getDownloads(name, 'last-week'),
            getDownloads(name, 'last-month'),
        ]);

        if (info) {
            packages.push({
                name,
                description: info.description,
                version: info.version,
                downloads_last_week: weeklyDl,
                downloads_last_month: monthlyDl,
                repository: info.repository,
                keywords: info.keywords,
                collected_at: new Date().toISOString(),
            });
        }

        await sleep(300);
    }

    console.log(`  ✅ npm: ${packages.length} packages tracked`);

    return {
        packages,
        collected_at: new Date().toISOString(),
    };
}

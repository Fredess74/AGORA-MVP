import fs from 'fs';
import path from 'path';
import { CONFIG } from '../config.js';

const DATA_DIR = CONFIG.DATA_DIR;

export function ensureDirs() {
    const dirs = [
        `${DATA_DIR}/raw`,
        `${DATA_DIR}/enriched`,
        `${DATA_DIR}/analysis`,
        `${DATA_DIR}/history`,
        CONFIG.REPORTS_DIR,
    ];
    for (const dir of dirs) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

export function saveJSON(subdir: string, filename: string, data: unknown) {
    ensureDirs();
    const filepath = path.join(DATA_DIR, subdir, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(`  💾 Saved: ${filepath}`);
    return filepath;
}

export function loadJSON<T = unknown>(subdir: string, filename: string): T | null {
    const filepath = path.join(DATA_DIR, subdir, filename);
    if (!fs.existsSync(filepath)) return null;
    return JSON.parse(fs.readFileSync(filepath, 'utf-8')) as T;
}

export function saveReport(filename: string, content: string) {
    ensureDirs();
    const filepath = path.join(CONFIG.REPORTS_DIR, filename);
    fs.writeFileSync(filepath, content);
    console.log(`  📄 Saved report: ${filepath}`);
    return filepath;
}

export function getDateString(): string {
    return new Date().toISOString().split('T')[0];
}

export function getWeekString(): string {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const week = Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
    return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

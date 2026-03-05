import { GoogleGenerativeAI } from '@google/generative-ai';
import { CONFIG } from '../config.js';

const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (err: any) {
            if (err?.status === 429 && i < maxRetries - 1) {
                const waitSec = 10 * Math.pow(2, i); // 10s, 20s, 40s
                console.log(`  ⏳ Rate limited, waiting ${waitSec}s before retry ${i + 2}/${maxRetries}...`);
                await sleep(waitSec * 1000);
            } else {
                throw err;
            }
        }
    }
    throw new Error('Max retries exceeded');
}

export async function llmJSON<T = unknown>(prompt: string): Promise<T> {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.3,
        },
    });

    return withRetry(async () => {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return JSON.parse(text) as T;
    });
}

export async function llmText(prompt: string): Promise<string> {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 4096,
        },
    });

    return withRetry(async () => {
        const result = await model.generateContent(prompt);
        return result.response.text();
    });
}

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

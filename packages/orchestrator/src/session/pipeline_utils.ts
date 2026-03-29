/* ═══════════════════════════════════════════════════════════
   Pipeline Utilities — Timeout, Retry, Dynamic Routing
   
   DEC-006: Pipeline hardening to prevent "Demo Magic" failures.
   Without these, a single hung API call kills the entire session.
   ═══════════════════════════════════════════════════════════ */

/**
 * Execute a promise with a timeout.
 * Returns the result or throws 'TIMEOUT' error.
 * 
 * @param promise - The async operation to execute
 * @param timeoutMs - Maximum time to wait (default: 30s)
 * @param label - Human-readable label for error messages
 */
export async function withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number = 30000,
    label: string = 'operation',
): Promise<T> {
    let timer: ReturnType<typeof setTimeout>;
    const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
            reject(new Error(`TIMEOUT: ${label} exceeded ${timeoutMs}ms`));
        }, timeoutMs);
    });

    try {
        const result = await Promise.race([promise, timeoutPromise]);
        clearTimeout(timer!);
        return result;
    } catch (err) {
        clearTimeout(timer!);
        throw err;
    }
}

/**
 * Execute with retry on failure.
 * Retries once with a short delay, then throws.
 * 
 * @param fn - Function to execute (must return a Promise)
 * @param maxRetries - Number of retries (default: 1)
 * @param delayMs - Delay between retries (default: 1000ms)
 * @param label - Human-readable label for error messages
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 1,
    delayMs: number = 1000,
    label: string = 'operation',
): Promise<T> {
    let lastError: Error = new Error('Unknown error');
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err: any) {
            lastError = err;
            if (attempt < maxRetries) {
                console.warn(`  ⚠️  ${label} failed (attempt ${attempt + 1}/${maxRetries + 1}): ${err.message}. Retrying in ${delayMs}ms...`);
                await sleep(delayMs);
            }
        }
    }
    
    throw new Error(`${label} failed after ${maxRetries + 1} attempts: ${lastError.message}`);
}

/**
 * Combine timeout + retry: execute with timeout, retry on failure.
 */
export async function withTimeoutAndRetry<T>(
    fn: () => Promise<T>,
    timeoutMs: number = 30000,
    maxRetries: number = 1,
    label: string = 'operation',
): Promise<T> {
    return withRetry(
        () => withTimeout(fn(), timeoutMs, label),
        maxRetries,
        1000,
        label,
    );
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number,
    delayMs: number
): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (attempt === maxRetries) break;

            await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        }
    }

    throw lastError;
} 
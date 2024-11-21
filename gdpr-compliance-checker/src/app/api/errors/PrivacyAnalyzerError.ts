export class PrivacyAnalyzerError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly statusCode: number,
        public readonly originalError?: unknown
    ) {
        super(message);
        this.name = 'PrivacyAnalyzerError';
    }

    static badRequest(message: string, originalError?: unknown) {
        return new PrivacyAnalyzerError(message, 'BAD_REQUEST', 400, originalError);
    }

    static serviceError(message: string, originalError?: unknown) {
        return new PrivacyAnalyzerError(message, 'SERVICE_ERROR', 500, originalError);
    }
} 
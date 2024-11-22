export const API_CONFIG = {
    ENDPOINTS: {
        SEGMENTER: process.env.NEXT_PUBLIC_SEGMENTER_URL || 'http://localhost:80/privacy-segmenter/invoke',
        ANALYZER: process.env.NEXT_PUBLIC_ANALYZER_URL || 'http://localhost:80/privacy-analyzer/invoke',
        REGULATORY_CHECKER: process.env.NEXT_PUBLIC_REGULATORY_CHECKER_URL || 'http://localhost:80/privacy-regulatory-checker/invoke'
    },
    MODEL: process.env.NEXT_PUBLIC_MODEL || 'gpt-4',
    TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
    MAX_RETRIES: parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES || '3'),
    RETRY_DELAY: parseInt(process.env.NEXT_PUBLIC_RETRY_DELAY || '1000')
} 
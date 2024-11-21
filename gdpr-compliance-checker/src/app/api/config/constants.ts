export const API_CONFIG = {
    ENDPOINTS: {
        SEGMENTER: 'http://localhost:80/privacy-segmenter/invoke',
        ANALYZER: 'http://localhost:80/privacy-analyzer/invoke'
    },
    MODEL: 'gpt-4',
    TIMEOUT: 30000, // 30 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000 // 1 second
} 
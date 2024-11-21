import { v4 as uuidv4 } from 'uuid'
import { API_CONFIG } from '../config/constants'
import { PrivacyAnalyzerError } from '../errors/PrivacyAnalyzerError'
import { withRetry } from '../utils/retry'
import type {
    SegmentResponse,
    PolicySegment,
    SegmentAnalysis,
    PrivacyAnalysis
} from '../types/privacy'

export class PrivacyAnalyzerService {
    async analyzePolicy(policyText: string): Promise<PrivacyAnalysis> {
        if (!policyText?.trim()) {
            throw PrivacyAnalyzerError.badRequest('Policy text is required');
        }

        const threadId = uuidv4();

        try {
            const segments = await this.segmentPolicy(policyText, threadId);
            const analysisResults = await this.analyzeSegments(segments, threadId);

            return {
                threadId,
                segments,
                analysis: analysisResults
            };
        } catch (error) {
            console.error('Policy analysis failed:', error);
            throw PrivacyAnalyzerError.serviceError(
                'Failed to analyze policy',
                error
            );
        }
    }

    private async segmentPolicy(
        policyText: string,
        threadId: string
    ): Promise<PolicySegment[]> {
        return withRetry(
            async () => {
                const response = await fetch(API_CONFIG.ENDPOINTS.SEGMENTER, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: policyText,
                        model: API_CONFIG.MODEL,
                        thread_id: threadId
                    }),
                    signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
                });

                if (!response.ok) {
                    throw new Error(`Segmentation failed with status: ${response.status}`);
                }

                const data: SegmentResponse = await response.json();
                return JSON.parse(data.content);
            },
            API_CONFIG.MAX_RETRIES,
            API_CONFIG.RETRY_DELAY
        );
    }

    private async analyzeSegments(
        segments: PolicySegment[],
        threadId: string
    ): Promise<SegmentAnalysis[]> {
        const analysisPromises = segments.map((segment) =>
            this.analyzeSegment(segment, threadId)
        );

        return Promise.all(analysisPromises);
    }

    private async analyzeSegment(
        segment: PolicySegment,
        threadId: string
    ): Promise<SegmentAnalysis> {
        const segmentText = Object.values(segment)[0];

        return withRetry(
            async () => {
                const response = await fetch(API_CONFIG.ENDPOINTS.ANALYZER, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: segmentText,
                        model: API_CONFIG.MODEL,
                        thread_id: threadId
                    }),
                    signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
                });

                if (!response.ok) {
                    throw new Error(`Analysis failed with status: ${response.status}`);
                }

                const analysisResult = await response.json();
                return {
                    ...analysisResult,
                    segment_text: segmentText
                };
            },
            API_CONFIG.MAX_RETRIES,
            API_CONFIG.RETRY_DELAY
        );
    }
} 
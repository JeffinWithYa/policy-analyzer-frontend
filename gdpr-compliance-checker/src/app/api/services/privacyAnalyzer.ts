import { v4 as uuidv4 } from 'uuid'
import { API_CONFIG } from '../config/constants'
import { PrivacyAnalyzerError } from '../errors/PrivacyAnalyzerError'
import { withRetry } from '../utils/retry'
import type {
    SegmentResponse,
    PolicySegment,
    SegmentAnalysis,
    PrivacyAnalysis,
    RegulatoryCheckResponse
} from '../types/privacy'

export class PrivacyAnalyzerService {
    async analyzePolicy(policyText: string): Promise<Partial<PrivacyAnalysis & { regulatory_check: RegulatoryCheckResponse }>> {
        if (!policyText?.trim()) {
            throw PrivacyAnalyzerError.badRequest('Policy text is required');
        }

        const threadId = uuidv4();
        let segments: PolicySegment[] = [];
        let analysisResults: SegmentAnalysis[] = [];
        let regulatoryCheck: RegulatoryCheckResponse | null = null;

        try {
            segments = await this.segmentPolicy(policyText, threadId);
            analysisResults = await this.analyzeSegments(segments, threadId);

            try {
                regulatoryCheck = await this.checkRegulatory(analysisResults);
            } catch (error) {
                console.error('Regulatory check failed, continuing with partial results:', error);
            }

            return {
                threadId,
                segments,
                analysis: analysisResults,
                ...(regulatoryCheck && { regulatory_check: regulatoryCheck })
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
        try {
            return withRetry(
                async () => {
                    try {
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
                    } catch (error) {
                        if (error instanceof TypeError && error.message.includes('fetch failed')) {
                            throw new PrivacyAnalyzerError.serviceError(
                                'Unable to connect to segmentation service. Please ensure the service is running.',
                                error
                            );
                        }
                        throw error;
                    }
                },
                API_CONFIG.MAX_RETRIES,
                API_CONFIG.RETRY_DELAY
            );
        } catch (error) {
            console.error('Segmentation failed:', error);
            throw new PrivacyAnalyzerError.serviceError(
                'Failed to segment policy. Please check if all required services are running.',
                error
            );
        }
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

    private async checkRegulatory(segments: SegmentAnalysis[]): Promise<RegulatoryCheckResponse> {
        try {
            if (!segments.every(segment => segment.content)) {
                throw new PrivacyAnalyzerError.badRequest('All segments must be analyzed before regulatory check');
            }

            const privacy_segments = segments.map(segment => {
                try {
                    const parsedContent = JSON.parse(segment.content);
                    return {
                        segment: segment.segment_text,
                        model_analysis: {
                            category: parsedContent.category,
                            explanation: parsedContent.explanation
                        }
                    };
                } catch (error) {
                    console.error('Failed to parse segment content:', error);
                    throw new PrivacyAnalyzerError.serviceError('Invalid segment analysis format', error);
                }
            });

            return withRetry(
                async () => {
                    const response = await fetch(API_CONFIG.ENDPOINTS.REGULATORY_CHECKER, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ privacy_segments }),
                        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Regulatory checker error:', {
                            status: response.status,
                            body: errorText
                        });
                        throw new Error(`Regulatory check failed: ${response.status} - ${errorText}`);
                    }

                    return response.json();
                },
                API_CONFIG.MAX_RETRIES,
                API_CONFIG.RETRY_DELAY
            );
        } catch (error) {
            console.error('Regulatory check failed:', error);
            throw error;
        }
    }
} 
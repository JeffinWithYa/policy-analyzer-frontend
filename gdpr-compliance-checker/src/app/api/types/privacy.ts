export interface SegmentResponse {
    type: string;
    content: string;
    tool_calls: any[];
    tool_call_id: string | null;
    run_id: string;
    response_metadata: Record<string, unknown>;
    custom_data: Record<string, unknown>;
    privacy_analysis: unknown;
}

export interface PolicySegment {
    [key: string]: string;
}

export interface AnalysisCategory {
    [key: string]: {
        [key: string]: string;
    };
}

export interface AnalysisContent {
    category: AnalysisCategory;
    explanation: string;
}

export interface SegmentAnalysis {
    type: string;
    content: string;
    segment_text: string;
    tool_calls: any[];
    tool_call_id: string | null;
    run_id: string;
    response_metadata: Record<string, unknown>;
    custom_data: Record<string, unknown>;
    privacy_analysis: unknown;
}

export interface PrivacyAnalysis {
    threadId: string;
    segments: PolicySegment[];
    analysis: SegmentAnalysis[];
}

export interface SegmentWithAnalysis {
    segment: string;
    model_analysis: {
        category: {
            [key: string]: {
                [key: string]: string;
            };
        };
        explanation: string;
    };
}

interface AnalysisSegment {
    text: string;
    category: string;
    explanation: string;
}

interface QuestionAnalysis {
    question: string;
    segments: AnalysisSegment[] | null;
}

interface GDPRSegment {
    segment: string;
    category: string;
    explanation: string;
}

interface QuestionAnalysis {
    question: string;
    segments: GDPRSegment[] | null;
}

interface GDPRAnalysis {
    status: string;
    results: Record<string, GDPRSegment[]>;
}

export interface RegulatoryCheckResponse {
    type: string;
    content: string;
    tool_calls: any[];
    tool_call_id: string | null;
    run_id: string;
    response_metadata: Record<string, any>;
    custom_data: Record<string, any>;
    privacy_analysis: any;
    structured_analysis: QuestionAnalysis[];
} 
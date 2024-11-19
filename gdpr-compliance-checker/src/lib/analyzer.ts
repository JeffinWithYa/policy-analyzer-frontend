import { GDPRRequirement, AnalysisResult, GDPR_REQUIREMENTS } from './types';

export function analyzePolicy(policyData: any): AnalysisResult[] {
    return GDPR_REQUIREMENTS.map(requirement => {
        const relevantSegments = findRelevantSegments(policyData, requirement);

        return {
            requirement,
            found: relevantSegments.length > 0,
            relevantSegments,
            score: calculateScore(relevantSegments, requirement)
        };
    });
}

function findRelevantSegments(policyData: any, requirement: GDPRRequirement): string[] {
    const segments: string[] = [];

    policyData.forEach((segment: any) => {
        const hasMatchingAnnotation = segment.human_annotations.some((annotation: any) => {
            return requirement.matchingCategories.some(category => {
                const [mainCat, subCat] = category.split('.');
                return annotation[mainCat]?.[subCat];
            });
        });

        if (hasMatchingAnnotation) {
            segments.push(segment.segment);
        }
    });

    return segments;
}

function calculateScore(segments: string[], requirement: GDPRRequirement): number {
    if (!requirement.required) {
        return segments.length > 0 ? 1 : 0;
    }
    return segments.length > 0 ? 1 : 0;
}
import { NextResponse } from 'next/server'
import { PrivacyAnalyzerService } from '../services/privacyAnalyzer'
import { PrivacyAnalyzerError } from '../errors/PrivacyAnalyzerError'

const analyzerService = new PrivacyAnalyzerService()

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('Received analysis request:', body)

        if (!body.policyText) {
            return NextResponse.json(
                { error: 'Policy text is required' },
                { status: 400 }
            )
        }

        const result = await analyzerService.analyzePolicy(body.policyText)
        console.log('Analysis completed successfully')

        return NextResponse.json(result)
    } catch (error) {
        console.error('Analysis error:', error)

        if (error instanceof PrivacyAnalyzerError) {
            return NextResponse.json(
                {
                    error: error.message,
                    code: error.code,
                    details: error.originalError
                },
                { status: error.statusCode }
            )
        }

        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
        return NextResponse.json(
            {
                error: errorMessage,
                details: error
            },
            { status: 500 }
        )
    }
} 
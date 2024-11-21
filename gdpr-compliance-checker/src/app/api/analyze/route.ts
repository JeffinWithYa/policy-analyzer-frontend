import { NextResponse } from 'next/server'
import { PrivacyAnalyzerService } from '../services/privacyAnalyzer'
import { PrivacyAnalyzerError } from '../errors/PrivacyAnalyzerError'

const analyzerService = new PrivacyAnalyzerService()

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = await analyzerService.analyzePolicy(body.policyText)

        return NextResponse.json(result)
    } catch (error) {
        console.error('Analysis error:', error)

        if (error instanceof PrivacyAnalyzerError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.statusCode }
            )
        }

        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
} 
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const threadId = uuidv4()

        const segmenterResponse = await fetch('http://localhost:80/privacy-segmenter/invoke', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: body.policyText,
                model: "gpt-4",
                thread_id: threadId
            })
        })

        if (!segmenterResponse.ok) {
            throw new Error('Failed to segment policy')
        }

        const segmenterData = await segmenterResponse.json()
        console.log('Segmenter Response:', segmenterData)

        const segments = JSON.parse(segmenterData.content)

        const analysisPromises = segments.map((segment: any) => {
            const segmentText = Object.values(segment)[0] as string

            return fetch('http://localhost:80/privacy-analyzer/invoke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: segmentText,
                    model: "gpt-4",
                    thread_id: threadId
                })
            }).then(res => {
                if (!res.ok) {
                    throw new Error(`Analysis failed with status: ${res.status}`)
                }
                return res.json()
            })
        })

        const analysisResults = await Promise.all(analysisPromises)

        return NextResponse.json({
            threadId,
            segments: segments,
            analysis: analysisResults
        })

    } catch (error) {
        console.error('Analysis error:', error)
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            })
        }
        return NextResponse.json(
            { error: 'Failed to analyze policy' },
            { status: 500 }
        )
    }
} 
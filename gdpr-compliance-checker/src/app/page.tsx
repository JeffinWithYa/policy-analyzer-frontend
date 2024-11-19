'use client';

import { useState } from 'react';
import { analyzePolicy } from '@/lib/analyzer';
import type { AnalysisResult } from '@/lib/types';

export default function Home() {
    const [results, setResults] = useState<AnalysisResult[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const text = await file.text();
        const policyData = JSON.parse(text);
        const analysis = analyzePolicy(policyData);
        setResults(analysis);
        setLoading(false);
    };

    return (
        <div className="min-h-screen p-8">
            <main className="container mx-auto">
                <h1 className="text-3xl font-bold mb-8">GDPR Compliance Checker</h1>

                <div className="mb-8">
                    <label className="block mb-2">Upload Privacy Policy (JSON format)</label>
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100"
                    />
                </div>

                {loading && (
                    <div className="text-center py-4">
                        <p>Analyzing policy...</p>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="space-y-6">
                        {results.map(result => (
                            <div
                                key={result.requirement.id}
                                className="border rounded-lg p-6 shadow-sm"
                            >
                                <h2 className="text-xl font-bold mb-2">{result.requirement.name}</h2>
                                <p className="text-gray-600 mb-4">{result.requirement.description}</p>
                                <p className={`font-bold ${result.found ? 'text-green-600' : 'text-red-600'} mb-4`}>
                                    {result.found ? '✓ Found' : '✗ Not Found'}
                                </p>
                                {result.relevantSegments.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <h3 className="font-semibold mb-2">Relevant Segments:</h3>
                                        {result.relevantSegments.map((segment, i) => (
                                            <p key={i} className="text-sm text-gray-700 mb-2">{segment}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
} 
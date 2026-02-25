import { NextRequest, NextResponse } from 'next/server'
import type { Policy } from '@/types'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { policy, incidentType, incidentLocation, photoCount, photos } = body as {
            policy: Policy
            incidentType: string
            incidentLocation: string
            photoCount: number
            photos?: { base64: string; mediaType: string; label: string }[]
        }
        // Try real Groq Vision API (100% Free)
        if (photos && photos.length > 0) {
            try {
                const { analyzeWithGroq } = await import('@/lib/ai/groq');
                const result = await analyzeWithGroq({
                    policy,
                    incidentType,
                    incidentLocation,
                    photos: photos.map((p) => ({
                        ...p,
                        mediaType: p.mediaType as 'image/jpeg' | 'image/png' | 'image/webp',
                    })),
                });
                return NextResponse.json(result);
            } catch (err: any) {
                console.warn('Groq Vision API failed or unavailable. Falling back to Demo Mode:', err.message);
                try {
                    const { generateMockAnalysis } = await import('@/lib/ai/mock');
                    const mockResult = generateMockAnalysis(policy, incidentLocation || 'Mumbai');

                    return NextResponse.json({
                        ...mockResult,
                        demo_mode: true,
                        demo_message: "Live AI currently unavailable. Displaying dynamically generated Demo Data."
                    });
                } catch (mockErr) {
                    return NextResponse.json({
                        error: 'AI Analysis & Demo Fallback Failed',
                        details: err.message,
                        suggestion: 'Please ensure GROQ_API_KEY is correctly configured for production.'
                    }, { status: 500 });
                }
            }
        }

        return NextResponse.json({ error: 'No photos provided for analysis' }, { status: 400 });
    } catch (error) {
        console.error('AI analysis route error:', error)
        return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
    }
}

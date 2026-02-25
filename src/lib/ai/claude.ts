// Claude Vision API integration for damage analysis
import Anthropic from '@anthropic-ai/sdk'
import sharp from 'sharp'
import { buildDamageAnalysisPrompt } from './prompts'
import type { AIAnalysisResult, Policy } from '@/types'
import { getVehicleAgeMonths, getCityTier } from '@/lib/pricing/depreciation'

let anthropicClient: Anthropic | null = null

function getAnthropicClient(): Anthropic {
    if (!anthropicClient) {
        if (!process.env.ANTHROPIC_API_KEY) {
            throw new Error('ANTHROPIC_API_KEY is missing in environment variables');
        }
        anthropicClient = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        })
    }
    return anthropicClient
}

/**
 * Optimizes an image for Claude Vision (max 1560px, JPEG format, ~80% quality)
 */
async function optimizeImage(base64: string): Promise<string> {
    try {
        const buffer = Buffer.from(base64, 'base64');
        const optimizedBuffer = await sharp(buffer)
            .resize(1560, 1560, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();
        return optimizedBuffer.toString('base64');
    } catch (error) {
        console.error('Image optimization failed, using original:', error);
        return base64;
    }
}

export interface AnalysisInput {
    policy: Policy
    incidentType: string
    incidentLocation: string
    photos: { base64: string; mediaType: string; label: string }[]
}

export async function analyzeWithClaude(input: AnalysisInput): Promise<AIAnalysisResult> {
    const startTime = Date.now()
    const client = getAnthropicClient()

    const ageMonths = getVehicleAgeMonths(input.policy.vehicle_year)
    const cityTier = getCityTier(input.incidentLocation)

    const systemPrompt = buildDamageAnalysisPrompt({
        make: input.policy.vehicle_make,
        model: input.policy.vehicle_model,
        year: input.policy.vehicle_year,
        vehicleType: input.policy.vehicle_type,
        fuelType: input.policy.fuel_type,
        engineCc: input.policy.engine_cc,
        ageMonths,
        idv: input.policy.idv,
        city: input.incidentLocation.split(',')[0].trim(),
        cityTier,
        incidentType: input.incidentType,
        zeroDep: input.policy.zero_depreciation,
        photoCount: input.photos.length,
    })

    // Optimize all images in parallel for production performance
    const optimizedPhotos = await Promise.all(
        input.photos.map(async (photo) => ({
            ...photo,
            base64: await optimizeImage(photo.base64)
        }))
    );

    const imageContent = optimizedPhotos.map((photo) => ({
        type: 'image' as const,
        source: {
            type: 'base64' as const,
            media_type: 'image/jpeg' as const, // We converted to JPEG in optimizeImage
            data: photo.base64,
        },
    }))

    const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20240620', // Optimizing for cost/performance with Sonnet 3.5
        max_tokens: 4096,
        messages: [
            {
                role: 'user',
                content: [
                    ...imageContent,
                    {
                        type: 'text',
                        text: systemPrompt,
                    },
                ],
            },
        ],
    })

    const processingTimeMs = Date.now() - startTime

    // Extract text content
    const textBlock = response.content.find(c => c.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
        throw new Error('Claude returned no text response')
    }

    // Parse JSON response
    let parsed: any
    try {
        const jsonStr = textBlock.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        parsed = JSON.parse(jsonStr)
    } catch (err) {
        throw new Error(`Failed to parse Claude response as JSON: ${textBlock.text.substring(0, 200)}`)
    }

    parsed.processing_time_ms = processingTimeMs
    return parsed as AIAnalysisResult
}

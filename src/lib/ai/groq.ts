// Groq Vision API integration for damage analysis (100% FREE TIER)
import Groq from 'groq-sdk';
import sharp from 'sharp';
import { buildDamageAnalysisPrompt } from './prompts';
import type { AIAnalysisResult, Policy } from '@/types';
import { getVehicleAgeMonths, getCityTier } from '@/lib/pricing/depreciation';
import { AgentConfig } from '@/config/agent-config'

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
    if (!groqClient) {
        if (!process.env.GROQ_API_KEY) {
            throw new Error('GROQ_API_KEY is missing. You can get a 100% free key instantly at https://console.groq.com/keys');
        }
        groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return groqClient;
}

/**
 * Optimizes an image for Llama Vision (max 1024px, JPEG format, ~80% quality)
 */
async function optimizeImage(base64: string): Promise<string> {
    try {
        const buffer = Buffer.from(base64, 'base64');
        const optimizedBuffer = await sharp(buffer)
            .resize(AgentConfig.vision.imageMaxPx, AgentConfig.vision.imageMaxPx, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: AgentConfig.vision.imageQuality })
            .toBuffer();
        return optimizedBuffer.toString('base64');
    } catch (error) {
        console.error('Image optimization failed, using original:', error);
        return base64;
    }
}

export interface AnalysisInput {
    policy: Policy;
    incidentType: string;
    incidentLocation: string;
    photos: { base64: string; mediaType: string; label: string }[];
}

export async function analyzeWithGroq(input: AnalysisInput): Promise<AIAnalysisResult> {
    const startTime = Date.now();
    const client = getGroqClient();

    const ageMonths = getVehicleAgeMonths(input.policy.vehicle_year);
    const cityTier = getCityTier(input.incidentLocation);

    const systemPrompt = buildDamageAnalysisPrompt({
        make: input.policy.vehicle_make,
        model: input.policy.vehicle_model,
        year: input.policy.vehicle_year,
        vehicleType: input.policy.vehicle_type || 'car',
        fuelType: input.policy.fuel_type || 'petrol',
        engineCc: (input.policy as any).engine_cc || 1200,
        ageMonths,
        idv: input.policy.idv_value || 500000,
        city: input.incidentLocation.split(',')[0].trim(),
        cityTier,
        incidentType: input.incidentType,
        zeroDep: input.policy.zero_depreciation,
        photoCount: input.photos.length,
    });

    // Optimize images
    const optimizedPhotos = await Promise.all(
        input.photos.map(async (photo) => ({
            ...photo,
            base64: await optimizeImage(photo.base64)
        }))
    );

    // Format for Groq vision models
    const imageContent = optimizedPhotos.map((photo) => ({
        type: 'image_url' as const,
        image_url: {
            url: `data:image/jpeg;base64,${photo.base64}`
        }
    }));

    // Send payload
    const response = await client.chat.completions.create({
       model: AgentConfig.models.vision,
        
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: systemPrompt,
                    },
                    ...imageContent
                ],
            }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
    });

    const processingTimeMs = Date.now() - startTime;
    const textResponse = response.choices[0]?.message?.content;

    if (!textResponse) {
        throw new Error('Groq returned no text response');
    }

    // Parse JSON
    let parsed: any;
    try {
        const jsonStr = textResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsed = JSON.parse(jsonStr);
    } catch (err) {
        throw new Error(`Failed to parse Groq response as JSON: ${textResponse.substring(0, 200)}`);
    }

    parsed.processing_time_ms = processingTimeMs;
    return parsed as AIAnalysisResult;
}

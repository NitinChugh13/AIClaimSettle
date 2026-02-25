// Google Gemini Vision API integration for damage analysis (FREE TIER SUPPORTED)
import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';
import { buildDamageAnalysisPrompt } from './prompts';
import type { AIAnalysisResult, Policy } from '@/types';
import { getVehicleAgeMonths, getCityTier } from '@/lib/pricing/depreciation';

let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
    if (!genAI) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is missing in environment variables. You can get one for free at aistudio.google.com');
        }
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return genAI;
}

/**
 * Optimizes an image for Gemini Vision (max 1560px, JPEG format, ~80% quality)
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
    policy: Policy;
    incidentType: string;
    incidentLocation: string;
    photos: { base64: string; mediaType: string; label: string }[];
}

export async function analyzeWithGemini(input: AnalysisInput): Promise<AIAnalysisResult> {
    const startTime = Date.now();
    const client = getGeminiClient();

    // The Gemini 2.0 Flash model is fast, capable of vision, and has a generous free tier
    const model = client.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
            responseMimeType: 'application/json',
        }
    });

    const ageMonths = getVehicleAgeMonths(input.policy.vehicle_year);
    const cityTier = getCityTier(input.incidentLocation);

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
    });

    // Optimize images
    const optimizedPhotos = await Promise.all(
        input.photos.map(async (photo) => ({
            ...photo,
            base64: await optimizeImage(photo.base64)
        }))
    );

    // Format for Gemini parts
    const imageParts = optimizedPhotos.map((photo) => ({
        inlineData: {
            data: photo.base64,
            mimeType: 'image/jpeg'
        }
    }));

    // Send payload
    const result = await model.generateContent([
        systemPrompt,
        ...imageParts
    ]);

    const processingTimeMs = Date.now() - startTime;
    const textResponse = result.response.text();

    if (!textResponse) {
        throw new Error('Gemini returned no text response');
    }

    // Parse JSON
    let parsed: any;
    try {
        const jsonStr = textResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsed = JSON.parse(jsonStr);
    } catch (err) {
        throw new Error(`Failed to parse Gemini response as JSON: ${textResponse.substring(0, 200)}`);
    }

    parsed.processing_time_ms = processingTimeMs;
    return parsed as AIAnalysisResult;
}

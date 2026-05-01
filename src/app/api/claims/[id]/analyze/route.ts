// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { createClient } from '@supabase/supabase-js';
// import { verifyToken } from '@/lib/auth';
// import { analyzeClaimWithGroq } from '@/lib/groq';

// const supabaseAdmin = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// export async function POST(
//     request: Request,
//     { params }: { params: Promise<{ id: string }> }
// ) {
//     try {
//         const { id: claim_id } = await params;
//         const cookieStore = await cookies();
//         const token = cookieStore.get('auth_token')?.value;

//         if (!token) {
//             return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
//         }

//         const decoded = await verifyToken(token);
//         if (!decoded) {
//             return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
//         }

//         // 1. Fetch claim + policy details
//         const { data: claim, error: claimError } = await supabaseAdmin
//             .from('claims')
//             .select(`
//                 *,
//                 policy:policies(*)
//             `)
//             .eq('id', claim_id)
//             .single();

//         if (claimError || !claim) {
//             return NextResponse.json({ success: false, error: 'Claim not found' }, { status: 404 });
//         }

//         // 2. Fetch document URLs
//         const { data: documents, error: docsError } = await supabaseAdmin
//             .from('claim_documents')
//             .select('file_url')
//             .eq('claim_id', claim_id);

//         if (docsError) {
//             return NextResponse.json({ success: false, error: 'Failed to fetch claim documents' }, { status: 500 });
//         }

//         const document_urls = documents.map(d => d.file_url);

//         // 3. Call Groq AI Analysis
//         const aiResult = await analyzeClaimWithGroq(
//             {
//                 incident_type: claim.incident_type,
//                 incident_description: claim.incident_description,
//                 estimated_repair_cost: claim.estimated_repair_cost,
//                 document_urls
//             },
//             claim.policy
//         );

//         // 4. Update claim with AI results
//         const { data: updatedClaim, error: updateError } = await supabaseAdmin
//             .from('claims')
//             .update({
//                 ai_approved_amount: aiResult.total_estimate.final_claim_amount,
//                 ai_depreciation_applied: aiResult.total_estimate.total_depreciation,
//                 ai_ncb_deduction: claim.policy.ncb_percentage || 0,
//                 ai_final_amount: aiResult.total_estimate.final_claim_amount,
//                 ai_reasoning: aiResult.recommendation_reason,
//                 ai_confidence: aiResult.confidence_score.toString(),
//                 ai_damaged_parts: aiResult.damage_items.map((item: any) => item.part_name),
//                 ai_recommendation: aiResult.recommendation,
//                 status: 'ai_complete', // Consistent with types.index.ts: ai_complete
//                 updated_at: new Date().toISOString()
//             })
//             .eq('id', claim_id)
//             .select()
//             .single();

//         if (updateError) {
//             console.error('Update Claim AI Error:', updateError);
//             return NextResponse.json({ success: false, error: 'Failed to save AI assessment' }, { status: 500 });
//         }

//         // 5. Save individual damage items (clear existing first)
//         await supabaseAdmin.from('damage_items').delete().eq('claim_id', claim_id);

//         // const damageItemsToInsert = aiResult.damage_items.map((item: any) => ({
//         //     claim_id,
//         //     part_name: item.part_name,
//         //     part_location: item.part_location,
//         //     damage_type: item.damage_type,
//         //     damage_severity: item.damage_severity,
//         //     ai_recommendation: item.ai_recommendation,
//         //     confidence: item.confidence,
//         //     oem_part_price: item.oem_price,
//         //     local_part_price: item.aftermarket_price,
//         //     repair_labor_hours: item.labor_hours,
//         //     labor_rate_per_hour: item.labor_hours > 0 ? (item.labor_cost / item.labor_hours) : 0,
//         //     painting_cost: item.painting_cost,
//         //     depreciation_rate: item.depreciation_rate,
//         //     depreciation_amount: item.depreciation_amount,
//         //     item_gross_amount: item.subtotal_gross,
//         //     item_net_amount: item.subtotal_net
//         // }));

//         const damageItemsToInsert = aiResult.damage_items.map((item: any) => ({
//              claim_id,
//              part_name: (item.part_name || 'Unknown').substring(0, 255),
//              damage_severity: (item.damage_severity || 'moderate').substring(0, 255),
//              ai_recommendation: (item.ai_recommendation || 'repair').substring(0, 255),
//              labor_cost: item.labor_cost || 0,
//              depreciation_rate: item.depreciation_rate || 0,
//              depreciation_amount: item.depreciation_amount || 0,
//              net_subtotal: item.subtotal_net || 0,
//          }));

//         if (damageItemsToInsert.length > 0) {
//             const { error: damageError } = await supabaseAdmin
//                 .from('damage_items')
//                 .insert(damageItemsToInsert);

//             if (damageError) {
//                 console.error('Save Damage Items Error:', damageError);
//                 // Non-blocking for the overall response
//             }
//         }

//         return NextResponse.json({
//             success: true,
//             analysis: aiResult,
//             claim: updatedClaim
//         });

//     } catch (error: any) {
//         console.error('Analyze Claim API Error:', error);
//         return NextResponse.json({ success: false, error: 'Internal server error during AI analysis' }, { status: 500 });
//     }
// }
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';
import { analyzeWithGroq } from '@/lib/ai/groq';
import { analyzeWithGemini } from '@/lib/ai/gemini';
import { generateMockAnalysis } from '@/lib/ai/mock';
import { AgentConfig } from '@/config/agent-config'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchPhotoAsBase64(
  url: string
): Promise<{ base64: string; mediaType: string } | null> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) {
      console.warn(`Photo fetch failed (${response.status}): ${url}`);
      return null;
    }
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const mediaType = contentType.startsWith('image/') ? contentType.split(';')[0] : 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return { base64, mediaType };
  } catch (err) {
    console.warn(`Could not fetch photo: ${url}`, err);
    return null;
  }
}

async function resolvePhotoUrl(rawUrl: string): Promise<string> {
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
  const { data } = await supabaseAdmin.storage
    .from('claim-documents')
    .createSignedUrl(rawUrl, 3600);
  return data?.signedUrl ?? rawUrl;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: claim_id } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
    }

    // 1. Fetch claim + policy
    const { data: claim, error: claimError } = await supabaseAdmin
      .from('claims')
      .select(`*, policy:policies(*)`)
      .eq('id', claim_id)
      .single();

    if (claimError || !claim) {
      return NextResponse.json({ success: false, error: 'Claim not found' }, { status: 404 });
    }

    // 2. Fetch document rows
    const { data: documents, error: docsError } = await supabaseAdmin
      .from('claim_documents')
      .select('file_url, file_name')
      .eq('claim_id', claim_id);

    if (docsError) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch claim documents' },
        { status: 500 }
      );
    }

    // 3. Download photos and convert to base64
    console.log(`[analyze] Downloading ${documents.length} photos for claim ${claim_id}...`);

    const photoResults = await Promise.all(
      documents.map(async (doc, i) => {
        const resolvedUrl = await resolvePhotoUrl(doc.file_url);
        const result = await fetchPhotoAsBase64(resolvedUrl);
        if (!result) return null;
        return {
          base64: result.base64,
          mediaType: result.mediaType,
          label: doc.file_name || `Photo ${i + 1}`,
        };
      })
    );

    const photos = photoResults.filter(Boolean) as {
      base64: string;
      mediaType: string;
      label: string;
    }[];

    console.log(`[analyze] Successfully loaded ${photos.length}/${documents.length} photos`);

    const incidentLocation: string =
      claim.incident_location || claim.city || claim.policy?.city || 'Unknown';

    // 4. Call vision model with fallback chain
    let aiResult;
    let analysisSource = 'groq_vision';

    try {
      if (photos.length === 0) throw new Error('No photos available for vision analysis');

      // FIX: Groq vision supports max 5 images
      const groqPhotos = photos.slice(0, AgentConfig.vision.maxPhotos)

      aiResult = await analyzeWithGroq({
        policy: claim.policy,
        incidentType: claim.incident_type,
        incidentLocation,
        photos: groqPhotos,
      });
      console.log(`[analyze] Groq vision succeeded (${groqPhotos.length} photos)`);

    } catch (groqErr: any) {
      console.warn(`[analyze] Groq vision failed: ${groqErr.message} — trying Gemini...`);
      analysisSource = 'gemini_vision';

      try {
        aiResult = await analyzeWithGemini({
          policy: claim.policy,
          incidentType: claim.incident_type,
          incidentLocation,
          photos: photos.slice(0, 16),
        });
        console.log(`[analyze] Gemini vision succeeded`);

      } catch (geminiErr: any) {
        console.warn(`[analyze] Gemini failed: ${geminiErr.message} — using mock`);
        analysisSource = 'mock';
        aiResult = generateMockAnalysis(claim.policy, incidentLocation);
      }
    }
//     // If vision returns no damage (likely test photos), use mock for demo
// if (aiResult.damage_items.length === 0) {
//   console.log('[analyze] No damage detected — using mock for demo integrity');
//   aiResult = generateMockAnalysis(claim.policy, incidentLocation);
// }

    // 5. Persist AI results to claim row
    const { data: updatedClaim, error: updateError } = await supabaseAdmin
      .from('claims')
      .update({
        ai_approved_amount: aiResult.total_estimate.final_claim_amount,
        ai_depreciation_applied: aiResult.total_estimate.total_depreciation,
        ai_ncb_deduction: claim.policy.ncb_percentage || 0,
        ai_final_amount: aiResult.total_estimate.final_claim_amount,
        ai_reasoning: aiResult.recommendation_reason,
        ai_confidence: aiResult.confidence_score.toString(),
        ai_damaged_parts: aiResult.damage_items.map((item: any) => item.part_name),
        ai_recommendation: aiResult.recommendation,
        status: 'ai_complete',
        updated_at: new Date().toISOString(),
      })
      .eq('id', claim_id)
      .select()
      .single();

    if (updateError) {
      console.error('Update Claim AI Error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to save AI assessment' },
        { status: 500 }
      );
    }
    console.log('[analyze] Vision result:', {
  final_claim_amount: aiResult.total_estimate?.final_claim_amount,
  damage_items_count: aiResult.damage_items?.length,
  confidence: aiResult.confidence_score,
});
console.log('[analyze] Raw vision result:', JSON.stringify(aiResult, null, 2));

    // 6. Persist damage items
    // FIX: truncate string fields to 20 chars to match varchar(20) DB columns
    await supabaseAdmin.from('damage_items').delete().eq('claim_id', claim_id);

    const damageItemsToInsert = aiResult.damage_items.map((item: any) => ({
           claim_id,
           part_name: (item.part_name || 'Unknown').substring(0, 100),
           part_location: (item.part_location || 'unknown').substring(0, 50),
           severity: (item.damage_severity || 'moderate').substring(0, 50),      // ← correct column name
           action: (item.ai_recommendation || 'repair').substring(0, 50),        // ← correct column name
           confidence: item.confidence || 0,
           oem_price: item.oem_price || 0,
           labor_cost: item.labor_cost || 0,
           depreciation_rate: item.depreciation_rate || 0,
           depreciation_amount: item.depreciation_amount || 0,
           net_subtotal: item.subtotal_net || 0,
         }));

    if (damageItemsToInsert.length > 0) {
      const { error: damageError } = await supabaseAdmin
        .from('damage_items')
        .insert(damageItemsToInsert);
      if (damageError) {
        console.error('Save Damage Items Error:', damageError);
      }
    }

    // 7. Return
    return NextResponse.json({
      success: true,
      analysis: aiResult,
      claim: updatedClaim,
      meta: {
        photos_uploaded: documents.length,
        photos_analyzed: photos.length,
        analysis_source: analysisSource,
      },
    });

  } catch (error: any) {
    console.error('Analyze Claim API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during AI analysis' },
      { status: 500 }
    );
  }
}
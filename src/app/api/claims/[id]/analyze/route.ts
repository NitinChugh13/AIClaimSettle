import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';
import { analyzeClaimWithGroq } from '@/lib/groq';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
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

        // 1. Fetch claim + policy details
        const { data: claim, error: claimError } = await supabaseAdmin
            .from('claims')
            .select(`
                *,
                policy:policies(*)
            `)
            .eq('id', claim_id)
            .single();

        if (claimError || !claim) {
            return NextResponse.json({ success: false, error: 'Claim not found' }, { status: 404 });
        }

        // 2. Fetch document URLs
        const { data: documents, error: docsError } = await supabaseAdmin
            .from('claim_documents')
            .select('file_url')
            .eq('claim_id', claim_id);

        if (docsError) {
            return NextResponse.json({ success: false, error: 'Failed to fetch claim documents' }, { status: 500 });
        }

        const document_urls = documents.map(d => d.file_url);

        // 3. Call Groq AI Analysis
        const aiResult = await analyzeClaimWithGroq(
            {
                incident_type: claim.incident_type,
                incident_description: claim.incident_description,
                estimated_repair_cost: claim.estimated_repair_cost,
                document_urls
            },
            claim.policy
        );

        // 4. Update claim with AI results
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
                status: 'ai_complete', // Consistent with types.index.ts: ai_complete
                updated_at: new Date().toISOString()
            })
            .eq('id', claim_id)
            .select()
            .single();

        if (updateError) {
            console.error('Update Claim AI Error:', updateError);
            return NextResponse.json({ success: false, error: 'Failed to save AI assessment' }, { status: 500 });
        }

        // 5. Save individual damage items (clear existing first)
        await supabaseAdmin.from('damage_items').delete().eq('claim_id', claim_id);

        const damageItemsToInsert = aiResult.damage_items.map((item: any) => ({
            claim_id,
            part_name: item.part_name,
            part_location: item.part_location,
            damage_type: item.damage_type,
            damage_severity: item.damage_severity,
            ai_recommendation: item.ai_recommendation,
            confidence: item.confidence,
            oem_part_price: item.oem_price,
            local_part_price: item.aftermarket_price,
            repair_labor_hours: item.labor_hours,
            labor_rate_per_hour: item.labor_hours > 0 ? (item.labor_cost / item.labor_hours) : 0,
            painting_cost: item.painting_cost,
            depreciation_rate: item.depreciation_rate,
            depreciation_amount: item.depreciation_amount,
            item_gross_amount: item.subtotal_gross,
            item_net_amount: item.subtotal_net
        }));

        if (damageItemsToInsert.length > 0) {
            const { error: damageError } = await supabaseAdmin
                .from('damage_items')
                .insert(damageItemsToInsert);

            if (damageError) {
                console.error('Save Damage Items Error:', damageError);
                // Non-blocking for the overall response
            }
        }

        return NextResponse.json({
            success: true,
            analysis: aiResult,
            claim: updatedClaim
        });

    } catch (error: any) {
        console.error('Analyze Claim API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error during AI analysis' }, { status: 500 });
    }
}

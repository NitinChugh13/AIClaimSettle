import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const claim_number = searchParams.get('claim_number');

        if (!claim_number) {
            return NextResponse.json({ success: false, error: 'Claim number required' }, { status: 400 });
        }

        console.log('[Claim Search API] Searching for:', claim_number);

        const { data: claim, error } = await supabaseAdmin
            .from('claims')
            .select(`
                *,
                claim_documents (*),
                users!claims_user_id_fkey (
                    full_name, mobile, email
                ),
                policies!claims_policy_id_fkey (
                    vehicle_make, vehicle_model,
                    vehicle_year, vehicle_number,
                    insurer_name, idv_value,
                    policy_number
                ),
                surveyor_assignments (
                    *,
                    surveyors (full_name, mobile, license_number)
                )
            `)
            .eq('claim_number', claim_number.toUpperCase())
            .single();

        if (error || !claim) {
            console.error('[Claim Search API] Error or not found:', error);
            return NextResponse.json(
                { success: false, error: 'Claim not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, claim });
    } catch (error: any) {
        console.error('Claim Search API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

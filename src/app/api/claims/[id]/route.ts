import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        console.log('[Claim Detail API] Fetching details for:', id);

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
            .eq('id', id)
            .single();

        if (error || !claim) {
            console.error('[Claim Detail API] Error or not found:', error);
            return NextResponse.json(
                { success: false, error: error?.message || 'Claim not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, claim });
    } catch (error: any) {
        console.error('Get Claim API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

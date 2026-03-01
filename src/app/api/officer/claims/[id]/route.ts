import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Fetch claim with all joins
        const { data: claim, error } = await supabaseAdmin
            .from('claims')
            .select(`
                *,
                claim_documents (*),
                users!claims_user_id_fkey (full_name, email),
                policies!claims_policy_id_fkey (
                    vehicle_make, vehicle_model, vehicle_year, vehicle_number
                ),
                surveyor_assignments (*, surveyors (full_name, license_number, mobile))
            `)
            .eq('id', id)
            .single();

        if (error || !claim) {
            return NextResponse.json({ success: false, error: 'Claim not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, claim });
    } catch (error: any) {
        console.error('Officer Claim Detail Fetch Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

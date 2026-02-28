import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        let query = supabaseAdmin
            .from('claims')
            .select(`
                *,
                users (full_name, email),
                policies (policy_number, vehicle_make, vehicle_model, vehicle_number)
            `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (status) {
            query = query.eq('status', status);
        }

        const { data: claims, error, count } = await query;

        if (error) throw error;

        // Map for easier UI consumption
        const formattedClaims = claims.map(claim => ({
            ...claim,
            claimant_name: claim.users?.full_name,
            claimant_email: claim.users?.email,
            vehicle: `${claim.policies?.vehicle_make} ${claim.policies?.vehicle_model}`,
            vehicle_number: claim.policies?.vehicle_number,
            policy_number: claim.policies?.policy_number
        }));

        return NextResponse.json(formattedClaims);
    } catch (error: any) {
        console.error('Admin Claims Fetch Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

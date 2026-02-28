import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const policyNumber = searchParams.get('policy');

        let query = supabaseAdmin
            .from('claims')
            .select(`
                *,
                policy:policies (*)
            `)
            .eq('user_id', decoded.userId)
            .order('created_at', { ascending: false });

        if (policyNumber) {
            // Join with policies table to filter by number
            // Actually, we've already joined for select, just add the filter
            query = query.filter('policy.policy_number', 'eq', policyNumber);
        }

        const { data: claims, error } = await query;

        if (error) {
            console.error('Fetch claims error:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // Map to the format the dashboard expects
        const formattedClaims = claims.map((claim: any) => ({
            id: claim.id,
            policyNumber: claim.policy?.policy_number || 'N/A',
            vehicleReg: claim.policy?.vehicle_number || 'N/A',
            incidentType: claim.incident_type,
            incidentDate: claim.incident_date,
            totalAmount: claim.ai_final_amount || claim.estimated_repair_cost || 0,
            status: claim.status,
            createdAt: claim.created_at
        }));

        return NextResponse.json(formattedClaims);
    } catch (error) {
        console.error('History API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

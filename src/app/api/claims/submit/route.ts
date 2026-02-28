import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
        }

        const body = await request.json();
        const {
            incident_date,
            incident_time,
            incident_location,
            incident_type,
            incident_description,
            fir_number,
            estimated_repair_cost
        } = body;

        // 1. Fetch user's policy
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('policy_id')
            .eq('id', decoded.userId)
            .single();

        if (userError || !user || !user.policy_id) {
            return NextResponse.json({ success: false, error: 'No active policy found for this user' }, { status: 400 });
        }

        // 2. Generate claim number (CLM-YYYY-NNNNN)
        const currentYear = new Date().getFullYear();
        const { count, error: countError } = await supabaseAdmin
            .from('claims')
            .select('*', { count: 'exact', head: true })
            .filter('created_at', 'gte', `${currentYear}-01-01T00:00:00Z`);

        if (countError) {
            console.error('Error counting claims:', countError);
            return NextResponse.json({ success: false, error: 'Failed to generate claim number' }, { status: 500 });
        }

        const nextNum = (count || 0) + 1;
        const claim_number = `CLM-${currentYear}-${nextNum.toString().padStart(5, '0')}`;

        // 3. Insert into claims table
        const { data: claim, error: insertError } = await supabaseAdmin
            .from('claims')
            .insert([{
                claim_number,
                user_id: decoded.userId,
                policy_id: user.policy_id,
                incident_date,
                incident_time,
                incident_location,
                incident_type,
                incident_description,
                fir_number,
                estimated_repair_cost: Number(estimated_repair_cost),
                status: 'submitted'
            }])
            .select()
            .single();

        if (insertError) {
            console.error('Error inserting claim:', insertError);
            return NextResponse.json({ success: false, error: 'Failed to submit claim' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            claim_id: claim.id,
            claim_number: claim.claim_number
        });

    } catch (error: any) {
        console.error('Claim Submission API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error while submitting claim' }, { status: 500 });
    }
}

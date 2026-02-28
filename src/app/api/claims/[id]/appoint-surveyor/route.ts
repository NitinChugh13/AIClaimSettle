import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

        const body = await request.json();
        const { surveyor_id, inspection_date, notes } = body;

        if (!surveyor_id || !inspection_date) {
            return NextResponse.json({ success: false, error: 'Surveyor and date are required' }, { status: 400 });
        }

        // 1. Create assignment
        const { data: assignment, error: assignError } = await supabaseAdmin
            .from('surveyor_assignments')
            .insert([{
                claim_id,
                surveyor_id,
                inspection_date,
                inspection_notes: notes,
                status: 'assigned'
            }])
            .select()
            .single();

        if (assignError) {
            console.error('Surveyor Assignment Error:', assignError);
            return NextResponse.json({ success: false, error: 'Failed to assign surveyor' }, { status: 500 });
        }

        // 2. Update claim status
        const { error: claimError } = await supabaseAdmin
            .from('claims')
            .update({ status: 'surveyor_assigned' })
            .eq('id', claim_id);

        if (claimError) {
            console.error('Update Claim Status Error:', claimError);
            // We proceed anyway as assignment is already created
        }

        return NextResponse.json({
            success: true,
            assignment
        });

    } catch (error: any) {
        console.error('Appoint Surveyor API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error while appointing surveyor' }, { status: 500 });
    }
}

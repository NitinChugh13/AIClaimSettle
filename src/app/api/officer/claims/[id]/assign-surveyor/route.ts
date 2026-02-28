import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { surveyor_id, inspection_date, notes } = await request.json();

        // 1. Create surveyor assignment
        const { data: assignment, error: assignmentError } = await supabaseAdmin
            .from('surveyor_assignments')
            .insert({
                claim_id: id,
                surveyor_id: surveyor_id,
                inspection_date: inspection_date,
                notes: notes
            })
            .select()
            .single();

        if (assignmentError) throw assignmentError;

        // 2. Update claim status
        const { data: updatedClaim, error: claimError } = await supabaseAdmin
            .from('claims')
            .update({
                status: 'surveyor_assigned',
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (claimError) throw claimError;

        return NextResponse.json({ success: true, assignment, claim: updatedClaim });
    } catch (error: any) {
        console.error('Officer Assign Surveyor Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

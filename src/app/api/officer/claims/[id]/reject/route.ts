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
        const { rejection_reason, officer_notes } = await request.json();

        const { data: updatedClaim, error } = await supabaseAdmin
            .from('claims')
            .update({
                status: 'rejected',
                rejection_reason: rejection_reason,
                officer_notes: officer_notes,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, claim: updatedClaim });
    } catch (error: any) {
        console.error('Officer Reject Claim Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

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
        // Trigger schema reload after manual SQL fix for officer_notes/rejection_reason columns
        const { id } = await params;
        const { final_amount, officer_notes } = await request.json();

        console.log('[Approve API] Called for claim:', id);
        console.log('[Approve API] Body:', { final_amount, officer_notes });

        const { data: updatedClaim, error } = await supabaseAdmin
            .from('claims')
            .update({
                status: 'approved',
                final_approved_amount: final_amount || 0,
                officer_notes: officer_notes,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        console.log('[Approve API] Update result:', updatedClaim, error);

        if (error) throw error;

        return NextResponse.json({ success: true, claim: updatedClaim });
    } catch (error: any) {
        console.error('Officer Approve Claim Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal server error',
            details: error
        }, { status: 500 });
    }
}

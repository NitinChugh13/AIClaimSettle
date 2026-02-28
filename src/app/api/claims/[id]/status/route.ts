import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PATCH(
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
        const { status, final_approved_amount, officer_notes } = body;

        console.log(`[Claim Status PATCH] Updating claim ${claim_id} to status: ${status}`);

        const updateData: any = {
            status,
            updated_at: new Date().toISOString()
        };

        if (final_approved_amount !== undefined) {
            updateData.final_approved_amount = Number(final_approved_amount);
        }

        if (officer_notes !== undefined) {
            updateData.officer_notes = officer_notes;
        }

        const { data, error } = await supabaseAdmin
            .from('claims')
            .update(updateData)
            .eq('id', claim_id)
            .select()
            .single();

        if (error) {
            console.error('[Claim Status PATCH] Error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, claim: data });

    } catch (error: any) {
        console.error('Update Claim Status API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error while updating status' }, { status: 500 });
    }
}

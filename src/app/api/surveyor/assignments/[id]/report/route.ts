import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

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
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded || (decoded.role !== 'surveyor' && decoded.role !== 'admin')) {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
        }

        const { report_details, surveyor_estimated_amount } = await request.json();

        // 1. Update surveyor assignment
        const { error: assignmentError } = await supabaseAdmin
            .from('surveyor_assignments')
            .update({
                status: 'completed',
                report_details,
                surveyor_estimated_amount,
                completed_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('surveyor_id', decoded.userId);

        if (assignmentError) throw assignmentError;

        // 2. Fetch the claim ID associated with this assignment
        const { data: assignment } = await supabaseAdmin
            .from('surveyor_assignments')
            .select('claim_id')
            .eq('id', id)
            .single();

        // 3. Update claim status to officer_review for final validation
        if (assignment?.claim_id) {
            await supabaseAdmin
                .from('claims')
                .update({
                    status: 'officer_review',
                    officer_notes: `Field report received from ${decoded.fullName}. Amount: ₹${surveyor_estimated_amount}`
                })
                .eq('id', assignment.claim_id);
        }

        return NextResponse.json({ success: true, message: 'Inspection report submitted successfully' });
    } catch (error: any) {
        console.error('Surveyor Report API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

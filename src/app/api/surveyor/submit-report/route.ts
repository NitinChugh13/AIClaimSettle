import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const surveyorToken = cookieStore.get('surveyor_token')?.value;
        const adminToken = cookieStore.get('admin_token')?.value;
        const token = surveyorToken || adminToken;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded || (decoded.role !== 'surveyor' && decoded.role !== 'admin')) {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
        }

        const {
            assignment_id,
            claim_id,
            surveyor_amount,
            vehicle_condition,
            damaged_parts,
            field_notes
        } = await request.json();

        if (!assignment_id) {
            return NextResponse.json({ success: false, error: 'Assignment ID is required' }, { status: 400 });
        }

        // 1. Update surveyor assignment
        const { error: assignmentError } = await supabaseAdmin
            .from('surveyor_assignments')
            .update({
                status: 'completed',
                surveyor_amount: surveyor_amount,
                vehicle_condition: vehicle_condition,
                inspection_notes: field_notes,
                damaged_parts: damaged_parts,
                completed_at: new Date().toISOString()
            })
            .eq('id', assignment_id);

        if (assignmentError) {
            console.error('Assignment Update Error:', assignmentError);
            throw assignmentError;
        }

        // 2. Update claim status to 'surveyor_reported'
        if (claim_id) {
            const { error: claimError } = await supabaseAdmin
                .from('claims')
                .update({
                    status: 'surveyor_reported',
                    surveyor_amount: surveyor_amount,
                    vehicle_condition: vehicle_condition, // Store condition on claim
                })
                .eq('id', claim_id);

            if (claimError) {
                console.error('Claim Update Error:', claimError);
                // Non-fatal for the surveyor flow, but good to log
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Report submitted and synchronized'
        });

    } catch (error: any) {
        console.error('Surveyor Submit Report API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

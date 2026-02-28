import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
        }

        const { data: claim, error } = await supabaseAdmin
            .from('claims')
            .select(`
                *,
                policy:policies(*),
                documents:claim_documents(*),
                damage_items(*),
                assignment:surveyor_assignments(
                    *,
                    surveyor:surveyors(*)
                )
            `)
            .eq('id', id)
            .single();

        if (error || !claim) {
            return NextResponse.json({ success: false, error: 'Claim not found' }, { status: 404 });
        }

        // Security check: ensure user owns this claim
        if (claim.user_id !== decoded.userId) {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
        }

        // Map to frontend interface
        const result = {
            id: claim.id,
            status: claim.status,
            vehicleModel: `${claim.policy?.vehicle_make} ${claim.policy?.vehicle_model}`,
            vehicleReg: claim.policy?.vehicle_number,
            createdAt: claim.created_at,
            totalAmount: claim.ai_final_amount || claim.estimated_repair_cost || 0,
            incidentType: claim.incident_type,
            incidentDate: claim.incident_date,
            damageItems: (claim.damage_items || []).map((item: any) => ({
                id: item.id,
                partName: item.part_name,
                severity: item.damage_severity,
                action: item.ai_recommendation,
                netSubtotal: item.item_net_amount
            }))
        };

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Get Claim API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0, 0, 0, 0);

        const [
            claimsCount,
            usersCount,
            policiesCount,
            claimsByStatus,
            financeData,
            monthClaims
        ] = await Promise.all([
            supabaseAdmin.from('claims').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('policies').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('claims').select('status'),
            supabaseAdmin.from('claims').select('estimated_repair_cost, final_approved_amount'),
            supabaseAdmin.from('claims').select('*', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth.toISOString())
        ]);

        // Process status distribution
        const statusMap: Record<string, number> = {};
        claimsByStatus.data?.forEach(c => {
            statusMap[c.status] = (statusMap[c.status] || 0) + 1;
        });

        const stats = {
            total_claims: claimsCount.count || 0,
            total_users: usersCount.count || 0,
            total_policies: policiesCount.count || 0,
            claims_by_status: statusMap,
            total_amount_claimed: financeData.data?.reduce((sum, c) => sum + (c.estimated_repair_cost || 0), 0) || 0,
            total_amount_approved: financeData.data?.reduce((sum, c) => sum + (c.final_approved_amount || 0), 0) || 0,
            claims_this_month: monthClaims.count || 0,
        };

        return NextResponse.json({ success: true, stats });
    } catch (error: any) {
        console.error('Admin Stats Fetch Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

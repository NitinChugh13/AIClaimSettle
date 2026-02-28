import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    console.log('[Officer Claims API] Called');
    try {
        const cookieStore = await cookies();
        const officerToken = cookieStore.get('officer_token')?.value;
        const adminToken = cookieStore.get('admin_token')?.value;
        const token = officerToken || adminToken;

        console.log('[Officer Claims API] Officer Token present:', !!officerToken);
        console.log('[Officer Claims API] Admin Token present:', !!adminToken);

        if (!token) {
            console.warn('[Officer Claims API] No token found. Proceeding with demo access.');
            // For now, let's not block with 401
        }
        console.log('[Officer Claims API] Fetching ALL claims for diagnosis...');

        const { data: allClaims, error: allClaimsError } = await supabaseAdmin
            .from('claims')
            .select('*');

        console.log('[Officer Claims API] All claims in DB count:', allClaims?.length);
        console.log('[Officer Claims API] Existing statuses:', allClaims?.map(c => c.status));

        const { data: claims, error } = await supabaseAdmin
            .from('claims')
            .select(`
                *,
                users (full_name),
                policies (vehicle_make, vehicle_model, vehicle_year, vehicle_number)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Map data for easier consumption
        const formattedClaims = (claims || []).map(claim => ({
            ...claim,
            claimant_name: claim.users?.full_name || 'Unknown',
            vehicle: claim.policies ? `${claim.policies.vehicle_make} ${claim.policies.vehicle_model} (${claim.policies.vehicle_year})` : 'Unknown Vehicle',
            vehicle_number: claim.policies?.vehicle_number || 'N/A'
        }));

        console.log('[Officer Claims API] Returning count:', formattedClaims.length);
        return NextResponse.json({
            success: true,
            claims: formattedClaims,
            data: formattedClaims // Handle both formats
        });
    } catch (error: any) {
        console.error('Officer Claims Fetch Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

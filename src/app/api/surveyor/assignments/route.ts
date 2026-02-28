import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded || (decoded.role !== 'surveyor' && decoded.role !== 'admin')) {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
        }

        const { data: assignments, error } = await supabaseAdmin
            .from('surveyor_assignments')
            .select(`
                *,
                claims (
                    *,
                    users (full_name),
                    policies (policy_number, vehicle_make, vehicle_model, vehicle_number)
                )
            `)
            .eq('surveyor_id', decoded.userId)
            .order('inspection_date', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ success: true, assignments });
    } catch (error: any) {
        console.error('Surveyor Assignments API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

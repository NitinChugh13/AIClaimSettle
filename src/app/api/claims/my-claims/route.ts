import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
        }

        const { data: claims, error } = await supabaseAdmin
            .from('claims')
            .select(`
                id,
                claim_number,
                incident_type,
                incident_date,
                estimated_repair_cost,
                ai_approved_amount,
                status,
                created_at
            `)
            .eq('user_id', decoded.userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('My Claims API Error:', error);
            return NextResponse.json({ success: false, error: 'Failed to fetch claims' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            claims
        });

    } catch (error: any) {
        console.error('My Claims API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error while fetching claims' }, { status: 500 });
    }
}

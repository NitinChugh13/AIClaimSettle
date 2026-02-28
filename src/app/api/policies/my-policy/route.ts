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

        // 1. Get user's policy_id
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('policy_id')
            .eq('id', decoded.userId)
            .single();

        if (userError || !user || !user.policy_id) {
            return NextResponse.json({ success: false, error: 'No policy linked' }, { status: 404 });
        }

        // 2. Fetch policy details
        const { data: policy, error: policyError } = await supabaseAdmin
            .from('policies')
            .select('*')
            .eq('id', user.policy_id)
            .single();

        if (policyError || !policy) {
            return NextResponse.json({ success: false, error: 'Policy details not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            policy
        });

    } catch (error: any) {
        console.error('My Policy API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

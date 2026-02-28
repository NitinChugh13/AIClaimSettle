import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get('auth_token')?.value;

        if (!authToken) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        // 1. Verify token
        const payload = await verifyToken(authToken);

        if (!payload || !payload.userId) {
            return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
        }

        // 2. Fetch fresh user data from DB
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('id, full_name, mobile, email, is_mobile_verified, policy_id, policy_verified, created_at')
            .eq('id', payload.userId)
            .single();

        if (userError || !user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user
        });

    } catch (error: any) {
        console.error('Get Me API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error fetching user profile' }, { status: 500 });
    }
}

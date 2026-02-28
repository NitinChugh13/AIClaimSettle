import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const { data: users, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Get claim counts for each user
        const { data: claimCounts } = await supabaseAdmin
            .from('claims')
            .select('user_id');

        const map: Record<string, number> = {};
        claimCounts?.forEach(c => {
            map[c.user_id] = (map[c.user_id] || 0) + 1;
        });

        const usersWithClaims = users.map(user => ({
            ...user,
            claim_count: map[user.id] || 0
        }));

        return NextResponse.json({ success: true, users: usersWithClaims });
    } catch (error: any) {
        console.error('Admin Users Fetch Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    console.log('[Officer Surveyors API] Called');
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('officer_token')?.value || cookieStore.get('admin_token')?.value;

        if (!token) {
            console.warn('[Officer Surveyors API] No token found. Proceeding with demo access.');
            // For now, let's not block with 401
        }
        const { data: surveyors, error } = await supabaseAdmin
            .from('surveyors')
            .select('*')
            .eq('is_available', true);

        if (error) throw error;

        return NextResponse.json({ success: true, surveyors });
    } catch (error: any) {
        console.error('Officer Surveyors Fetch Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

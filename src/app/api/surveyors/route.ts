import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
    try {
        const { data: surveyors, error } = await supabaseAdmin
            .from('surveyors')
            .select('*')
            .eq('is_available', true);

        if (error) {
            console.error('Fetch Surveyors Error:', error);
            return NextResponse.json({ success: false, error: 'Failed to fetch surveyors' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            surveyors
        });

    } catch (error: any) {
        console.error('Surveyors API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

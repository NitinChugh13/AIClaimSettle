import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const { data: surveyors, error } = await supabaseAdmin
            .from('surveyors')
            .select('*')
            .order('full_name', { ascending: true });

        if (error) throw error;

        // Get assignment counts for each surveyor
        const { data: assignments } = await supabaseAdmin
            .from('surveyor_assignments')
            .select('surveyor_id');

        const map: Record<string, number> = {};
        assignments?.forEach(a => {
            map[a.surveyor_id] = (map[a.surveyor_id] || 0) + 1;
        });

        const surveyorsWithCounts = surveyors.map(s => ({
            ...s,
            assignment_count: map[s.id] || 0
        }));

        return NextResponse.json({ success: true, surveyors: surveyorsWithCounts });
    } catch (error: any) {
        console.error('Admin Surveyors Fetch Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

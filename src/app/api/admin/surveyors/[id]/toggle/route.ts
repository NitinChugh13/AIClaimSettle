import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get current status first
        const { data: current, error: fetchError } = await supabaseAdmin
            .from('surveyors')
            .select('is_available')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        const { data: updated, error: updateError } = await supabaseAdmin
            .from('surveyors')
            .update({ is_available: !current.is_available })
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, surveyor: updated });
    } catch (error: any) {
        console.error('Admin Surveyor Toggle Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

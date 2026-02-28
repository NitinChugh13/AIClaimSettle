import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    console.log('[Setup API] Called');
    console.log('[Setup API] URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('[Setup API] Key present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    try {
        // Generate fresh hash
        const hash = await bcrypt.hash('Admin@1234', 12);
        console.log('[Setup API] Generated hash:', hash);

        console.log('[Setup API] Attempting delete...');
        // Delete existing records
        const { error: deleteError } = await supabaseAdmin
            .from('admin_users')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

        if (deleteError) {
            console.error('[Setup API] Delete error:', deleteError);
            return NextResponse.json({ success: false, error: 'Delete failed: ' + deleteError.message });
        }
        console.log('[Setup API] Delete successful');

        console.log('[Setup API] Attempting insert...');
        // Re-insert with fresh hash
        const { data, error } = await supabaseAdmin
            .from('admin_users')
            .insert([
                {
                    full_name: 'Super Admin',
                    email: 'admin@claimnova.in',
                    password_hash: hash,
                    role: 'admin',
                    is_active: true
                },
                {
                    full_name: 'Claims Officer',
                    email: 'officer@claimnova.in',
                    password_hash: hash,
                    role: 'officer',
                    is_active: true
                }
            ])
            .select();

        if (error) {
            console.error('[Setup API] Insert error:', error);
            return NextResponse.json({
                success: false,
                error: error.message
            });
        }

        console.log('[Setup API] Re-insertion successful, count:', data?.length);

        return NextResponse.json({
            success: true,
            message: 'Admin users recreated',
            count: data.length,
            hash: hash
        });

    } catch (err: any) {
        console.error('[Setup API] UNEXPECTED ERROR:', err);
        return NextResponse.json({
            success: false,
            error: err.message || 'Unknown error'
        });
    }
}

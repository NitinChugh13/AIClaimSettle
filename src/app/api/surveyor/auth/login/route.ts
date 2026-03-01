import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { generateToken } from '@/lib/auth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const { license_number, mobile } = await request.json();

        if (!license_number || !mobile) {
            return NextResponse.json({ success: false, error: 'License and Mobile are required' }, { status: 400 });
        }

        console.log('[Surveyor Login] Attempting login for:', { license_number, mobile });

        // 1. Fetch surveyor from surveyors table
        const { data: surveyor, error: sError } = await supabaseAdmin
            .from('surveyors')
            .select('*')
            .ilike('license_number', license_number.trim())
            .eq('mobile', mobile.trim())
            .maybeSingle();

        if (sError) {
            console.error('Surveyor Query Error:', sError);
            return NextResponse.json({ success: false, error: 'Database query failed' }, { status: 500 });
        }

        if (!surveyor) {
            console.warn('[Surveyor Login] No surveyor found for:', { license_number, mobile });
            return NextResponse.json({ success: false, error: 'Invalid license or mobile number' }, { status: 401 });
        }

        // 2. Generate JWT with role: surveyor
        const token = await generateToken({
            userId: surveyor.id,
            email: surveyor.email,
            role: 'surveyor',
            fullName: surveyor.full_name
        });

        // 3. Set surveyor_token cookie
        const cookieStore = await cookies();
        cookieStore.set('surveyor_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        // 4. Return success
        return NextResponse.json({
            success: true,
            user: {
                id: surveyor.id,
                full_name: surveyor.full_name,
                role: 'surveyor',
                email: surveyor.email,
                license_number: surveyor.license_number
            }
        });

    } catch (error: any) {
        console.error('Surveyor Login API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { comparePassword, generateToken } from '@/lib/auth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
        }

        // 1. Fetch admin user
        const { data: user, error: userError } = await supabaseAdmin
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .eq('is_active', true)
            .single();

        if (userError || !user) {
            return NextResponse.json({ success: false, error: 'Invalid credentials or inactive account' }, { status: 401 });
        }

        // 2. Compare password
        const isMatch = await comparePassword(password, user.password_hash);
        if (!isMatch) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        // 3. Generate JWT with role
        const token = await generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            fullName: user.full_name
        });

        // 4. Set cookie based on role
        const cookieStore = await cookies();
        const cookieName = user.role === 'admin' ? 'admin_token' : 'officer_token';

        cookieStore.set(cookieName, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return NextResponse.json({
            success: true,
            user: {
                name: user.full_name,
                role: user.role
            }
        });

    } catch (error: any) {
        console.error('Admin Login API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

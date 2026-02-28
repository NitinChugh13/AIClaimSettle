import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { comparePassword, generateToken } from '@/lib/auth';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { mobile, password } = body;

        if (!mobile || !password) {
            return NextResponse.json({ success: false, error: 'Mobile number and password are required' }, { status: 400 });
        }

        // 1. Find user by mobile
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('mobile', mobile)
            .single();

        if (userError || !user) {
            return NextResponse.json({ success: false, error: 'Mobile number not registered' }, { status: 401 });
        }

        // 2. Check if verified
        if (!user.is_mobile_verified) {
            return NextResponse.json({ success: false, error: 'Please verify your mobile first' }, { status: 401 });
        }

        // 3. Compare password hash
        const isPasswordValid = await comparePassword(password, user.password_hash);

        if (!isPasswordValid) {
            // "Invalid password" specific error for demo purposes
            return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
        }

        // 4. Generate JWT
        const tokenPayload = {
            userId: user.id,
            mobile: user.mobile,
            fullName: user.full_name,
            policy_verified: user.policy_verified || false
        };
        const token = await generateToken(tokenPayload, '7d');

        // 5. Save session to DB
        await supabaseAdmin
            .from('sessions')
            .insert([{
                user_id: user.id,
                token_hash: token,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }]);

        // 6. Set HTTP Only cookie
        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        // 7. Return success without password hash
        const { password_hash, ...safeUser } = user;

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            user: safeUser
        });

    } catch (error: any) {
        console.error('Login API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error during login' }, { status: 500 });
    }
}

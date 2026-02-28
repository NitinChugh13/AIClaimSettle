import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { generateToken } from '@/lib/auth';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { mobile, otp_code } = body;

        if (!mobile || !otp_code) {
            return NextResponse.json({ success: false, error: 'Mobile and OTP code are required' }, { status: 400 });
        }

        // 1. Find valid OTP
        const { data: otpRecords, error: otpError } = await supabaseAdmin
            .from('otps')
            .select('*')
            .eq('mobile', mobile)
            .eq('purpose', 'register')
            .eq('is_used', false)
            .gte('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1);

        if (otpError || !otpRecords || otpRecords.length === 0) {
            return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 });
        }

        const otpRecord = otpRecords[0];

        // 2. Check attempts
        if (otpRecord.attempts >= 3) {
            return NextResponse.json({ success: false, error: 'Too many attempts. Please request a new OTP.' }, { status: 400 });
        }

        // 3. Verify the code
        if (otpRecord.otp_code !== otp_code.toString()) {
            // Increment attempts
            await supabaseAdmin
                .from('otps')
                .update({ attempts: otpRecord.attempts + 1 })
                .eq('id', otpRecord.id);

            return NextResponse.json({
                success: false,
                error: `Invalid OTP. ${2 - otpRecord.attempts} attempts remaining.`
            }, { status: 400 });
        }

        // 4. Mark OTP as used
        await supabaseAdmin
            .from('otps')
            .update({ is_used: true })
            .eq('id', otpRecord.id);

        // 5. Update user to verified
        const { data: updatedUser, error: updateError } = await supabaseAdmin
            .from('users')
            .update({ is_mobile_verified: true })
            .eq('mobile', mobile)
            .select('id, full_name, mobile, email')
            .single();

        if (updateError || !updatedUser) {
            console.error('Error verifying user:', updateError);
            return NextResponse.json({ success: false, error: 'Failed to verify user account' }, { status: 500 });
        }

        // 6. Generate JWT Token
        const tokenPayload = {
            userId: updatedUser.id,
            mobile: updatedUser.mobile,
            fullName: updatedUser.full_name,
            policy_verified: false
        };
        const token = await generateToken(tokenPayload, '7d');

        // 7. Save Session in DB (optional tracking)
        await supabaseAdmin
            .from('sessions')
            .insert([{
                user_id: updatedUser.id,
                token_hash: token, // in a real app, hash this token or just store the JTI. We store it directly for simplicity as per requirements.
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }]);

        // 8. Set HTTP Only Cookie
        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        // 9. Return success
        return NextResponse.json({
            success: true,
            message: 'Verification successful',
            user: updatedUser
        });

    } catch (error: any) {
        console.error('Verify OTP API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error during verification' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashPassword, generateOTP } from '@/lib/auth';
import { sendOTP } from '@/lib/fast2sms';

// Initialize Supabase Admin Client using Service Role Key
// This bypasses RLS to allow server-side operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { full_name, mobile, email, password } = body;

        // 1. Validation
        if (!full_name || !mobile || !password) {
            return NextResponse.json({ success: false, error: 'Full name, mobile number, and password are required' }, { status: 400 });
        }
        if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
            return NextResponse.json({ success: false, error: 'Mobile number must be exactly 10 digits' }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ success: false, error: 'Password must be at least 8 characters long' }, { status: 400 });
        }

        // 2. Check if mobile already exists
        const { data: existingUser, error: checkError } = await supabaseAdmin
            .from('users')
            .select('id, is_mobile_verified')
            .eq('mobile', mobile)
            .single();

        if (existingUser) {
            if (existingUser.is_mobile_verified) {
                return NextResponse.json({ success: false, error: 'Mobile number is already registered and verified. Please login.' }, { status: 400 });
            } else {
                return NextResponse.json({ success: false, error: 'Mobile number is already registered but not verified. Please verify your mobile number.' }, { status: 400 });
            }
        }

        // 3. Hash password
        const password_hash = await hashPassword(password);

        // 4. Insert into users table
        const { error: insertError } = await supabaseAdmin
            .from('users')
            .insert([{ full_name, mobile, email, password_hash }])
            .select('id')
            .single();

        if (insertError) {
            console.error('Error inserting user:', insertError);
            return NextResponse.json({ success: false, error: 'Failed to create user account' }, { status: 500 });
        }

        // 5. Generate and save OTP
        const otp_code = generateOTP();
        const expires_at = new Date(Date.now() + 10 * 60000).toISOString(); // 10 minutes from now

        const { error: otpError } = await supabaseAdmin
            .from('otps')
            .insert([{
                mobile,
                otp_code,
                purpose: 'register',
                expires_at
            }]);

        if (otpError) {
            console.error('Error saving OTP:', otpError);
            return NextResponse.json({ success: false, error: 'Failed to generate OTP' }, { status: 500 });
        }

        // 6. Send OTP via Fast2SMS
        const smsResult = await sendOTP(mobile, otp_code);

        if (!smsResult.success) {
            console.error('Failed to send SMS:', smsResult.message);
            // Return success anyway, since the user account is created.
            return NextResponse.json({
                success: true,
                message: 'Account created, but failed to send OTP SMS. Please request a new one.',
                warning: smsResult.message
            });
        }

        // 7. Success response
        return NextResponse.json({ success: true, message: 'OTP sent' });

    } catch (error: any) {
        console.error('Registration API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error during registration' }, { status: 500 });
    }
}

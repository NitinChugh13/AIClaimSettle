import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateOTP } from '@/lib/auth';
import { sendOTP } from '@/lib/fast2sms';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { mobile, purpose } = body;

        if (!mobile || !purpose) {
            return NextResponse.json({ success: false, error: 'Mobile and purpose are required' }, { status: 400 });
        }

        // 1. Validate mobile is a registered user
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('mobile', mobile)
            .single();

        if (userError || !user) {
            return NextResponse.json({ success: false, error: 'Mobile number not registered' }, { status: 404 });
        }

        // 2. Prevent spam (check for unexpired OTPs from the last minute)
        const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
        const { data: recentOtps } = await supabaseAdmin
            .from('otps')
            .select('id')
            .eq('mobile', mobile)
            .eq('purpose', purpose)
            .gte('created_at', oneMinuteAgo)
            .limit(1);

        if (recentOtps && recentOtps.length > 0) {
            return NextResponse.json({ success: false, error: 'Please wait a minute before requesting another OTP' }, { status: 429 });
        }

        // 3. Generate New OTP
        const otp_code = generateOTP();
        const expiresInSeconds = 600; // 10 minutes
        const expires_at = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

        // 4. Save to DB
        const { error: otpError } = await supabaseAdmin
            .from('otps')
            .insert([{
                mobile,
                otp_code,
                purpose,
                expires_at
            }]);

        if (otpError) {
            console.error('Error saving OTP:', otpError);
            return NextResponse.json({ success: false, error: 'Failed to generate OTP' }, { status: 500 });
        }

        // 5. Send via Fast2SMS
        const smsResult = await sendOTP(mobile, otp_code);

        if (!smsResult.success) {
            console.error('Failed to send SMS:', smsResult.message);
            // We tell the client it failed so they can surface this in UI
            return NextResponse.json({
                success: false,
                error: 'Failed to send OTP SMS'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent',
            expires_in: expiresInSeconds
        });

    } catch (error: any) {
        console.error('Send OTP API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error while sending OTP' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { mobile, otp_code, purpose } = body;

        if (!mobile || !otp_code || !purpose) {
            return NextResponse.json({ success: false, error: 'Mobile, OTP code, and purpose are required' }, { status: 400 });
        }

        // 1. Find valid OTP
        const { data: otpRecords, error: otpError } = await supabaseAdmin
            .from('otps')
            .select('*')
            .eq('mobile', mobile)
            .eq('purpose', purpose)
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

        // Optional special handling based on purpose
        // For instance, if purpose='claim', you could save a session state in DB or set a temporary cookie flag here if needed
        // Since we don't have a rigid requirement for claim OTP state storage right now, returning success is sufficient for the client to proceed.

        return NextResponse.json({
            success: true,
            verified: true,
            message: 'OTP verified successfully'
        });

    } catch (error: any) {
        console.error('Verify OTP API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error during OTP verification' }, { status: 500 });
    }
}

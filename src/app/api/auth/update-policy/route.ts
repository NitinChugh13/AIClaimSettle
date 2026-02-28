import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken, generateToken } from '@/lib/auth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
        }

        const body = await request.json();
        const { policy_id, policy_number } = body;

        if (!policy_id || !policy_number) {
            return NextResponse.json({ success: false, error: 'Policy ID and number are required' }, { status: 400 });
        }

        // Update user record
        const { data: updatedUser, error: updateError } = await supabaseAdmin
            .from('users')
            .update({
                policy_id,
                policy_number,
                policy_verified: true
            })
            .eq('id', decoded.userId)
            .select('id, full_name, mobile, email, policy_id, policy_number, policy_verified')
            .single();

        if (updateError || !updatedUser) {
            console.error('Error updating user policy:', updateError);
            return NextResponse.json({ success: false, error: 'Failed to link policy to account' }, { status: 500 });
        }

        // Generate a new JWT with updated policy_verified status
        const tokenPayload = {
            userId: updatedUser.id,
            mobile: updatedUser.mobile,
            fullName: updatedUser.full_name,
            policy_verified: true
        };
        const newToken = await generateToken(tokenPayload, '7d');

        // Update the cookie
        cookieStore.set('auth_token', newToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return NextResponse.json({
            success: true,
            user: updatedUser
        });

    } catch (error: any) {
        console.error('Update Policy API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error while updating policy' }, { status: 500 });
    }
}

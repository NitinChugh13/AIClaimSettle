import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
    try {
        const cookieStore = await cookies();
        const surveyorToken = cookieStore.get('surveyor_token')?.value;
        const officerToken = cookieStore.get('officer_token')?.value;
        const adminToken = cookieStore.get('admin_token')?.value;
        const authToken = cookieStore.get('auth_token')?.value;

        // Token prioritization: Management tokens first, then standard claimant token
        let token = adminToken || officerToken || surveyorToken || authToken;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        // 1. Verify token
        let payload = await verifyToken(token);

        if (!payload || !payload.userId) {
            // If the first token failed, but others exist, try standard authToken as fallback
            if (token !== authToken && authToken) {
                const secondPayload = await verifyToken(authToken);
                if (secondPayload && secondPayload.userId) {
                    token = authToken;
                    payload = secondPayload; // Use the successful fallback payload
                } else {
                    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
                }
            } else {
                return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
            }
        }


        // 2. Fetch fresh user data from DB
        // If it's a management token, they are in admin_users or surveyors
        if (adminToken || officerToken || surveyorToken) {
            // Check admin_users first for Admin/Officer
            if (adminToken || officerToken) {
                const { data: user, error: userError } = await supabaseAdmin
                    .from('admin_users')
                    .select('id, full_name, email, role, is_active')
                    .eq('id', payload.userId)
                    .single();

                if (!userError && user) {
                    return NextResponse.json({
                        success: true,
                        user: {
                            id: user.id,
                            full_name: user.full_name,
                            email: user.email,
                            role: user.role
                        }
                    });
                }
            }

            // Check surveyors table for Surveyor
            const { data: surveyor, error: sError } = await supabaseAdmin
                .from('surveyors')
                .select('id, full_name, mobile, email, license_number')
                .eq('id', payload.userId)
                .single();

            if (!sError && surveyor) {
                return NextResponse.json({
                    success: true,
                    user: {
                        id: surveyor.id,
                        full_name: surveyor.full_name,
                        email: surveyor.email,
                        mobile: surveyor.mobile,
                        license_number: surveyor.license_number,
                        role: 'surveyor'
                    }
                });
            }

            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // Standard claimant user
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('id, full_name, mobile, email, is_mobile_verified, policy_id, policy_verified, created_at')
            .eq('id', payload.userId)
            .single();

        if (userError) {
            console.error('User Fetch Error:', userError);
            return NextResponse.json({ success: false, error: 'User not found or connection error' }, { status: userError.code === 'PGRST116' ? 404 : 500 });
        }

        return NextResponse.json({
            success: true,
            user
        });

    } catch (error: any) {
        console.error('Get Me API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error fetching user profile' }, { status: 500 });
    }
}

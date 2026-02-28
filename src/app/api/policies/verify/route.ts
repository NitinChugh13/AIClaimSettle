import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { policy_number, vehicle_number } = body;

        if (!policy_number || !vehicle_number) {
            return NextResponse.json({ success: false, error: 'Policy number and vehicle number are required' }, { status: 400 });
        }

        // 1. Fetch policy by number
        const { data: policy, error: policyError } = await supabaseAdmin
            .from('policies')
            .select('*')
            .eq('policy_number', policy_number.toUpperCase())
            .single();

        if (policyError || !policy) {
            return NextResponse.json({ success: false, error: 'Policy not found' }, { status: 404 });
        }

        // 2. Validate Vehicle Number (case-insensitive)
        if (policy.vehicle_number.toUpperCase() !== vehicle_number.toUpperCase()) {
            return NextResponse.json({ success: false, error: 'Vehicle number does not match' }, { status: 400 });
        }

        // 3. Check if active
        if (!policy.is_active) {
            return NextResponse.json({ success: false, error: 'Policy is inactive' }, { status: 400 });
        }

        // 4. Check expiration
        const today = new Date();
        const expiryDate = new Date(policy.policy_end_date);

        if (expiryDate < today) {
            return NextResponse.json({ success: false, error: 'Policy has expired' }, { status: 400 });
        }

        // 5. Return success and policy data
        return NextResponse.json({
            success: true,
            policy
        });

    } catch (error: any) {
        console.error('Policy Verification API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error during policy verification' }, { status: 500 });
    }
}

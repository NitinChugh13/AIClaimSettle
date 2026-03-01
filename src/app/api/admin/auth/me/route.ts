import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        const officerToken = cookieStore.get('officer_token')?.value;
        const surveyorToken = cookieStore.get('surveyor_token')?.value;

        const token = adminToken || officerToken || surveyorToken;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: decoded.userId,
                email: decoded.email,
                role: decoded.role,
                name: decoded.fullName
            }
        });

    } catch (error: any) {
        console.error('Admin Me API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

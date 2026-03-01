import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('officer_token');
        cookieStore.delete('surveyor_token');

        return NextResponse.json({ success: true, message: 'Logged out successfully' });
    } catch (error: any) {
        console.error('Officer Logout API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Clear all possible auth cookies
        const tokens = ['auth_token', 'officer_token', 'admin_token', 'surveyor_token'];

        tokens.forEach(tokenName => {
            cookieStore.set(tokenName, '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 0,
            });
        });

        return NextResponse.json({ success: true, message: 'Logged out successfully from all sessions' });
    } catch (error: any) {
        console.error('Logout API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error during logout' }, { status: 500 });
    }
}

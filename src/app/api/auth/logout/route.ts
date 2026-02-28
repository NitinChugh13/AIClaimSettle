import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Clear the auth cookie by setting maxAge to 0
        cookieStore.set('auth_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
        });

        // We could also optionally find and delete the session in Supabase DB here
        // if we decoded the JWT to get the user ID, but simply clearing the cookie 
        // effectively logs the user out from this device.

        return NextResponse.json({ success: true, message: 'Logged out successfully' });
    } catch (error: any) {
        console.error('Logout API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error during logout' }, { status: 500 });
    }
}

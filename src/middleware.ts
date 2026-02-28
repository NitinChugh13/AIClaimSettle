import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

// Define the secret used for JWT verification
// Ensure it matches the one used during token generation
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_purposes_only';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define protected routes
    const protectedRoutes = [
        '/dashboard',
        '/claim/new',
        '/onboarding'
    ];

    // Check if the current route is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
        // Read auth token from cookies
        const authToken = request.cookies.get('auth_token')?.value;

        if (!authToken) {
            // No token found, redirect to login
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        try {
            // Verify token using jose (Edge-compatible)
            await jose.jwtVerify(authToken, secret);

            // Token is valid, let them proceed
            return NextResponse.next();
        } catch (error) {
            console.error('Middleware JWT Verification Failed:', error);
            // Invalid or expired token, redirect to login
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            // Clear the invalid cookie
            const response = NextResponse.redirect(url);
            response.cookies.set('auth_token', '', { maxAge: 0 });
            return response;
        }
    }

    // All other routes are allowed to proceed without auth
    return NextResponse.next();
}

/**
 * Configure which paths the middleware should run on.
 * We include the protected routes and exclude static files/images to save execution time.
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes can handle their own auth checks)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public images (.png, .jpg, .jpeg, .svg, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};

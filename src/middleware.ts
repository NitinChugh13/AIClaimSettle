import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

// Define the secret used for JWT verification
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_purposes_only';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // --- ADMIN / OFFICER PROTECTION ---
    const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
    const isOfficerRoute = pathname.startsWith('/officer') && !pathname.startsWith('/officer/login');
    const isSurveyorRoute = pathname.startsWith('/surveyor') && !pathname.startsWith('/surveyor/login');

    if (isAdminRoute || isOfficerRoute || isSurveyorRoute) {
        const adminToken = request.cookies.get('admin_token')?.value;
        const officerToken = request.cookies.get('officer_token')?.value;
        const surveyorToken = request.cookies.get('surveyor_token')?.value;

        // Determine which token to use
        let token = null;
        if (isAdminRoute) token = adminToken;
        else if (isOfficerRoute) token = officerToken || adminToken; // Admins can access officer routes
        else if (isSurveyorRoute) token = surveyorToken || adminToken; // Admins can access surveyor routes

        if (!token) {
            const url = request.nextUrl.clone();
            if (isAdminRoute) url.pathname = '/admin/login';
            else if (isOfficerRoute) url.pathname = '/officer/login';
            else url.pathname = '/surveyor/login';
            return NextResponse.redirect(url);
        }

        try {
            const { payload } = await jose.jwtVerify(token, secret);
            const role = payload.role as string;

            if (isAdminRoute && role !== 'admin') {
                const url = request.nextUrl.clone();
                url.pathname = '/admin/login';
                const response = NextResponse.redirect(url);
                response.cookies.set('admin_token', '', { maxAge: 0 });
                return response;
            }

            if (isOfficerRoute && role !== 'officer' && role !== 'admin') {
                const url = request.nextUrl.clone();
                url.pathname = '/officer/login';
                const response = NextResponse.redirect(url);
                response.cookies.set('officer_token', '', { maxAge: 0 });
                return response;
            }

            if (isSurveyorRoute && role !== 'surveyor' && role !== 'admin') {
                const url = request.nextUrl.clone();
                url.pathname = '/surveyor/login';
                const response = NextResponse.redirect(url);
                response.cookies.set('surveyor_token', '', { maxAge: 0 });
                return response;
            }

            return NextResponse.next();
        } catch (error) {
            const url = request.nextUrl.clone();
            if (isAdminRoute) url.pathname = '/admin/login';
            else if (isOfficerRoute) url.pathname = '/officer/login';
            else url.pathname = '/surveyor/login';
            const response = NextResponse.redirect(url);

            // Clear the relevant token
            if (isAdminRoute) response.cookies.set('admin_token', '', { maxAge: 0 });
            else if (isOfficerRoute) response.cookies.set('officer_token', '', { maxAge: 0 });
            else response.cookies.set('surveyor_token', '', { maxAge: 0 });

            return response;
        }
    }

    // Define protected routes for regular users
    const protectedRoutes = [
        '/dashboard',
        '/claim/new',
        '/onboarding'
    ];

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
            const { payload } = await jose.jwtVerify(authToken, secret);
            const isPolicyVerified = payload.policy_verified === true;

            // Step F logic: Redirect based on policy verification status
            if (!isPolicyVerified && pathname !== '/onboarding') {
                // Logged in but no policy linked, redirect to onboarding
                const url = request.nextUrl.clone();
                url.pathname = '/onboarding';
                return NextResponse.redirect(url);
            }

            if (isPolicyVerified && pathname === '/onboarding') {
                // Policy already linked, onboarding no longer needed
                const url = request.nextUrl.clone();
                url.pathname = '/dashboard';
                return NextResponse.redirect(url);
            }

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

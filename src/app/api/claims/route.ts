import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json(
        { error: 'Deprecated. This route is no longer supported.' },
        { status: 410 }
    );
}

export async function POST() {
    return NextResponse.json(
        { error: 'Deprecated. Use /api/claims/submit for registration or /api/claims/[id]/status for updates.' },
        { status: 410 }
    );
}

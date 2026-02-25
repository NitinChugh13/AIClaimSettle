import { NextResponse } from 'next/server';
import { db } from '@/db';
import { claims } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const policy = searchParams.get('policy');

    if (!policy) {
        return NextResponse.json({ error: 'Policy number required' }, { status: 400 });
    }

    try {
        const history = await db.query.claims.findMany({
            where: eq(claims.policyNumber, policy),
            orderBy: [desc(claims.createdAt)],
        });

        return NextResponse.json(history);
    } catch (error) {
        console.error('Error fetching claim history:', error);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}

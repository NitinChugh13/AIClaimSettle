import { NextResponse } from 'next/server';
import { db } from '@/db';
import { claims } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const claim = await db.query.claims.findFirst({
            where: eq(claims.id, id),
            with: {
                damageItems: true,
            },
        });

        if (!claim) {
            return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
        }

        return NextResponse.json(claim);
    } catch (error) {
        console.error('Error fetching claim:', error);
        return NextResponse.json({ error: 'Failed to fetch claim' }, { status: 500 });
    }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const { status, note, bankDetails, settlementId } = await request.json();

        // 1. Fetch current claim and policy info for notification
        const currentClaim = await db.query.claims.findFirst({
            where: eq(claims.id, id),
        });

        if (!currentClaim) {
            return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
        }

        // 2. Perform Update
        await db.update(claims)
            .set({
                status: status || currentClaim.status,
                bankDetails: bankDetails || currentClaim.bankDetails,
                settlementId: settlementId || currentClaim.settlementId,
            })
            .where(eq(claims.id, id));

        // 3. Trigger notification if status changed
        if (status && status !== currentClaim.status) {
            const { notifyClaimStatusChange } = await import('@/lib/notifications');
            await notifyClaimStatusChange(id, status, currentClaim.holderName);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating claim:', error);
        return NextResponse.json({ error: 'Failed to update claim' }, { status: 500 });
    }
}

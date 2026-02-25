import { NextResponse } from 'next/server';
import { db } from '@/db';
import { claims, damageItems } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { verifyVehicleWithVahan } from '@/lib/vahan';

export async function GET() {
    try {
        // Fetch all claims with their damage items
        const allClaims = await db.query.claims.findMany({
            orderBy: [desc(claims.createdAt)],
            with: {
                damageItems: true,
            },
        });

        return NextResponse.json(allClaims);
    } catch (error) {
        console.error('Error fetching claims:', error);
        return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { formData, analysis } = data;

        const claimId = formData.claimNumber || `CLM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

        // Production Logic: Real-time VAHAN vehicle verification
        const vahanData = await verifyVehicleWithVahan(formData.policy.vehicle_registration);

        // Enrich vehicle model from VAHAN if available
        const vehicleModel = vahanData
            ? `${vahanData.model} (${vahanData.registrationDate})`
            : `${formData.policy.vehicle_make} ${formData.policy.vehicle_model} ${formData.policy.vehicle_year}`;

        // Insert main claim
        await db.insert(claims).values({
            id: claimId,
            policyNumber: formData.policy.policy_number,
            vehicleReg: formData.policy.vehicle_registration,
            holderName: vahanData?.ownerName || formData.policy.holder_name,
            vehicleModel: vehicleModel,
            incidentType: formData.incidentType,
            incidentLocation: formData.incidentLocation,
            incidentDescription: formData.incidentDescription,
            incidentDate: formData.incidentDate,
            totalAmount: analysis.total_estimate.final_claim_amount,
            confidenceScore: Math.round(analysis.confidence_score),
            fraudScore: analysis.fraud_indicators.length > 0 ? 50 : 10, // simplified map
            flags: analysis.fraud_indicators.map((f: any) => f.type),
            status: 'pending', // All claims must be manually approved by an officer, even if AI recommends auto-approval
        }).onConflictDoNothing(); // Prevent duplicate submissions

        // Insert damage items
        if (analysis.damage_items && analysis.damage_items.length > 0) {
            const damageValues = analysis.damage_items.map((item: any) => ({
                id: uuidv4(),
                claimId,
                partName: item.part_name,
                partLocation: item.part_location,
                severity: item.damage_severity,
                action: item.ai_recommendation,
                confidence: Math.round(item.confidence),
                oemPrice: item.oem_price,
                laborCost: item.labor_cost,
                depreciationRate: item.depreciation_rate,
                depreciationAmount: item.depreciation_amount,
                netSubtotal: item.subtotal_net,
            }));

            await db.insert(damageItems).values(damageValues).onConflictDoNothing();
        }

        return NextResponse.json({ success: true, claimId });
    } catch (error) {
        console.error('Error creating claim:', error);
        return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 });
    }
}

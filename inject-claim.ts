import { db } from './src/db';
import { claims, damageItems } from './src/db/schema';
import { v4 as uuidv4 } from 'uuid';

async function inject() {
    const claimId = `CLM-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    // Insert claim
    await db.insert(claims).values({
        id: claimId,
        policyNumber: 'POL-111222',
        vehicleReg: 'MH-01-AB-1234',
        holderName: 'Automated Test User',
        vehicleModel: 'Maruti Suzuki Swift (2021)',
        incidentType: 'Collision',
        incidentLocation: 'Mumbai, Maharashtra',
        incidentDescription: 'Browser Subagent automated test collision simulation.',
        incidentDate: '2026-02-25',
        totalAmount: 18500,
        confidenceScore: 92,
        fraudScore: 12,
        flags: [],
        status: 'pending', // Testing the new manual review requirement
    }).onConflictDoNothing();

    // Insert damage item
    await db.insert(damageItems).values({
        id: uuidv4(),
        claimId: claimId,
        partName: 'Front Bumper',
        partLocation: 'front',
        severity: 'moderate',
        action: 'replace',
        confidence: 94,
        oemPrice: 12000,
        laborCost: 2000,
        depreciationRate: 10,
        depreciationAmount: 1200,
        netSubtotal: 12800,
    }).onConflictDoNothing();

    console.log(`Successfully injected test claim: ${claimId} for policy: POL-111222`);
    process.exit(0);
}

inject().catch(console.error);

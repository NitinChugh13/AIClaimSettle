import type { AIAnalysisResult, Policy } from '@/types';
import { getVehicleAgeMonths, getCityTier, getLaborRate, getCompulsoryDeductible, getDepreciationRate } from '@/lib/pricing/depreciation';

export function generateMockAnalysis(policy: Policy, incidentLocation: string = 'Mumbai'): AIAnalysisResult {
    const ageMonths = getVehicleAgeMonths(policy.vehicle_year);
    const tier = getCityTier(incidentLocation);
    const laborRate = getLaborRate(tier);
    const vehicleType = (policy.vehicle_type as any) === 'two_wheeler' ? 'two_wheeler' :
        (policy.vehicle_type as any) === 'commercial' ? 'commercial' : 'car';
    const deductible = getCompulsoryDeductible(vehicleType, (policy as any).engine_cc || 1200);

    const depRate = policy.zero_depreciation ? 0 : getDepreciationRate('standard', ageMonths);
    const plasticDepRate = policy.zero_depreciation ? 0 : getDepreciationRate('rubber_plastic', ageMonths);

    const damages = [
        {
            part_name: 'Front Bumper Assembly',
            part_location: 'front',
            damage_type: 'crack' as const,
            damage_severity: 'moderate' as const,
            ai_recommendation: 'replace' as const,
            confidence: 92.4,
            oem_price: 4500,
            aftermarket_price: 1800,
            labor_hours: 2.5,
            labor_cost: Math.round(2.5 * laborRate),
            painting_cost: 1200,
            subtotal_gross: 4500 + Math.round(2.5 * laborRate) + 1200,
            depreciation_rate: plasticDepRate,
            depreciation_amount: Math.round((4500 * plasticDepRate) / 100),
            subtotal_net: 4500 + Math.round(2.5 * laborRate) + 1200 - Math.round((4500 * plasticDepRate) / 100),
            photo_evidence: ['front_view'],
        },
        {
            part_name: 'Left Headlamp',
            part_location: 'front',
            damage_type: 'shatter' as const,
            damage_severity: 'severe' as const,
            ai_recommendation: 'replace' as const,
            confidence: 96.1,
            oem_price: 3800,
            aftermarket_price: 1500,
            labor_hours: 1,
            labor_cost: Math.round(1 * laborRate),
            painting_cost: 0,
            subtotal_gross: 3800 + Math.round(1 * laborRate),
            depreciation_rate: depRate,
            depreciation_amount: Math.round((3800 * depRate) / 100),
            subtotal_net: 3800 + Math.round(1 * laborRate) - Math.round((3800 * depRate) / 100),
            photo_evidence: ['front_view', 'close_up_left'],
        },
        {
            part_name: 'Hood / Bonnet',
            part_location: 'front',
            damage_type: 'dent' as const,
            damage_severity: 'minor' as const,
            ai_recommendation: 'repair' as const,
            confidence: 81.2,
            oem_price: 0,
            aftermarket_price: 0,
            labor_hours: 3.5,
            labor_cost: Math.round(3.5 * laborRate),
            painting_cost: 1500,
            subtotal_gross: Math.round(3.5 * laborRate) + 1500,
            depreciation_rate: depRate,
            depreciation_amount: Math.round((Math.round(3.5 * laborRate) * depRate) / 100),
            subtotal_net: Math.round(3.5 * laborRate) + 1500 - Math.round((Math.round(3.5 * laborRate) * depRate) / 100),
            photo_evidence: ['front_view'],
        },
    ];

    const grossRepairCost = damages.reduce((sum, d) => sum + d.subtotal_gross, 0);
    const totalDepreciation = damages.reduce((sum, d) => sum + d.depreciation_amount, 0);
    const netRepairCost = grossRepairCost - totalDepreciation;
    const finalClaimAmount = Math.max(0, netRepairCost - deductible);
    const withinLimit = finalClaimAmount <= 30000;

    // Simulate some randomness for demo realism
    const fraudScore = 5 + Math.floor(Math.random() * 10);
    const confidence = 85 + Math.floor(Math.random() * 10);

    // Logic for recommendation
    let recommendation: AIAnalysisResult['recommendation'] = 'manual_review';
    if (finalClaimAmount > 30000) recommendation = 'escalate';
    else if (confidence >= 80 && fraudScore < 15) recommendation = 'auto_approve';

    return {
        damage_items: damages,
        total_estimate: {
            gross_repair_cost: grossRepairCost,
            total_depreciation: totalDepreciation,
            net_repair_cost: netRepairCost,
            compulsory_deductible: deductible,
            final_claim_amount: finalClaimAmount,
            within_limit: withinLimit,
            limit_check: `₹${finalClaimAmount.toLocaleString('en-IN')} ${withinLimit ? '< ₹30,000 ✅' : '> ₹30,000 ⚠️'}`,
        },
        fraud_indicators: fraudScore > 12
            ? [{ type: 'inconsistent_damage', description: 'Rust suggests some damage may pre-date the reported incident date.', severity: 'low', confidence: 45 }]
            : [],
        confidence_score: confidence,
        recommendation,
        recommendation_reason: recommendation === 'auto_approve'
            ? 'High confidence assessment. Repair costs are within standard tolerances and fraud risk is low. Eligible for instant settlement.'
            : 'Assessment requires human verified oversight due to complex damage patterns or policy limit proximities.',
        processing_time_ms: 2500 + Math.floor(Math.random() * 1000), // Simulate network delay
    };
}

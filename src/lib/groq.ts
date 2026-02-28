import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function analyzeClaimWithGroq(
    claimData: {
        incident_type: string;
        incident_description: string;
        estimated_repair_cost: number;
        document_urls: string[];
    },
    policy: {
        vehicle_year: number;
        vehicle_make: string;
        vehicle_model: string;
        vehicle_type: string;
        idv_value: number;
        policy_type: string;
        zero_depreciation: boolean;
        depreciation_rate: number;
        ncb_percentage: number;
        own_damage_cover: boolean;
        personal_accident_cover: boolean;
    }
) {
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - policy.vehicle_year;

    const prompt = `
You are an IRDA-certified motor insurance claim assessor in India. Analyze this claim and provide a fair, detailed assessment in a structured format.

POLICY DETAILS:
- Vehicle: ${policy.vehicle_year} ${policy.vehicle_make} ${policy.vehicle_model} (${policy.vehicle_type})
- IDV: ₹${policy.idv_value.toLocaleString('en-IN')}
- Zero Depreciation Add-on: ${policy.zero_depreciation ? 'YES' : 'NO'}
- Depreciation Rate: ${policy.depreciation_rate}%
- NCB: ${policy.ncb_percentage}%
- Own Damage Cover: ${policy.own_damage_cover ? 'YES' : 'NO'}

CLAIM DETAILS:
- Incident Type: ${claimData.incident_type}
- Description: ${claimData.incident_description}
- Claimant Estimate: ₹${claimData.estimated_repair_cost.toLocaleString('en-IN')}
- Documents: ${claimData.document_urls.length} files

CALCULATION RULES:
1. If Zero Depreciation = YES: 0% depreciation on parts.
2. If Zero Depreciation = NO: Apply ${policy.depreciation_rate}% depreciation.
3. NCB is forfeited.
4. Final amount <= IDV of ₹${policy.idv_value.toLocaleString('en-IN')}.
5. Compulsory Deductible: ₹1,000 (standard).

Respond ONLY with valid JSON following this EXACT structure:
{
  "damage_items": [
    {
      "part_name": "string",
      "part_location": "string",
      "damage_type": "dent" | "scratch" | "shatter",
      "damage_severity": "minor" | "moderate" | "severe",
      "ai_recommendation": "repair" | "replace",
      "confidence": number (0-100),
      "oem_price": number,
      "aftermarket_price": number,
      "labor_hours": number,
      "labor_cost": number,
      "painting_cost": number,
      "subtotal_gross": number,
      "depreciation_rate": number,
      "depreciation_amount": number,
      "subtotal_net": number
    }
  ],
  "total_estimate": {
    "gross_repair_cost": number,
    "total_depreciation": number,
    "net_repair_cost": number,
    "compulsory_deductible": 1000,
    "final_claim_amount": number,
    "within_limit": boolean,
    "limit_check": "string"
  },
  "fraud_indicators": [
    { "type": "string", "description": "string", "severity": "low" | "medium" | "high", "confidence": number }
  ],
  "confidence_score": number,
  "recommendation": "auto_approve" | "manual_review" | "reject",
  "recommendation_reason": "string",
  "processing_time_ms": 0
}`;

    const startTime = Date.now();
    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 2000,
    });

    const endTime = Date.now();
    const content = response.choices[0].message.content || '';

    try {
        const clean = content.replace(/```json|```/g, '').trim();
        const json = JSON.parse(clean);
        json.processing_time_ms = endTime - startTime;
        return json;
    } catch (e) {
        console.error('Failed to parse Groq response:', content);
        throw new Error('Neural Engine returned malformed assessment node.');
    }
}

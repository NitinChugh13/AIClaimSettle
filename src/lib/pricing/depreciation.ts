// IRDAI Motor Tariff Depreciation Calculator

export type PartCategory = 'rubber_plastic' | 'fiberglass' | 'standard'

export function getDepreciationRate(
    partCategory: PartCategory,
    ageMonths: number
): number {
    if (partCategory === 'rubber_plastic') return 50
    if (partCategory === 'fiberglass') return 30

    // Standard parts (metal, glass, etc.)
    if (ageMonths <= 6) return 5
    if (ageMonths <= 12) return 15
    if (ageMonths <= 24) return 20
    if (ageMonths <= 36) return 25
    if (ageMonths <= 48) return 35
    if (ageMonths <= 60) return 40
    return 50
}

export function getVehicleAgeMonths(vehicleYear: number): number {
    const now = new Date()
    const registrationYear = vehicleYear
    const totalMonths =
        (now.getFullYear() - registrationYear) * 12 + now.getMonth()
    return Math.max(0, totalMonths)
}

export type CityTier = 'tier1' | 'tier2' | 'tier3'

// City tier mapping
const TIER1_CITIES = [
    'mumbai', 'delhi', 'bangalore', 'bengaluru', 'chennai',
    'hyderabad', 'pune', 'kolkata'
]
const TIER2_CITIES = [
    'ahmedabad', 'jaipur', 'lucknow', 'chandigarh', 'kochi',
    'indore', 'nagpur', 'patna', 'bhubaneswar', 'visakhapatnam'
]

export function getCityTier(city: string): CityTier {
    const normalized = city.toLowerCase().trim()
    if (TIER1_CITIES.some(c => normalized.includes(c))) return 'tier1'
    if (TIER2_CITIES.some(c => normalized.includes(c))) return 'tier2'
    return 'tier3'
}

export function getLaborRate(tier: CityTier): number {
    switch (tier) {
        case 'tier1': return 700  // ₹700/hr midpoint
        case 'tier2': return 500
        case 'tier3': return 325
    }
}

export function getPaintingRate(tier: CityTier): number {
    switch (tier) {
        case 'tier1': return 140  // per sqft
        case 'tier2': return 100
        case 'tier3': return 70
    }
}

// IRDAI Compulsory deductible
export function getCompulsoryDeductible(
    vehicleType: 'car' | 'two_wheeler' | 'commercial',
    engineCc?: number
): number {
    if (vehicleType === 'two_wheeler') return 100
    if (vehicleType === 'car') {
        return (engineCc && engineCc >= 1500) ? 2000 : 1000
    }
    return 2000 // commercial
}

export interface ClaimCalculationInput {
    grossRepairCost: number
    totalDepreciation: number
    compulsoryDeductible: number
    voluntaryDeductible?: number
    zeroDep?: boolean
}

export function calculateFinalPayable(input: ClaimCalculationInput): {
    netRepairCost: number
    finalPayable: number
} {
    const netRepairCost = input.zeroDep
        ? input.grossRepairCost
        : input.grossRepairCost - input.totalDepreciation

    const finalPayable = Math.max(
        0,
        netRepairCost -
        input.compulsoryDeductible -
        (input.voluntaryDeductible ?? 0)
    )

    return { netRepairCost, finalPayable }
}

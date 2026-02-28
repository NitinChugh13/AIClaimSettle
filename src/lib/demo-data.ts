// Mock claim store using in-memory data (used for Phase 1 + demo)
// In production, this is replaced by Supabase tables

import type { Policy, Claim, ClaimPhoto, DamageItem } from '@/types'

// Demo policies for testing
export const DEMO_POLICIES: Policy[] = [
    {
        id: '1',
        policy_number: 'SecureShield Insurance/2024/MH/001234',
        holder_name: 'Rahul Sharma',
        holder_phone: '9876543210',
        holder_email: 'rahul@example.com',
        vehicle_number: 'MH02AB1234',
        vehicle_make: 'Maruti Suzuki',
        vehicle_model: 'Swift',
        vehicle_variant: 'VXI',
        vehicle_year: 2021,
        vehicle_type: 'car',
        fuel_type: 'petrol',
        idv_value: 450000,
        policy_start_date: '2024-04-01',
        policy_end_date: '2025-03-31',
        ncb_percentage: 20,
        zero_depreciation: false,
        depreciation_rate: 15,
        insurer_name: 'SecureShield Insurance',
        own_damage_cover: true,
        third_party_cover: true,
        personal_accident_cover: true,
        roadside_assistance: false,
        status: 'active',
        created_at: new Date().toISOString(),
    },
    {
        id: '2',
        policy_number: 'PrimeCover General/2024/DL/005678',
        holder_name: 'Priya Patel',
        holder_phone: '9123456789',
        holder_email: 'priya@example.com',
        vehicle_number: 'DL8CAF5678',
        vehicle_make: 'Hyundai',
        vehicle_model: 'i20',
        vehicle_variant: 'Sportz',
        vehicle_year: 2022,
        vehicle_type: 'car',
        fuel_type: 'petrol',
        idv_value: 680000,
        policy_start_date: '2025-01-01',
        policy_end_date: '2025-12-31',
        ncb_percentage: 0,
        zero_depreciation: true,
        depreciation_rate: 0,
        insurer_name: 'PrimeCover General',
        own_damage_cover: true,
        third_party_cover: true,
        personal_accident_cover: true,
        roadside_assistance: true,
        status: 'active',
        created_at: new Date().toISOString(),
    },
]

export function findPolicy(policyNumber: string, vehicleReg: string): Policy | null {
    return (
        DEMO_POLICIES.find(
            (p) =>
                p.policy_number.toLowerCase() === policyNumber.toLowerCase() &&
                p.vehicle_number.toLowerCase() === vehicleReg.toLowerCase()
        ) ?? null
    )
}

export function generateClaimNumber(): string {
    const year = new Date().getFullYear()
    const random = Math.floor(10000000 + Math.random() * 90000000)
    return `CLM-${year}-${random}`
}

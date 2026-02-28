// TypeScript types for the claim system

export type VehicleType = 'car' | 'two_wheeler' | 'commercial'
export type FuelType = 'petrol' | 'diesel' | 'cng' | 'ev'
export type PolicyStatus = 'active' | 'expired' | 'suspended'

export interface Policy {
  id: string
  policy_number: string
  holder_name: string
  holder_phone: string
  holder_email?: string
  vehicle_number: string
  vehicle_make: string
  vehicle_model: string
  vehicle_variant?: string
  vehicle_year: number
  vehicle_type: string
  fuel_type?: FuelType
  engine_number?: string
  chassis_number?: string
  idv_value: number
  policy_start_date: string
  policy_end_date: string
  ncb_percentage: number
  zero_depreciation: boolean
  depreciation_rate: number
  insurer_name: string
  own_damage_cover: boolean
  third_party_cover: boolean
  personal_accident_cover: boolean
  roadside_assistance: boolean
  status: PolicyStatus
  created_at: string
}

export type ClaimStatus =
  | 'draft'
  | 'submitted'
  | 'ai_processing'
  | 'ai_complete'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'settled'
  | 'escalated'

export type IncidentType =
  | 'accident'
  | 'flood'
  | 'fire'
  | 'theft'
  | 'vandalism'
  | 'hail'
  | 'other'

export type AIRecommendation =
  | 'auto_approve'
  | 'manual_review'
  | 'reject'
  | 'escalate'

export interface Claim {
  user_id: string
  policy_id: string
  incident_date: string
  incident_time?: string
  incident_location: string
  incident_type: string
  incident_description: string
  fir_number?: string
  status: string
  estimated_repair_cost: number
  ai_approved_amount?: number
  ai_depreciation_applied?: number
  ai_ncb_deduction?: number
  ai_final_amount?: number
  ai_reasoning?: string
  ai_confidence?: string
  ai_damaged_parts?: string[]
  ai_recommendation?: string
  surveyor_amount?: number
  final_approved_amount?: number
  created_at: string
  updated_at: string
  policy?: Policy
  documents?: ClaimPhoto[]
}

export type PhotoType =
  | 'front'
  | 'rear'
  | 'left_side'
  | 'right_side'
  | 'damage_closeup'
  | 'interior'
  | 'odometer'
  | 'rc_book'
  | 'driving_license'
  | 'insurance_policy'
  | 'spot_photo'
  | 'other'

export interface ClaimPhoto {
  id: string
  claim_id: string
  photo_url: string
  photo_type: PhotoType
  original_filename?: string
  file_size_kb?: number
  exif_datetime?: string
  exif_gps_lat?: number
  exif_gps_lng?: number
  exif_device_model?: string
  is_metadata_tampered: boolean
  ai_photo_quality_score?: number
  ai_photo_valid?: boolean
  ai_detected_issues?: string
  upload_order: number
  uploaded_at: string
}

export type DamageType = 'dent' | 'scratch' | 'crack' | 'shatter' | 'deform' | 'missing' | 'burn' | 'flood'
export type DamageSeverity = 'minor' | 'moderate' | 'severe' | 'total'

export interface DamageItem {
  id: string
  claim_id: string
  part_name: string
  part_code?: string
  part_location: string
  damage_type: DamageType
  damage_severity: DamageSeverity
  ai_recommendation: 'repair' | 'replace' | 'supplement'
  ai_confidence: number
  oem_part_price?: number
  local_part_price?: number
  repair_labor_hours?: number
  labor_rate_per_hour?: number
  painting_cost?: number
  depreciation_rate: number
  depreciation_amount: number
  item_gross_amount: number
  item_net_amount: number
  notes?: string
}

export interface AIAnalysisResult {
  damage_items: AIDamageItem[]
  total_estimate: {
    gross_repair_cost: number
    total_depreciation: number
    net_repair_cost: number
    compulsory_deductible: number
    final_claim_amount: number
    within_limit: boolean
    limit_check: string
  }
  fraud_indicators: {
    type: string
    description: string
    severity: 'low' | 'medium' | 'high'
    confidence: number
  }[]
  confidence_score: number
  recommendation: AIRecommendation
  recommendation_reason: string
  processing_time_ms: number
}

export interface AIDamageItem {
  part_name: string
  part_location: string
  damage_type: DamageType
  damage_severity: DamageSeverity
  ai_recommendation: 'repair' | 'replace' | 'supplement'
  confidence: number
  oem_price: number
  aftermarket_price: number
  labor_hours: number
  labor_cost: number
  painting_cost: number
  subtotal_gross: number
  depreciation_rate: number
  depreciation_amount: number
  subtotal_net: number
  photo_evidence: string[]
}

export type CityTier = 'tier1' | 'tier2' | 'tier3'

export interface UploadedPhoto {
  file: File
  preview: string
  type: PhotoType
  exif?: {
    datetime?: Date
    gps_lat?: number
    gps_lng?: number
    device_model?: string
    software?: string
  }
  quality_score?: number
  quality_feedback?: string
  base64?: string
}

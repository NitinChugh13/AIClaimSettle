// Multi-layer fraud detection
// Layer 1: EXIF metadata analysis
// Layer 2: Cross-claim database checks  
// Layer 3: Policy validation flags

export interface FraudCheck {
    type: string
    description: string
    severity: 'low' | 'medium' | 'high'
    confidence: number
    score_impact: number // how much this adds to overall fraud score
}

export interface FraudAnalysisResult {
    overall_score: number // 0-100, higher = more suspicious
    risk_level: 'low' | 'medium' | 'high'
    flags: FraudCheck[]
    passed: boolean // passed = score < 25
}

export interface ExifData {
    datetime?: Date
    gps_lat?: number
    gps_lng?: number
    software?: string
    device_model?: string
    device_make?: string
}

export function analyzeExifMetadata(
    exifData: ExifData | null,
    incidentDate: string,
    incidentLat?: number,
    incidentLng?: number
): FraudCheck[] {
    const flags: FraudCheck[] = []

    if (!exifData) {
        flags.push({
            type: 'missing_exif',
            description: 'Photo lacks EXIF metadata — could be a screenshot or edited image',
            severity: 'medium',
            confidence: 70,
            score_impact: 20,
        })
        return flags
    }

    // Check 1: Photo timestamp vs incident date
    if (exifData.datetime) {
        const photoDate = new Date(exifData.datetime)
        const incDate = new Date(incidentDate)
        const diffHours = Math.abs(photoDate.getTime() - incDate.getTime()) / (1000 * 60 * 60)

        if (diffHours > 72) {
            flags.push({
                type: 'timestamp_mismatch',
                description: `Photo taken ${Math.round(diffHours / 24)} days ${diffHours > 72 ? 'before or after' : 'after'} declared incident date`,
                severity: diffHours > 168 ? 'high' : 'medium',
                confidence: 90,
                score_impact: diffHours > 168 ? 40 : 25,
            })
        }
    }

    // Check 2: GPS location
    if (exifData.gps_lat && exifData.gps_lng && incidentLat && incidentLng) {
        const distKm = haversineDistance(
            exifData.gps_lat, exifData.gps_lng,
            incidentLat, incidentLng
        )
        if (distKm > 50) {
            flags.push({
                type: 'gps_mismatch',
                description: `Photo GPS location is ${Math.round(distKm)}km from declared incident location`,
                severity: distKm > 200 ? 'high' : 'medium',
                confidence: 95,
                score_impact: distKm > 200 ? 50 : 30,
            })
        }
    }

    // Check 3: Editing software detected
    if (exifData.software) {
        const editingSoftware = ['photoshop', 'lightroom', 'snapseed', 'pixelmator', 'picsart', 'facetune']
        const detected = editingSoftware.find(s => exifData.software!.toLowerCase().includes(s))
        if (detected) {
            flags.push({
                type: 'photo_manipulation',
                description: `Photo was processed with editing software: ${exifData.software}`,
                severity: 'high',
                confidence: 85,
                score_impact: 45,
            })
        }
    }

    return flags
}

export function calculateFraudScore(flags: FraudCheck[]): FraudAnalysisResult {
    const totalScore = Math.min(100, flags.reduce((sum, f) => sum + f.score_impact, 0))

    return {
        overall_score: totalScore,
        risk_level: totalScore < 25 ? 'low' : totalScore < 60 ? 'medium' : 'high',
        flags,
        passed: totalScore < 25,
    }
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth radius in km
    const dLat = deg2rad(lat2 - lat1)
    const dLng = deg2rad(lng2 - lng1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
}

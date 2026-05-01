import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '@/lib/auth'
import { executeClaimsAgent } from '@/lib/agent/agent-executor'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const { claimId } = await req.json()
    if (!claimId) {
      return NextResponse.json({ error: 'claimId required' }, { status: 400 })
    }

    const { data: claim } = await supabase
      .from('claims')
      .select('*, policy:policies(*)')
      .eq('id', claimId)
      .single()

    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }
    const { count: previousClaimsCount } = await supabase
    .from('claims')
    .select('*', { count: 'exact', head: true })
    .eq('policy_id', claim.policy_id)
    .neq('id', claimId)  // exclude current claim
    .in('status', ['approved', 'settled', 'ai_complete'])
    
    const context: Record<string, unknown> = {
      vehicle_make: claim.policy?.vehicle_make || 'Unknown',
      vehicle_model: claim.policy?.vehicle_model || 'Unknown',
      vehicle_year: claim.policy?.vehicle_year || 2020,
      vehicle_type: claim.policy?.vehicle_type || 'car',
      incident_type: claim.incident_type || 'accident',
      incident_location: claim.incident_location || 'Unknown',
      incident_date: claim.incident_date || new Date().toISOString().split('T')[0],
      estimated_repair_cost: claim.estimated_repair_cost || 0,
      idv_value: claim.policy?.idv_value || 500000,
      ncb_percentage: claim.policy?.ncb_percentage || 0,
      zero_depreciation: claim.policy?.zero_depreciation || false,
      depreciation_rate: claim.policy?.depreciation_rate || 15,
      previous_claims: previousClaimsCount || 0,
      ai_damaged_parts: claim.ai_damaged_parts || [],
      ai_approved_amount: claim.ai_approved_amount || 0,
      ai_confidence: claim.ai_confidence || 75,
      fraud_score: claim.fraud_score || 15,
      flags: claim.flags || []
    }

    console.log('[AGENT] Starting agent for claim:', claimId)
    const result = await executeClaimsAgent(claimId, context)
    console.log('[AGENT] Completed in', result.durationMs, 'ms with', result.totalIterations, 'iterations')

    return NextResponse.json({
      success: true,
      agentRun: result,
      claimId
    })

  } catch (error) {
    console.error('[AGENT] Fatal error:', error)
    return NextResponse.json({ error: 'Agent analysis failed' }, { status: 500 })
  }
}
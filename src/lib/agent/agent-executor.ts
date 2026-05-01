import Groq from 'groq-sdk'
import { AgentConfig } from '@/config/agent-config'
const cfg = AgentConfig.agent
const s = AgentConfig.settlement

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY_2 || process.env.GROQ_API_KEY })

export interface AgentStep {
  iteration: number
  thought: string
  action: string
  observation: string
  durationMs: number
}

export interface AgentResult {
  steps: AgentStep[]
  finalDecision: {
    recommendation: string
    amount: number
    confidence: number
    fraudScore: number
    reasoning: string
  }
  totalIterations: number
  durationMs: number
}

const SYSTEM_PROMPT = `You are ClaimNova, an intelligent motor insurance claims processing agent for India.

You process claims step by step using tools. Think carefully before each action.

AVAILABLE TOOLS:
1. analyze_damage - Reviews the damage assessment from AI vision analysis
2. check_fraud - Evaluates fraud signals and risk score  
3. calculate_settlement - Computes final IRDAI-compliant settlement amount
4. lookup_history - Checks previous claims on this policy

RESPONSE FORMAT (use EXACTLY this every time):
THOUGHT: [your reasoning about what to do next and why]
ACTION: [tool name]
ACTION_INPUT: [JSON object]

When ready to decide, use:
THOUGHT: [your complete final reasoning]
FINAL_ANSWER: {"recommendation":"auto_approve","amount":0,"confidence":0,"fraudScore":0,"reasoning":"explanation"}

DECISION RULES:
- Always call analyze_damage FIRST
- Always call check_fraud SECOND  
- fraud score > ${cfg.rules.highFraudThreshold}: FINAL_ANSWER with escalate
- fraud score ${cfg.rules.mediumFraudThreshold}-${cfg.rules.highFraudThreshold}: FINAL_ANSWER with manual_review
- fraud score < ${cfg.rules.mediumFraudThreshold} AND amount <= ${s.autoApprovalLimit}: FINAL_ANSWER with auto_approve
- fraud score < ${cfg.rules.mediumFraudThreshold} AND amount > ${s.autoApprovalLimit}: FINAL_ANSWER with manual_review
- Never exceed ${cfg.maxIterations} iterations`

function runTool(toolName: string, context: Record<string, unknown>): string {
  if (toolName === 'analyze_damage') {
    const parts = (context.ai_damaged_parts as string[]) || ['Front Bumper']
    const amount = (context.ai_approved_amount as number) || 0
    const confidence = Number(context.ai_confidence) || 75
    return JSON.stringify({
      success: true,
      damaged_parts: parts,
      total_parts_count: parts.length,
      estimated_gross_cost: amount,
      confidence_score: confidence,
      severity_breakdown: {
        minor: parts.length > 2 ? 1 : 0,
        moderate: Math.min(parts.length, 2),
        severe: parts.length > 3 ? 1 : 0
      }
    })
  }

  if (toolName === 'check_fraud') {
    const fraudScore = (context.fraud_score as number) || 15
    const flags = (context.flags as string[]) || []
    return JSON.stringify({
      success: true,
      fraud_score: fraudScore,
      risk_level: fraudScore < 30 ? 'low' : fraudScore < 70 ? 'medium' : 'high',
      passed: fraudScore < 70,
      flags_detected: flags,
      checks_performed: [
        'EXIF metadata validation',
        'GPS location verification', 
        'Timestamp consistency check',
        'Image manipulation detection',
        'Claim history cross-reference'
      ]
    })
  }

  if (toolName === 'calculate_settlement') {
    const gross = (context.ai_approved_amount as number) || 0
    const ncb = (context.ncb_percentage as number) || 0
    const zeroDep = (context.zero_depreciation as boolean) || false
    const deductible = 1000
    const depreciationAmount = zeroDep ? 0 : Math.round(gross * (context.depreciation_rate as number || 15) / 100)
    const afterDep = gross - depreciationAmount
    const afterNcb = Math.round(afterDep * (1 - ncb / 100))
    const final = Math.max(0, afterNcb - deductible)
    return JSON.stringify({
      success: true,
      gross_repair_cost: gross,
      depreciation_applied: depreciationAmount,
      zero_depreciation_addon: zeroDep,
      ncb_deduction: Math.round(afterDep * ncb / 100),
      compulsory_deductible: deductible,
      final_settlement_amount: final,
      within_idv: final <= (context.idv_value as number || 500000)
    })
  }

  if (toolName === 'lookup_history') {
    return JSON.stringify({
      success: true,
      previous_claims_count: Number(context.previous_claims) || 0,
      total_claimed_amount: 0,
      last_claim_date: null,
      risk_flag: false
    })
  }

  return JSON.stringify({ error: `Unknown tool: ${toolName}` })
}

function parseResponse(text: string): {
  thought: string
  action?: string
  actionInput?: Record<string, unknown>
  finalAnswer?: {
    recommendation: string
    amount: number
    confidence: number
    fraudScore: number
    reasoning: string
  }
} {
  const thoughtMatch = text.match(/THOUGHT:\s*([\s\S]+?)(?=ACTION:|FINAL_ANSWER:|$)/i)
  const actionMatch = text.match(/ACTION:\s*(\w+)/i)
  const inputMatch = text.match(/ACTION_INPUT:\s*(\{[\s\S]+?\})/i)
  const finalMatch = text.match(/FINAL_ANSWER:\s*(\{[\s\S]+?\})/i)

  const thought = thoughtMatch?.[1]?.trim() || text.trim()
  if (finalMatch) {
    try {
      const parsed = JSON.parse(finalMatch[1])
      const rawConfidence = Number(parsed.confidence) || 50
      return {
        thought,
        finalAnswer: {
          recommendation: parsed.recommendation || 'manual_review',
          amount: Number(parsed.amount) || 0,
          confidence: rawConfidence < 1 ? rawConfidence * 100 : rawConfidence,
          fraudScore: Number(parsed.fraudScore) || 50,
          reasoning: parsed.reasoning || thought
        }
      }
    } catch {
      return {
        thought,
        finalAnswer: {
          recommendation: 'manual_review',
          amount: 0,
          confidence: 50,
          fraudScore: 50,
          reasoning: thought
        }
      }
    }
  }

  let actionInput: Record<string, unknown> = {}
  if (inputMatch) {
    try { actionInput = JSON.parse(inputMatch[1]) } catch { /* ignore */ }
  }

  return {
    thought,
    action: actionMatch?.[1]?.toLowerCase(),
    actionInput
  }
}

export async function executeClaimsAgent(
  claimId: string,
  context: Record<string, unknown>
): Promise<AgentResult> {
  const startTime = Date.now()
  const steps: AgentStep[] = []

  const messages: { role: 'user' | 'assistant'; content: string }[] = []

  const goal = `Process insurance claim for ${context.vehicle_make} ${context.vehicle_model} (${context.vehicle_year}).
Incident: ${context.incident_type} at ${context.incident_location} on ${context.incident_date}.
Claimant estimated cost: ₹${context.estimated_repair_cost?.toLocaleString()}.
Policy IDV: ₹${context.idv_value?.toLocaleString()}.
Zero Depreciation: ${context.zero_depreciation ? 'YES' : 'NO'}.
NCB: ${context.ncb_percentage}%.
Analyze this claim and make a settlement decision.`

  messages.push({ role: 'user', content: goal })

  let finalDecision = {
    recommendation: 'manual_review',
    amount: (context.ai_approved_amount as number) || 0,
    confidence: 50,
    fraudScore: 50,
    reasoning: 'Agent analysis incomplete — defaulting to manual review'
  }

  for (let i = 0; i < 5; i++) {
    const iterStart = Date.now()

    // Rate limit protection
    if (i > 0) await new Promise(r => setTimeout(r, AgentConfig.agent.iterationDelayMs))

    try {
      const recentMessages = messages.slice(-4)

      const response = await groq.chat.completions.create({
        model: AgentConfig.models.agent,
       
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...recentMessages
        ],
        max_tokens: AgentConfig.agent.maxTokensPerCall,
        temperature: AgentConfig.agent.temperature

      })

      const text = response.choices[0]?.message?.content || ''
      const parsed = parseResponse(text)

      if (parsed.finalAnswer) {
        steps.push({
          iteration: i + 1,
          thought: parsed.thought,
          action: 'FINAL_DECISION',
          observation: `Decision: ${parsed.finalAnswer.recommendation} | Amount: ₹${parsed.finalAnswer.amount.toLocaleString()} | Confidence: ${parsed.finalAnswer.confidence}%`,
          durationMs: Date.now() - iterStart
        })
        finalDecision = parsed.finalAnswer
        break
      }

      if (parsed.action) {
        const toolResult = runTool(parsed.action, context)
        const toolResultParsed = JSON.parse(toolResult)

        let observationSummary = ''
          if (parsed.action === 'analyze_damage') {          
  observationSummary = `Found ${toolResultParsed.total_parts_count} damaged parts: ${toolResultParsed.damaged_parts.join(', ')}. Estimated cost: ₹${toolResultParsed.estimated_gross_cost?.toLocaleString()}. Confidence: ${toolResultParsed.confidence_score}%`
          }           else           if (parsed.action === 'check_fraud') {          
  observationSummary = `Fraud score: ${toolResultParsed.fraud_score}/100. Risk level: ${toolResultParsed.risk_level?.toUpperCase()}. ${toolResultParsed.flags_detected?.length || 0} flags detected.`
       }           else           if (parsed.action === 'calculate_settlement') {
            observationSummary = `Final settlement: ₹${toolResultParsed.final_settlement_amount?.toLocaleString()}. Gross: ₹${toolResultParsed.gross_repair_cost?.toLocaleString()}. Depreciation: ₹${toolResultParsed.depreciation_applied?.toLocaleString()}. Deductible: ₹${toolResultParsed.compulsory_deductible?.toLocaleString()}.`
          }           else           if (parsed.action === 'lookup_history') {
  const prevClaims = toolResultParsed.previous_claims_count ?? 0
  observationSummary = `Previous claims: ${prevClaims}. History risk flag: ${toolResultParsed.risk_flag ? 'YES' : 'NO'}.`
        }           else {
  observationSummary = toolResult
          }

        steps.push({
          iteration: i + 1,
          thought: parsed.thought,
          action: parsed.action,
          observation: observationSummary,
          durationMs: Date.now() - iterStart
        })

        messages.push({ role: 'assistant', content: text })
        messages.push({
          role: 'user',
          content: `OBSERVATION: ${observationSummary}\n\nContinue with next step.`
        })
      }
      // If this is the last iteration and no final answer yet, force one
if (i === 4 && !parsed.finalAnswer) {
  const fraudScore = (context.fraud_score as number) || 15
  const amount = (context.ai_approved_amount as number) || 0
  const recommendation = fraudScore > AgentConfig.agent.rules.highFraudThreshold 
  ? 'escalate' 
  : amount <= AgentConfig.settlement.autoApprovalLimit 
    ? 'auto_approve' 
    : 'manual_review'
  finalDecision = {
    recommendation,
    amount,
    confidence: Number(context.ai_confidence) || 75,
    fraudScore,
    reasoning: `Based on fraud score ${fraudScore}/100 and estimated amount ₹${amount.toLocaleString()}`
  }
  steps.push({
    iteration: i + 1,
    thought: 'Completing analysis with available data',
    action: 'FINAL_DECISION',
    observation: `Decision: ${recommendation} | Amount: ₹${amount.toLocaleString()} | Confidence: ${finalDecision.confidence}%`,
    durationMs: 0
  })
}

    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error(`[AGENT] Iteration ${i + 1} failed:`, errMsg)
      steps.push({
        iteration: i + 1,
        thought: 'Error occurred during processing',
        action: 'ERROR',
        observation: errMsg,
        durationMs: Date.now() - iterStart
      })
      break
    }

    
  
}

  return {
    steps,
    finalDecision,
    totalIterations: steps.length,
    durationMs: Date.now() - startTime
  }
}
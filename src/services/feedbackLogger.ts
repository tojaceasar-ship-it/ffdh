/**
 * Feedback Loop Logger
 * Tracks decision outcomes and scores effectiveness for autopilot learning
 */

import { supabase } from '@/lib/supabase'

export interface DecisionLog {
  id?: string
  decision_id: string
  decision_type: string
  outcome: 'success' | 'partial' | 'failure'
  effectiveness_score: number // 0-100
  metrics?: Record<string, any>
  notes?: string
  created_at?: string
}

/**
 * Log a decision outcome
 */
export async function logDecision(
  decisionId: string,
  decisionType: string,
  outcome: 'success' | 'partial' | 'failure',
  effectivenessScore: number,
  metrics?: Record<string, any>,
  notes?: string
): Promise<DecisionLog | null> {
  try {
    const log: Omit<DecisionLog, 'id' | 'created_at'> = {
      decision_id: decisionId,
      decision_type: decisionType,
      outcome,
      effectiveness_score: Math.max(0, Math.min(100, effectivenessScore)),
      metrics: metrics || {},
      notes,
    }

    const { data, error } = await supabase.from('decision_logs').insert([log]).select().single()

    if (error) {
      console.error('Error logging decision:', error)
      return null
    }

    return data as DecisionLog
  } catch (error) {
    console.error('Error in logDecision:', error)
    return null
  }
}

/**
 * Get decision effectiveness history
 */
export async function getDecisionHistory(
  decisionType?: string,
  limit: number = 50
): Promise<DecisionLog[]> {
  try {
    let query = supabase.from('decision_logs').select('*').order('created_at', { ascending: false })

    if (decisionType) {
      query = query.eq('decision_type', decisionType)
    }

    const { data, error } = await query.limit(limit)

    if (error) {
      console.error('Error fetching decision history:', error)
      return []
    }

    return (data as DecisionLog[]) || []
  } catch (error) {
    console.error('Error in getDecisionHistory:', error)
    return []
  }
}

/**
 * Calculate average effectiveness for a decision type
 */
export async function getAverageEffectiveness(decisionType: string): Promise<number | null> {
  try {
    const history = await getDecisionHistory(decisionType, 100)

    if (history.length === 0) {
      return null
    }

    const sum = history.reduce((acc, log) => acc + log.effectiveness_score, 0)
    return Math.round((sum / history.length) * 100) / 100
  } catch (error) {
    console.error('Error calculating average effectiveness:', error)
    return null
  }
}

/**
 * Get top performing decisions
 */
export async function getTopDecisions(limit: number = 10): Promise<DecisionLog[]> {
  try {
    const { data, error } = await supabase
      .from('decision_logs')
      .select('*')
      .order('effectiveness_score', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching top decisions:', error)
      return []
    }

    return (data as DecisionLog[]) || []
  } catch (error) {
    console.error('Error in getTopDecisions:', error)
    return []
  }
}

/**
 * Score decision effectiveness based on metrics
 */
export function scoreDecision(
  outcome: 'success' | 'partial' | 'failure',
  metrics?: {
    responseTime?: number // ms
    errorRate?: number // 0-1
    userSatisfaction?: number // 0-1
    costEfficiency?: number // 0-1
  }
): number {
  let score = 0

  // Base score from outcome
  switch (outcome) {
    case 'success':
      score = 80
      break
    case 'partial':
      score = 50
      break
    case 'failure':
      score = 20
      break
  }

  // Adjust based on metrics
  if (metrics) {
    if (metrics.responseTime !== undefined) {
      // Faster is better (target: <2000ms = +10, >5000ms = -10)
      if (metrics.responseTime < 2000) score += 10
      else if (metrics.responseTime > 5000) score -= 10
    }

    if (metrics.errorRate !== undefined) {
      // Lower error rate is better (target: <0.01 = +5, >0.1 = -10)
      if (metrics.errorRate < 0.01) score += 5
      else if (metrics.errorRate > 0.1) score -= 10
    }

    if (metrics.userSatisfaction !== undefined) {
      // Higher satisfaction is better
      score += metrics.userSatisfaction * 10
    }

    if (metrics.costEfficiency !== undefined) {
      // Higher efficiency is better
      score += metrics.costEfficiency * 5
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

export const feedbackLogger = {
  logDecision,
  getDecisionHistory,
  getAverageEffectiveness,
  getTopDecisions,
  scoreDecision,
}


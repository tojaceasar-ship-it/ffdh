'use client'

import { useState, useCallback } from 'react'
import { MoodKey } from '@/config/moodVariants'

export interface EmotionAnalysisResult {
  mood: MoodKey
  confidence: number
  sentiment: 'positive' | 'negative' | 'neutral'
  detectedEmotions: string[]
}

/**
 * Hook do analizy emocji w tekście przez AI
 * Wysyła komentarz użytkownika do /api/ai/emotion
 */
export function useAIEmotion() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeText = useCallback(
    async (text: string): Promise<EmotionAnalysisResult | null> => {
      if (!text.trim()) {
        return null
      }

      setIsAnalyzing(true)
      setError(null)

      try {
        const response = await fetch('/api/ai/emotion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          throw new Error(errorData.error || `HTTP ${response.status}`)
        }

        const data = await response.json()
        return data.result as EmotionAnalysisResult
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to analyze emotion'
        setError(message)
        console.error('AI emotion analysis error:', err)
        return null
      } finally {
        setIsAnalyzing(false)
      }
    },
    []
  )

  return {
    analyzeText,
    isAnalyzing,
    error,
  }
}


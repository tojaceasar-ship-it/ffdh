import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { analyzeEmotion } from '@/services/aiService'
import { MoodKey, mapEmotionToMood } from '@/config/moodVariants'

const emotionRequestSchema = z.object({
  text: z.string().min(1).max(2000),
})

/**
 * POST /api/ai/emotion
 * Analizuje tekst użytkownika i zwraca wykryty nastrój z intensywnością
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = emotionRequestSchema.parse(body)

    // Użyj istniejącego analyzeEmotion z aiService
    const analysis = await analyzeEmotion(text)

    // Mapuj wynik na MoodKey
    const mood: MoodKey = mapEmotionToMood(analysis.emotion)

    // Pobierz dodatkowe emocje jeśli dostępne
    const detectedEmotions: string[] = [analysis.emotion]
    if (analysis.sentiment !== 'neutral') {
      detectedEmotions.push(analysis.sentiment)
    }

    return NextResponse.json({
      success: true,
      result: {
        mood,
        confidence: analysis.confidence,
        sentiment: analysis.sentiment,
        detectedEmotions,
      },
    })
  } catch (error) {
    console.error('Emotion analysis API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}


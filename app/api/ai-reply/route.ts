import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse } from '@/services/aiService'
import { z } from 'zod'
import { feedbackLogger } from '@/services/feedbackLogger'

const aiReplyRequestSchema = z.object({
  comment: z.string().min(2).max(500),
  sceneTitle: z.string(),
  sceneSlug: z.string().optional(),
  emotion: z.string().optional(),
})

/**
 * POST /api/ai-reply
 * Generate AI response to user comment with enhanced prompt context
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const { comment, sceneTitle, sceneSlug, emotion } = aiReplyRequestSchema.parse(body)

    // Generate AI response with prompt context
    const aiResponse = await generateAIResponse(comment, sceneTitle, emotion, sceneSlug)

    const responseTime = Date.now() - startTime

    // Log decision outcome for feedback loop
    const effectivenessScore = feedbackLogger.scoreDecision('success', {
      responseTime,
      userSatisfaction: 0.8, // Placeholder - would come from user feedback
    })

    await feedbackLogger.logDecision(
      `ai-reply-${Date.now()}`,
      'ai-response-generation',
      'success',
      effectivenessScore,
      {
        responseTime,
        sceneSlug,
        emotion,
        responseLength: aiResponse.text.length,
      },
      `AI response generated in ${responseTime}ms`
    )

    return NextResponse.json({
      success: true,
      response: aiResponse,
      metrics: {
        responseTime,
      },
    })
  } catch (error) {
    const responseTime = Date.now() - startTime

    if (error instanceof z.ZodError) {
      // Log validation error
      await feedbackLogger.logDecision(
        `ai-reply-error-${Date.now()}`,
        'ai-response-generation',
        'failure',
        0,
        { responseTime, errors: error.errors },
        'Validation error in AI reply request'
      )

      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body',
          errors: error.errors,
        },
        { status: 400 }
      )
    }

    console.error('Error generating AI reply:', error)

    // Log failure
    await feedbackLogger.logDecision(
      `ai-reply-error-${Date.now()}`,
      'ai-response-generation',
      'failure',
      10,
      { responseTime },
      `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    )

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate AI response',
      },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { moderateContent, analyzeEmotion } from '@/services/aiService'
import { z } from 'zod'
import { feedbackLogger } from '@/services/feedbackLogger'

const commentRequestSchema = z.object({
  scene_id: z.string().uuid(),
  user_id: z.string().uuid(),
  content: z.string().min(2).max(500),
  emotion: z.string().optional(),
})

/**
 * GET /api/comments
 * Fetch comments for a scene
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sceneId = searchParams.get('scene_id')

    if (!sceneId) {
      return NextResponse.json(
        {
          success: false,
          message: 'scene_id is required',
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('scene_id', sceneId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch comments',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      comments: data || [],
    })
  } catch (error) {
    console.error('Error in GET /api/comments:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/comments
 * Create a new comment with moderation and emotion analysis
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const { scene_id, user_id, content, emotion } = commentRequestSchema.parse(body)

    // Moderate content
    const moderation = await moderateContent(content)

    if (moderation.isToxic) {
      // Log toxic content detection
      await feedbackLogger.logDecision(
        `comment-moderation-${Date.now()}`,
        'content-moderation',
        'success',
        90,
        { confidence: moderation.confidence },
        'Toxic content detected and rejected'
      )

      return NextResponse.json(
        {
          success: false,
          message: 'Comment contains inappropriate content',
          moderated: true,
        },
        { status: 400 }
      )
    }

    // Analyze emotion if not provided
    let detectedEmotion = emotion
    if (!detectedEmotion) {
      const emotionAnalysis = await analyzeEmotion(content)
      detectedEmotion = emotionAnalysis.emotion
    }

    // Insert comment
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          scene_id,
          author_id: user_id,
          content,
          emotion: detectedEmotion,
          is_toxic: false,
          toxicity_score: moderation.confidence,
          is_moderated: true,
          is_approved: true, // Auto-approve if not toxic
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create comment',
        },
        { status: 500 }
      )
    }

    // Update scene comment count
    await supabase.rpc('update_scene_comment_count', { scene_id })

    const responseTime = Date.now() - startTime

    // Log successful comment creation
    await feedbackLogger.logDecision(
      `comment-created-${Date.now()}`,
      'comment-creation',
      'success',
      feedbackLogger.scoreDecision('success', {
        responseTime,
        errorRate: 0,
      }),
      {
        responseTime,
        emotion: detectedEmotion,
      },
      'Comment created successfully'
    )

    return NextResponse.json({
      success: true,
      comment: data,
      emotion: detectedEmotion,
    })
  } catch (error) {
    const responseTime = Date.now() - startTime

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body',
          errors: error.errors,
        },
        { status: 400 }
      )
    }

    console.error('Error in POST /api/comments:', error)

    // Log failure
    await feedbackLogger.logDecision(
      `comment-error-${Date.now()}`,
      'comment-creation',
      'failure',
      20,
      { responseTime },
      `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    )

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}


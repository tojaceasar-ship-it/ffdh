import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { moderateContent, analyzeEmotion } from '@/services/aiService'
import { z } from 'zod'
import { feedbackLogger } from '@/services/feedbackLogger'
import { createApiResponse, createApiError, createValidationError, createNotFoundError } from '@/utils/api-response'

const commentRequestSchema = z.object({
  scene_id: z.string().optional(), // Can be UUID or slug
  sceneSlug: z.string().optional(), // Alternative: slug
  user_id: z.string().uuid().optional(), // Optional for anonymous comments
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
    let sceneId = searchParams.get('scene_id')
    const sceneSlug = searchParams.get('scene_slug')

    if (!sceneId && sceneSlug) {
      const { data: sceneRow, error: sceneError } = await supabase
        .from('scenes')
        .select('id')
        .eq('slug', sceneSlug)
        .maybeSingle()

      if (sceneError) {
        console.error('Failed to resolve scene slug to id', sceneError)
      }

      if (sceneRow?.id) {
        sceneId = sceneRow.id
      }
    }

    if (!sceneId) {
      return NextResponse.json(
        createApiError('scene_id or scene_slug is required', 'MISSING_PARAMETER'),
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
        createApiError('Failed to fetch comments', 'FETCH_ERROR'),
        { status: 500 }
      )
    }

    return NextResponse.json(createApiResponse(data || [], 'Comments fetched successfully'))
  } catch (error) {
    console.error('Error in GET /api/comments:', error)
    return NextResponse.json(
      createApiError('Internal server error', 'INTERNAL_ERROR'),
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
    const { scene_id, sceneSlug, user_id, content, emotion } = commentRequestSchema.parse(body)

    // Resolve scene_id from slug if needed
    let resolvedSceneId = scene_id
    if (!resolvedSceneId && sceneSlug) {
      // Get scene by slug to get UUID
      const { data: sceneData } = await supabase
        .from('scenes')
        .select('id')
        .eq('slug', sceneSlug)
        .single()
      
      if (!sceneData) {
        return NextResponse.json(createNotFoundError('Scene'), { status: 404 })
      }
      resolvedSceneId = sceneData.id
    }

    if (!resolvedSceneId) {
      return NextResponse.json(
        createApiError('scene_id or sceneSlug is required', 'MISSING_PARAMETER'),
        { status: 400 }
      )
    }

    // For anonymous comments, use a placeholder user_id
    const resolvedUserId = user_id || '00000000-0000-0000-0000-000000000000'

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
        createApiError('Comment contains inappropriate content', 'CONTENT_MODERATION', { moderated: true }),
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
          scene_id: resolvedSceneId,
          author_id: resolvedUserId,
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
        createApiError('Failed to create comment', 'CREATE_ERROR'),
        { status: 500 }
      )
    }

    // Update scene comment count
    await supabase.rpc('update_scene_comment_count', { scene_id: resolvedSceneId })

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

    return NextResponse.json(
      createApiResponse({ comment: data, emotion: detectedEmotion }, 'Comment created successfully')
    )
  } catch (error) {
    const responseTime = Date.now() - startTime

    if (error instanceof z.ZodError) {
      return NextResponse.json(createValidationError(error.errors), { status: 400 })
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
      createApiError('Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}


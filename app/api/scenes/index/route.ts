import { NextRequest, NextResponse } from 'next/server'
import { sceneIndexer } from '@/services/sceneIndexer'
import { z } from 'zod'

const syncRequestSchema = z.object({
  sanityId: z.string().optional(),
  syncAll: z.boolean().optional().default(false),
})

/**
 * POST /api/scenes/index
 * Sync scenes from Sanity to Supabase
 */
export async function POST(request: NextRequest) {
  try {
    // Verify request (could add auth check here)
    const body = await request.json()
    const { sanityId, syncAll } = syncRequestSchema.parse(body)

    if (syncAll) {
      // Sync all scenes
      const result = await sceneIndexer.syncAllScenes()
      return NextResponse.json({
        success: true,
        message: `Synced ${result.success} scenes, ${result.failed} failed`,
        result,
      })
    }

    if (sanityId) {
      // Sync single scene
      const scene = await sceneIndexer.syncSceneById(sanityId)
      if (scene) {
        return NextResponse.json({
          success: true,
          message: 'Scene synced successfully',
          scene,
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to sync scene',
          },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Either sanityId or syncAll must be provided',
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in /api/scenes/index:', error)
    
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
 * GET /api/scenes/index
 * Get indexed scenes from Supabase
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const emotionTags = searchParams.get('emotionTags')?.split(',').filter(Boolean)

    const scenes = await sceneIndexer.getIndexedScenes({
      limit,
      offset,
      emotionTags,
    })

    return NextResponse.json({
      success: true,
      scenes,
      count: scenes.length,
    })
  } catch (error) {
    console.error('Error fetching indexed scenes:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}


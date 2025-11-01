/**
 * Scene Indexer Service
 * Syncs scenes from Sanity CMS to Supabase for Rewir AI functionality
 */

import { sanityFetch, QUERIES } from '@/lib/sanity'
import { supabase } from '@/lib/supabase'
import { analyzeEmotion } from './aiService'

export interface SanityScene {
  _id: string
  _type: string
  slug?: { current: string }
  title?: string
  name?: string
  description?: string
  narrative?: string
  image?: any
  tags?: string[]
  emotionTags?: string[]
  character?: { _ref?: string }
  _createdAt?: string
  _updatedAt?: string
}

export interface IndexedScene {
  id?: string
  sanity_id: string
  slug: string
  title: string
  name?: string
  description?: string
  narrative?: string
  image_url?: string
  emotion_tags?: string[]
  tags?: string[]
  character_id?: string
  view_count?: number
  comment_count?: number
  last_synced_at?: string
}

/**
 * Extract emotion tags from scene content using AI analysis
 */
async function extractEmotionTags(scene: SanityScene): Promise<string[]> {
  const emotionTags = scene.emotionTags || []
  
  // If already tagged, return them
  if (emotionTags.length > 0) {
    return emotionTags
  }

  // Otherwise, analyze description/narrative for emotions
  const textToAnalyze = scene.narrative || scene.description || scene.title || ''
  if (!textToAnalyze) {
    return []
  }

  try {
    const analysis = await analyzeEmotion(textToAnalyze)
    
    // Map AI-detected emotion to emotion tags
    const detectedEmotion = analysis.emotion.toLowerCase()
    const validEmotionTags = [
      'joy', 'sadness', 'anger', 'love', 'fear', 'surprise', 'peace', 'nostalgia',
      'contemplation', 'empowerment', 'chaos', 'hope', 'dreamy', 'introspection'
    ]
    
    if (validEmotionTags.includes(detectedEmotion)) {
      return [detectedEmotion, ...emotionTags].filter(Boolean)
    }
    
    // Fallback to sentiment-based tags
    if (analysis.sentiment === 'positive') {
      return ['joy', 'hope', ...emotionTags].filter(Boolean)
    } else if (analysis.sentiment === 'negative') {
      return ['sadness', 'contemplation', ...emotionTags].filter(Boolean)
    }
    
    return emotionTags
  } catch (error) {
    console.error('Error extracting emotion tags:', error)
    return emotionTags
  }
}

/**
 * Transform Sanity image to URL
 */
function getImageUrl(image: any): string | undefined {
  if (!image) return undefined
  
  // Handle Sanity image reference
  if (image.asset?._ref) {
    // Will be processed by urlFor() helper in components
    return image.asset._ref
  }
  
  if (typeof image === 'string') {
    return image
  }
  
  return undefined
}

/**
 * Index a single scene from Sanity to Supabase
 */
export async function indexScene(sanityScene: SanityScene): Promise<IndexedScene | null> {
  try {
    const slug = sanityScene.slug?.current || sanityScene._id
    if (!slug) {
      console.error('Scene missing slug:', sanityScene._id)
      return null
    }

    const title = sanityScene.title || sanityScene.name || 'Untitled Scene'
    const emotionTags = await extractEmotionTags(sanityScene)
    
    const indexedScene: IndexedScene = {
      sanity_id: sanityScene._id,
      slug,
      title,
      name: sanityScene.name,
      description: sanityScene.description,
      narrative: sanityScene.narrative,
      image_url: getImageUrl(sanityScene.image),
      emotion_tags: emotionTags,
      tags: sanityScene.tags,
      last_synced_at: new Date().toISOString(),
    }

    // Upsert to Supabase
    const { data, error } = await supabase
      .from('scenes')
      .upsert(
        {
          sanity_id: sanityScene._id,
          slug,
          title,
          name: sanityScene.name || title,
          description: sanityScene.description,
          narrative: sanityScene.narrative,
          image_url: indexedScene.image_url,
          emotion_tags: emotionTags,
          tags: sanityScene.tags || [],
          last_synced_at: indexedScene.last_synced_at,
        },
        {
          onConflict: 'sanity_id',
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Error indexing scene:', error)
      return null
    }

    return { ...indexedScene, id: data?.id }
  } catch (error) {
    console.error('Error in indexScene:', error)
    return null
  }
}

/**
 * Sync all scenes from Sanity to Supabase
 */
export async function syncAllScenes(): Promise<{ success: number; failed: number }> {
  try {
    const sanityScenes = await sanityFetch<SanityScene[]>({
      query: QUERIES.allScenes,
    })

    if (!sanityScenes || sanityScenes.length === 0) {
      console.warn('No scenes found in Sanity')
      return { success: 0, failed: 0 }
    }

    let success = 0
    let failed = 0

    for (const scene of sanityScenes) {
      const result = await indexScene(scene)
      if (result) {
        success++
      } else {
        failed++
      }
    }

    console.log(`Scene sync complete: ${success} successful, ${failed} failed`)
    return { success, failed }
  } catch (error) {
    console.error('Error syncing scenes:', error)
    return { success: 0, failed: 0 }
  }
}

/**
 * Sync a single scene by Sanity ID
 */
export async function syncSceneById(sanityId: string): Promise<IndexedScene | null> {
  try {
    const scene = await sanityFetch<SanityScene>({
      query: QUERIES.sceneBySlug,
      params: { slug: sanityId },
    })

    if (!scene) {
      // Try fetching by _id directly
      const sceneById = await sanityFetch<SanityScene>({
        query: `*[_type == "scene" && _id == $id][0]`,
        params: { id: sanityId },
      })

      if (!sceneById) {
        console.error('Scene not found in Sanity:', sanityId)
        return null
      }

      return await indexScene(sceneById)
    }

    return await indexScene(scene)
  } catch (error) {
    console.error('Error syncing scene by ID:', error)
    return null
  }
}

/**
 * Get all indexed scenes from Supabase
 */
export async function getIndexedScenes(options?: {
  limit?: number
  offset?: number
  emotionTags?: string[]
}): Promise<IndexedScene[]> {
  try {
    let query = supabase
      .from('scenes')
      .select('*')
      .order('created_at', { ascending: false })

    if (options?.emotionTags && options.emotionTags.length > 0) {
      query = query.contains('emotion_tags', options.emotionTags)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching indexed scenes:', error)
      return []
    }

    return (data as IndexedScene[]) || []
  } catch (error) {
    console.error('Error in getIndexedScenes:', error)
    return []
  }
}

/**
 * Increment view count for a scene
 */
export async function incrementSceneView(slug: string): Promise<void> {
  try {
    await supabase.rpc('increment_scene_view_count', { scene_slug: slug })
  } catch (error) {
    console.error('Error incrementing scene view:', error)
  }
}

export const sceneIndexer = {
  indexScene,
  syncAllScenes,
  syncSceneById,
  getIndexedScenes,
  incrementSceneView,
}


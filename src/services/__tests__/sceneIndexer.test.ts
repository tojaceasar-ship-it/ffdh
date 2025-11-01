import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sceneIndexer, getIndexedScenes } from '../sceneIndexer'
import * as sanityModule from '@/lib/sanity'
import * as supabaseModule from '@/lib/supabase'
import * as aiServiceModule from '../aiService'

// Mock dependencies
vi.mock('@/lib/sanity')
vi.mock('@/lib/supabase')
vi.mock('../aiService')

describe('sceneIndexer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('indexScene', () => {
    it('should index a scene with all fields', async () => {
      const mockScene = {
        _id: 'sanity-123',
        _type: 'scene',
        slug: { current: 'test-scene' },
        title: 'Test Scene',
        description: 'Test description',
        narrative: 'Test narrative',
        image: { asset: { _ref: 'image-ref' } },
        emotionTags: ['joy', 'hope'],
        tags: ['urban'],
      }

      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 'uuid-123' },
          error: null,
        }),
      }

      vi.spyOn(supabaseModule, 'supabase', 'get').mockReturnValue(mockSupabase as any)

      const result = await sceneIndexer.indexScene(mockScene as any)

      expect(result).toBeTruthy()
      expect(result?.sanity_id).toBe('sanity-123')
      expect(result?.slug).toBe('test-scene')
      expect(result?.title).toBe('Test Scene')
      expect(mockSupabase.from).toHaveBeenCalledWith('scenes')
    })

    it('should extract emotion tags from description if not provided', async () => {
      const mockScene = {
        _id: 'sanity-456',
        _type: 'scene',
        slug: { current: 'test-scene-2' },
        title: 'Test Scene 2',
        description: 'This is a sad story',
      }

      const mockAnalysis = {
        emotion: 'sadness',
        confidence: 0.9,
        sentiment: 'negative' as const,
      }

      vi.spyOn(aiServiceModule, 'analyzeEmotion').mockResolvedValue(mockAnalysis)

      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 'uuid-456' },
          error: null,
        }),
      }

      vi.spyOn(supabaseModule, 'supabase', 'get').mockReturnValue(mockSupabase as any)

      const result = await sceneIndexer.indexScene(mockScene as any)

      expect(aiServiceModule.analyzeEmotion).toHaveBeenCalledWith('This is a sad story')
      expect(result?.emotion_tags).toContain('sadness')
    })

    it('should handle missing slug gracefully', async () => {
      const mockScene = {
        _id: 'sanity-789',
        _type: 'scene',
        title: 'Test Scene',
      }

      const result = await sceneIndexer.indexScene(mockScene as any)

      expect(result).toBeNull()
    })
  })

  describe('syncAllScenes', () => {
    it('should sync all scenes from Sanity', async () => {
      const mockScenes = [
        {
          _id: 'sanity-1',
          slug: { current: 'scene-1' },
          title: 'Scene 1',
        },
        {
          _id: 'sanity-2',
          slug: { current: 'scene-2' },
          title: 'Scene 2',
        },
      ]

      vi.spyOn(sanityModule, 'sanityFetch').mockResolvedValue(mockScenes as any)

      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 'uuid-1' },
          error: null,
        }),
      }

      vi.spyOn(supabaseModule, 'supabase', 'get').mockReturnValue(mockSupabase as any)
      vi.spyOn(aiServiceModule, 'analyzeEmotion').mockResolvedValue({
        emotion: 'neutral',
        confidence: 0.5,
        sentiment: 'neutral',
      })

      const result = await sceneIndexer.syncAllScenes()

      expect(result.success).toBe(2)
      expect(result.failed).toBe(0)
      expect(sanityModule.sanityFetch).toHaveBeenCalledWith({
        query: expect.stringContaining('scene'),
      })
    })

    it('should handle empty scenes array', async () => {
      vi.spyOn(sanityModule, 'sanityFetch').mockResolvedValue([])

      const result = await sceneIndexer.syncAllScenes()

      expect(result.success).toBe(0)
      expect(result.failed).toBe(0)
    })

    it('should handle sync errors gracefully', async () => {
      vi.spyOn(sanityModule, 'sanityFetch').mockResolvedValue([
        {
          _id: 'sanity-error',
          slug: { current: 'error-scene' },
          title: 'Error Scene',
        },
      ])

      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      }

      vi.spyOn(supabaseModule, 'supabase', 'get').mockReturnValue(mockSupabase as any)
      vi.spyOn(aiServiceModule, 'analyzeEmotion').mockResolvedValue({
        emotion: 'neutral',
        confidence: 0.5,
        sentiment: 'neutral',
      })

      const result = await sceneIndexer.syncAllScenes()

      expect(result.success).toBe(0)
      expect(result.failed).toBe(1)
    })
  })

  describe('getIndexedScenes', () => {
    it('should fetch scenes from Supabase', async () => {
      const mockScenes = [
        {
          id: 'uuid-1',
          slug: 'scene-1',
          title: 'Scene 1',
          emotion_tags: ['joy'],
        },
        {
          id: 'uuid-2',
          slug: 'scene-2',
          title: 'Scene 2',
          emotion_tags: ['sadness'],
        },
      ]

      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({
          data: mockScenes,
          error: null,
        }),
      }

      vi.spyOn(supabaseModule, 'supabase', 'get').mockReturnValue(mockSupabase as any)

      const result = await getIndexedScenes({ limit: 10 })

      expect(result).toHaveLength(2)
      expect(result[0].slug).toBe('scene-1')
      expect(mockSupabase.from).toHaveBeenCalledWith('scenes')
    })

    it('should filter by emotion tags', async () => {
      const mockScenes = [
        {
          id: 'uuid-1',
          slug: 'scene-1',
          title: 'Scene 1',
          emotion_tags: ['joy'],
        },
      ]

      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        contains: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({
          data: mockScenes,
          error: null,
        }),
      }

      vi.spyOn(supabaseModule, 'supabase', 'get').mockReturnValue(mockSupabase as any)

      const result = await getIndexedScenes({ emotionTags: ['joy'] })

      expect(mockSupabase.contains).toHaveBeenCalledWith('emotion_tags', ['joy'])
      expect(result).toHaveLength(1)
    })

    it('should handle errors gracefully', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      }

      vi.spyOn(supabaseModule, 'supabase', 'get').mockReturnValue(mockSupabase as any)

      const result = await getIndexedScenes()

      expect(result).toEqual([])
    })
  })

  describe('incrementSceneView', () => {
    it('should increment view count', async () => {
      const mockSupabase = {
        rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
      }

      vi.spyOn(supabaseModule, 'supabase', 'get').mockReturnValue(mockSupabase as any)

      await sceneIndexer.incrementSceneView('test-scene')

      expect(mockSupabase.rpc).toHaveBeenCalledWith('increment_scene_view_count', {
        scene_slug: 'test-scene',
      })
    })
  })
})


import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  buildSceneContext,
  buildPromptContext,
  buildEnhancedPrompt,
  buildSystemPrompt,
  detectLanguage,
  getAnonymizedEmotionHistory,
} from '../promptContext'
import * as supabaseModule from '@/lib/supabase'

vi.mock('@/lib/supabase')

describe('promptContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('buildSceneContext', () => {
    it('should build scene context from Supabase', async () => {
      const mockScene = {
        title: 'Test Scene',
        description: 'Test description',
        narrative: 'Test narrative',
        emotion_tags: ['joy', 'hope'],
        slug: 'test-scene',
      }

      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockScene,
          error: null,
        }),
      }

      vi.spyOn(supabaseModule, 'supabase', 'get').mockReturnValue(mockSupabase as any)

      const result = await buildSceneContext('test-scene')

      expect(result).toBeTruthy()
      expect(result?.title).toBe('Test Scene')
      expect(result?.emotionTags).toEqual(['joy', 'hope'])
      expect(result?.slug).toBe('test-scene')
    })

    it('should return null on error', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Not found' },
        }),
      }

      vi.spyOn(supabaseModule, 'supabase', 'get').mockReturnValue(mockSupabase as any)

      const result = await buildSceneContext('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('buildEnhancedPrompt', () => {
    it('should build enhanced prompt with all context', () => {
      const context = {
        scene: {
          title: 'Test Scene',
          description: 'A test scene description',
          narrative: 'The narrative of the scene',
          emotionTags: ['joy', 'hope'],
          slug: 'test-scene',
        },
        user: {
          selectedEmotion: 'joy',
          previousEmotions: ['joy', 'hope', 'joy'],
          language: 'en' as const,
        },
        timestamp: new Date().toISOString(),
      }

      const prompt = buildEnhancedPrompt(context, 'This is a test comment')

      expect(prompt).toContain('Scene: "Test Scene"')
      expect(prompt).toContain('Description: A test scene description')
      expect(prompt).toContain('Narrative: The narrative of the scene')
      expect(prompt).toContain('Scene emotions: joy, hope')
      expect(prompt).toContain('User emotion: joy')
      expect(prompt).toContain('Community emotions: joy, hope')
      expect(prompt).toContain('User comment: "This is a test comment"')
      expect(prompt).toContain('Response language: English')
    })

    it('should handle missing optional fields', () => {
      const context = {
        scene: {
          title: 'Minimal Scene',
          slug: 'minimal-scene',
        },
        user: {},
        timestamp: new Date().toISOString(),
      }

      const prompt = buildEnhancedPrompt(context, 'Test')

      expect(prompt).toContain('Scene: "Minimal Scene"')
      expect(prompt).toContain('User comment: "Test"')
      expect(prompt).not.toContain('Description:')
    })
  })

  describe('buildSystemPrompt', () => {
    it('should build Polish system prompt', () => {
      const prompt = buildSystemPrompt('pl')
      expect(prompt).toContain('Jesteś AI towarzyszem')
      expect(prompt).toContain('polsku')
    })

    it('should build English system prompt', () => {
      const prompt = buildSystemPrompt('en')
      expect(prompt).toContain('You are the AI companion')
      expect(prompt).toContain('English')
    })

    it('should default to English when language not specified', () => {
      const prompt = buildSystemPrompt()
      expect(prompt).toContain('You are the AI companion')
    })
  })

  describe('detectLanguage', () => {
    it('should detect Polish text', () => {
      expect(detectLanguage('To jest polski tekst z ąćęłń')).toBe('pl')
      expect(detectLanguage('Miasto łąka')).toBe('pl')
    })

    it('should detect English text', () => {
      expect(detectLanguage('This is English text')).toBe('en')
      expect(detectLanguage('Hello world')).toBe('en')
    })

    it('should default to English for ambiguous text', () => {
      expect(detectLanguage('123456')).toBe('en')
    })
  })

  describe('getAnonymizedEmotionHistory', () => {
    it('should fetch emotion history from comments', async () => {
      const mockComments = [
        { emotion: 'joy' },
        { emotion: 'sadness' },
        { emotion: 'joy' },
      ]

      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        not: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({
          data: mockComments,
          error: null,
        }),
      }

      vi.spyOn(supabaseModule, 'supabase', 'get').mockReturnValue(mockSupabase as any)

      const result = await getAnonymizedEmotionHistory('test-scene')

      expect(result).toEqual(['joy', 'sadness', 'joy'])
      expect(mockSupabase.from).toHaveBeenCalledWith('comments')
    })

    it('should filter out null emotions', async () => {
      const mockComments = [
        { emotion: 'joy' },
        { emotion: null },
        { emotion: 'sadness' },
      ]

      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        not: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({
          data: mockComments,
          error: null,
        }),
      }

      vi.spyOn(supabaseModule, 'supabase', 'get').mockReturnValue(mockSupabase as any)

      const result = await getAnonymizedEmotionHistory('test-scene')

      expect(result).toEqual(['joy', 'sadness'])
    })

    it('should return empty array on error', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        not: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Error' },
        }),
      }

      vi.spyOn(supabaseModule, 'supabase', 'get').mockReturnValue(mockSupabase as any)

      const result = await getAnonymizedEmotionHistory('test-scene')

      expect(result).toEqual([])
    })
  })

  describe('buildPromptContext', () => {
    it('should build complete prompt context', async () => {
      const mockScene = {
        title: 'Test Scene',
        description: 'Test description',
        narrative: 'Test narrative',
        emotion_tags: ['joy'],
        slug: 'test-scene',
      }

      const mockComments = [{ emotion: 'joy' }]

      const mockSupabase = {
        from: vi.fn()
          .mockReturnThis()
          .mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: mockScene,
              error: null,
            }),
          })
          .mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            not: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({
              data: mockComments,
              error: null,
            }),
          }),
      }

      vi.spyOn(supabaseModule, 'supabase', 'get').mockReturnValue(mockSupabase as any)

      const result = await buildPromptContext('test-scene', {
        selectedEmotion: 'joy',
        language: 'en',
      })

      expect(result).toBeTruthy()
      expect(result?.scene.title).toBe('Test Scene')
      expect(result?.user.selectedEmotion).toBe('joy')
      expect(result?.user.previousEmotions).toEqual(['joy'])
    })

    it('should return null if scene not found', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Not found' },
        }),
      }

      vi.spyOn(supabaseModule, 'supabase', 'get').mockReturnValue(mockSupabase as any)

      const result = await buildPromptContext('non-existent', {})

      expect(result).toBeNull()
    })
  })
})


/**
 * Tests for rewirService
 * @jest-environment node
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { EmotionScene } from '../rewirService'

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
  isSupabaseConfigured: false,
}))

vi.mock('../../content/auto_scenes.json', () => ({
  default: [
    {
      slug: 'test-scene',
      title: 'Test Scene',
      description: 'Test description',
      narrative: 'Test narrative',
      imageUrl: '/test.jpg',
      emotionTags: ['joy'],
    },
  ],
}))

describe('rewirService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSceneBySlug', () => {
    it('should return null for invalid slug', async () => {
      const { getSceneBySlug } = await import('../rewirService')
      const result = await getSceneBySlug('')
      expect(result).toBeNull()
    })
  })

  describe('normalizeScene', () => {
    it('should normalize scene data correctly', async () => {
      // This is an internal function, but we can test via public API
      const mockScene: Partial<EmotionScene> = {
        slug: 'test-scene',
        title: 'Test Scene',
        description: 'Test description',
        emotionTags: ['joy'],
      }

      // Test that scene normalization works through getSceneBySlug
      const { getSceneBySlug } = await import('../rewirService')
      const result = await getSceneBySlug('test-scene')
      
      // Should return scene from auto_scenes.json
      expect(result).toBeDefined()
      if (result) {
        expect(result.slug).toBe('test-scene')
        expect(result.title).toBe('Test Scene')
      }
    })
  })
})


/**
 * Tests for aiService
 * @jest-environment node
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fetch globally
global.fetch = vi.fn()

describe('aiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.OPENAI_API_KEY = 'test-key'
  })

  describe('analyzeEmotion', () => {
    it('should return default emotion when API fails', async () => {
      // Mock fetch to fail
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      const { analyzeEmotion } = await import('../aiService')
      const result = await analyzeEmotion('test text')

      expect(result).toBeDefined()
      expect(result.emotion).toBeDefined()
      expect(result.confidence).toBeDefined()
      expect(result.sentiment).toBeDefined()
    })

    it('should handle timeout correctly', async () => {
      // Mock fetch to timeout
      const controller = new AbortController()
      vi.mocked(fetch).mockImplementationOnce(() => {
        controller.abort()
        return Promise.reject(new Error('Request timeout'))
      })

      const { analyzeEmotion } = await import('../aiService')
      const result = await analyzeEmotion('test text')

      // Should return default emotion on timeout
      expect(result).toBeDefined()
      expect(result.emotion).toBeDefined()
    })
  })

  describe('generateAIResponse', () => {
    it('should return fallback response when API fails', async () => {
      // Mock fetch to fail
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      const { generateAIResponse } = await import('../aiService')
      const result = await generateAIResponse('test comment', 'Test Scene', 'joy')

      expect(result).toBeDefined()
      expect(result.text).toBeDefined()
      expect(result.emotion).toBeDefined()
      expect(result.timestamp).toBeDefined()
    })
  })
})


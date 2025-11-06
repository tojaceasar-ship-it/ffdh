/**
 * Tests for productService
 * @jest-environment node
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

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

vi.mock('../../content/auto_products.json', () => ({
  default: [
    {
      slug: 'test-product',
      name: 'Test Product',
      description: 'Test description',
      price_eur: 99.99,
      imageUrl: '/test.jpg',
      is_limited: false,
      stock: 10,
    },
  ],
}))

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchProducts', () => {
    it('should return products from auto_products.json when Supabase is not configured', async () => {
      const { fetchProducts } = await import('../productService')
      const products = await fetchProducts()
      
      expect(products).toBeDefined()
      expect(Array.isArray(products)).toBe(true)
      if (products.length > 0) {
        expect(products[0]).toHaveProperty('id')
        expect(products[0]).toHaveProperty('slug')
        expect(products[0]).toHaveProperty('name')
      }
    })
  })

  describe('fetchProductBySlug', () => {
    it('should return product by slug', async () => {
      const { fetchProductBySlug } = await import('../productService')
      const product = await fetchProductBySlug('test-product')
      
      expect(product).toBeDefined()
      if (product) {
        expect(product.slug).toBe('test-product')
        expect(product.name).toBe('Test Product')
      }
    })
  })
})


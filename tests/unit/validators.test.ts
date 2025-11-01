import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  validatePassword,
  isAdult,
  isValidQuantity,
  isValidPrice,
  sanitizeInput,
  isValidComment,
  isValidSlug,
  isValidUrl,
  validateCheckoutData,
} from '../../src/utils/validators'

describe('Validators', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true)
      expect(isValidEmail('test123@test-domain.org')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('StrongPass123!')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject weak passwords', () => {
      expect(validatePassword('short')).toEqual({
        isValid: false,
        errors: [
          'Password must be at least 8 characters',
          'Password must contain at least one uppercase letter',
          'Password must contain at least one number',
        ],
      })

      expect(validatePassword('nouppercase123')).toEqual({
        isValid: false,
        errors: ['Password must contain at least one uppercase letter'],
      })

      expect(validatePassword('NOLOWERCASE123')).toEqual({
        isValid: false,
        errors: ['Password must contain at least one lowercase letter'],
      })

      expect(validatePassword('NoNumbers')).toEqual({
        isValid: false,
        errors: [
          'Password must contain at least one number',
        ],
      })
    })
  })

  describe('isAdult', () => {
    it('should validate adult age (18+)', () => {
      const adultDate = new Date()
      adultDate.setFullYear(adultDate.getFullYear() - 20)
      expect(isAdult(adultDate)).toBe(true)

      const exactly18 = new Date()
      exactly18.setFullYear(exactly18.getFullYear() - 18)
      expect(isAdult(exactly18)).toBe(true)
    })

    it('should reject underage', () => {
      const minorDate = new Date()
      minorDate.setFullYear(minorDate.getFullYear() - 16)
      expect(isAdult(minorDate)).toBe(false)
    })
  })

  describe('isValidQuantity', () => {
    it('should validate positive integers', () => {
      expect(isValidQuantity(1)).toBe(true)
      expect(isValidQuantity(100)).toBe(true)
      expect(isValidQuantity(999)).toBe(true)
    })

    it('should reject invalid quantities', () => {
      expect(isValidQuantity(0)).toBe(false)
      expect(isValidQuantity(-1)).toBe(false)
      expect(isValidQuantity(1.5)).toBe(false)
      expect(isValidQuantity(NaN)).toBe(false)
    })

    it('should respect max stock limit', () => {
      expect(isValidQuantity(5, 10)).toBe(true)
      expect(isValidQuantity(10, 10)).toBe(true)
      expect(isValidQuantity(15, 10)).toBe(false)
    })
  })

  describe('isValidPrice', () => {
    it('should validate valid prices', () => {
      expect(isValidPrice(0)).toBe(true)
      expect(isValidPrice(10.99)).toBe(true)
      expect(isValidPrice(999999.99)).toBe(true)
    })

    it('should reject invalid prices', () => {
      expect(isValidPrice(-1)).toBe(false)
      expect(isValidPrice(1000000)).toBe(false)
      expect(isValidPrice(NaN)).toBe(false)
      expect(isValidPrice(Infinity)).toBe(false)
    })
  })

  describe('sanitizeInput', () => {
    it('should sanitize HTML characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
      expect(sanitizeInput('normal text')).toBe('normal text')
      expect(sanitizeInput('  spaced  ')).toBe('spaced')
    })

    it('should handle edge cases', () => {
      expect(sanitizeInput('')).toBe('')
      expect(sanitizeInput('   ')).toBe('')
      expect(sanitizeInput('&<>"\'')).toBe('&amp;&lt;&gt;&quot;&#x27;')
    })
  })

  describe('isValidComment', () => {
    it('should validate valid comments', () => {
      expect(isValidComment('This is a valid comment')).toEqual({
        isValid: true,
        errors: [],
      })
    })

    it('should reject invalid comments', () => {
      expect(isValidComment('')).toEqual({
        isValid: false,
        errors: ['Comment cannot be empty', 'Comment must be at least 2 characters'],
      })

      expect(isValidComment('x')).toEqual({
        isValid: false,
        errors: ['Comment must be at least 2 characters'],
      })

      const longComment = 'a'.repeat(501)
      expect(isValidComment(longComment)).toEqual({
        isValid: false,
        errors: ['Comment must not exceed 500 characters'],
      })
    })
  })

  describe('isValidSlug', () => {
    it('should validate correct slug formats', () => {
      expect(isValidSlug('valid-slug')).toBe(true)
      expect(isValidSlug('product123')).toBe(true)
      expect(isValidSlug('a')).toBe(true)
      expect(isValidSlug('multi-word-slug-test')).toBe(true)
    })

    it('should reject invalid slug formats', () => {
      expect(isValidSlug('')).toBe(false)
      expect(isValidSlug('Invalid Slug')).toBe(false)
      expect(isValidSlug('invalid_slug')).toBe(false)
      expect(isValidSlug('invalid@slug')).toBe(false)
      expect(isValidSlug('-invalid-slug')).toBe(false)
      expect(isValidSlug('invalid-slug-')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('should validate valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000')).toBe(true)
      expect(isValidUrl('https://sub.example.com/path?query=value')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidUrl('invalid')).toBe(false)
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })
  })

  describe('validateCheckoutData', () => {
    it('should validate complete checkout data', () => {
      const result = validateCheckoutData({
        email: 'test@example.com',
        items: [{ id: '1' }],
        total: 29.99,
      })

      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should reject invalid checkout data', () => {
      expect(validateCheckoutData({})).toEqual({
        isValid: false,
        errors: {
          email: ['Valid email is required'],
          items: ['At least one item is required'],
          total: ['Valid total is required'],
        },
      })

      expect(validateCheckoutData({
        email: 'invalid-email',
        items: [],
        total: -10,
      })).toEqual({
        isValid: false,
        errors: {
          email: ['Valid email is required'],
          items: ['At least one item is required'],
          total: ['Valid total is required'],
        },
      })
    })
  })
})

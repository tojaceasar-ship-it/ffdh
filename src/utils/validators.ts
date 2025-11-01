/**
 * Validation utilities for FFDH
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate age (18+)
 */
export function isAdult(birthDate: Date): boolean {
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 18
  }

  return age >= 18
}

/**
 * Validate product quantity
 */
export function isValidQuantity(quantity: number, maxStock?: number): boolean {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return false
  }

  if (maxStock && quantity > maxStock) {
    return false
  }

  return true
}

/**
 * Validate price
 */
export function isValidPrice(price: number): boolean {
  return typeof price === 'number' && price >= 0 && price <= 999999.99
}

/**
 * Sanitize user input (prevent XSS)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

/**
 * Validate comment length
 */
export function isValidComment(text: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  const sanitized = text.trim()

  if (sanitized.length === 0) {
    errors.push('Comment cannot be empty')
  }

  if (sanitized.length < 2) {
    errors.push('Comment must be at least 2 characters')
  }

  if (sanitized.length > 500) {
    errors.push('Comment must not exceed 500 characters')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Batch validation result
 */
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
}

/**
 * Validate checkout data
 */
export function validateCheckoutData(data: {
  email?: string
  items?: any[]
  total?: number
}): ValidationResult {
  const errors: Record<string, string[]> = {}

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = ['Valid email is required']
  }

  if (!data.items || data.items.length === 0) {
    errors.items = ['At least one item is required']
  }

  if (!data.total || !isValidPrice(data.total)) {
    errors.total = ['Valid total is required']
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validators = {
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
}

export default validators

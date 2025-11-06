/**
 * Common data normalization utilities
 * Used for normalizing data from various sources (Supabase, Sanity, auto) to consistent formats
 */

/**
 * Check if required string field is present and non-empty
 */
export function hasRequiredField(
  value: string | null | undefined
): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Normalize a value with fallback
 */
export function normalizeValue<T>(
  value: T | null | undefined,
  fallback: T
): T {
  return value !== null && value !== undefined ? value : fallback
}

/**
 * Normalize array with fallback to empty array
 */
export function normalizeArray<T>(
  value: T[] | null | undefined,
  fallback: T[] = []
): T[] {
  return Array.isArray(value) ? value : fallback
}

/**
 * Normalize number with fallback
 */
export function normalizeNumber(
  value: number | null | undefined,
  fallback: number = 0
): number {
  if (typeof value === 'number' && !isNaN(value)) {
    return value
  }
  return fallback
}

/**
 * Normalize boolean with fallback
 */
export function normalizeBoolean(
  value: boolean | null | undefined,
  fallback: boolean = false
): boolean {
  if (typeof value === 'boolean') {
    return value
  }
  return fallback
}


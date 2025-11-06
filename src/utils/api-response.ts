/**
 * Standardized API response utilities
 * Provides consistent response format across all API routes
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: string
  timestamp: string
  message?: string
}

export interface ApiError {
  success: false
  error: string
  code?: string
  timestamp: string
  details?: any
}

/**
 * Create a successful API response
 */
export function createApiResponse<T>(
  data: T,
  message?: string
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Create an error API response
 */
export function createApiError(
  error: string,
  code?: string,
  details?: any
): ApiError {
  return {
    success: false,
    error,
    code,
    timestamp: new Date().toISOString(),
    details: process.env.NODE_ENV === 'development' ? details : undefined,
  }
}

/**
 * Create a validation error response
 */
export function createValidationError(
  errors: any[],
  message: string = 'Validation failed'
): ApiError {
  return createApiError(message, 'VALIDATION_ERROR', { errors })
}

/**
 * Create a not found error response
 */
export function createNotFoundError(
  resource: string = 'Resource'
): ApiError {
  return createApiError(
    `${resource} not found`,
    'NOT_FOUND'
  )
}

/**
 * Create an unauthorized error response
 */
export function createUnauthorizedError(
  message: string = 'Unauthorized'
): ApiError {
  return createApiError(message, 'UNAUTHORIZED')
}

/**
 * Create a service unavailable error response
 */
export function createServiceUnavailableError(
  service: string,
  message?: string
): ApiError {
  return createApiError(
    message || `Service unavailable: ${service}`,
    'SERVICE_UNAVAILABLE'
  )
}


import { NextRequest, NextResponse } from 'next/server'

// Printful API configuration
const PRINTFUL_API_URL = 'https://api.printful.com'
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>()

// Rate limiting (basic in-memory for demo)
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 100 // requests per window
const rateLimit = new Map<string, { count: number; resetTime: number }>()

interface PrintfulError {
  code: number
  message: string
  errors?: Record<string, string[]>
}

/**
 * Check rate limit for IP
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimit.get(ip)

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }

  record.count++
  return true
}

/**
 * Get cached response if valid
 */
function getCachedResponse(key: string): any | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  // Clean up expired cache
  if (cached) {
    cache.delete(key)
  }
  return null
}

/**
 * Set cached response
 */
function setCachedResponse(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() })
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Fetch with retry and exponential backoff
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)

      // Success or client errors (4xx) - don't retry
      if (response.status < 500) {
        return response
      }

      // Server errors (5xx) - retry with backoff
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 8000) // Exponential backoff, max 8s
        console.warn(`Printful API error ${response.status}, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`)
        await sleep(delay)
        continue
      }

      return response
    } catch (error) {
      lastError = error as Error

      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 8000)
        console.warn(`Printful API network error, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1}):`, error)
        await sleep(delay)
        continue
      }
    }
  }

  throw lastError!
}

/**
 * Map Printful errors to user-friendly messages
 */
function mapPrintfulError(error: PrintfulError): { message: string; code: string } {
  const errorMappings: Record<number, string> = {
    400: 'Invalid request data. Please check your input.',
    401: 'Authentication failed. Please contact support.',
    403: 'Access forbidden. Please check your permissions.',
    404: 'Resource not found.',
    409: 'Conflict with existing data.',
    422: 'Validation failed. Please check your data format.',
    429: 'Too many requests. Please try again later.',
    500: 'Printful service temporarily unavailable. Please try again.',
    502: 'Printful service temporarily unavailable.',
    503: 'Printful service temporarily unavailable.',
    504: 'Printful service timeout. Please try again.',
  }

  return {
    message: errorMappings[error.code] || 'An unexpected error occurred. Please try again.',
    code: `PRINTFUL_${error.code}`
  }
}

/**
 * Handle Printful API requests with caching, retry, and error handling
 */
async function handlePrintfulRequest(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  useCache: boolean = true
): Promise<NextResponse> {
  try {
    // Validate configuration
    if (!PRINTFUL_API_KEY) {
      console.error('Printful API key not configured')
      return NextResponse.json(
        { error: 'Printful service not configured' },
        { status: 503 }
      )
    }

    // Validate endpoint to prevent abuse
    if (!endpoint.startsWith('/')) {
      return NextResponse.json(
        { error: 'Invalid endpoint' },
        { status: 400 }
      )
    }

    // Construct full URL
    const url = `${PRINTFUL_API_URL}${endpoint}`

    // Check cache for GET requests
    const cacheKey = `${method}:${url}:${JSON.stringify(body)}`
    if (method === 'GET' && useCache) {
      const cachedData = getCachedResponse(cacheKey)
      if (cachedData) {
        return NextResponse.json(cachedData)
      }
    }

    // Prepare request options
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'FFDH-Next.js/1.0.0',
      },
    }

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body)
    }

    // Make request with retry logic
    const response = await fetchWithRetry(url, options)

    // Handle non-2xx responses
    if (!response.ok) {
      let errorData: PrintfulError
      try {
        errorData = await response.json()
      } catch {
        errorData = {
          code: response.status,
          message: response.statusText || 'Unknown error'
        }
      }

      const mappedError = mapPrintfulError(errorData)

      console.error('Printful API error:', {
        endpoint,
        status: response.status,
        error: mappedError,
        originalError: errorData
      })

      return NextResponse.json(
        {
          error: mappedError.message,
          code: mappedError.code,
          details: process.env.NODE_ENV === 'development' ? errorData : undefined
        },
        { status: response.status }
      )
    }

    // Parse successful response
    const data = await response.json()

    // Cache successful GET responses
    if (method === 'GET' && useCache) {
      setCachedResponse(cacheKey, data)
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Printful proxy error:', error)
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again.' },
      { status: 503 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')

  if (!endpoint) {
    return NextResponse.json(
      { error: 'Missing endpoint parameter' },
      { status: 400 }
    )
  }

  // Get client IP for rate limiting
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    )
  }

  return handlePrintfulRequest(endpoint, 'GET')
}

export async function POST(request: NextRequest) {
  try {
    const { endpoint, data, noCache } = await request.json()

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Missing endpoint parameter' },
        { status: 400 }
      )
    }

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    return handlePrintfulRequest(endpoint, 'POST', data, !noCache)
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    )
  }
}

// Support for other methods if needed
export async function PUT(request: NextRequest) {
  try {
    const { endpoint, data } = await request.json()

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Missing endpoint parameter' },
        { status: 400 }
      )
    }

    return handlePrintfulRequest(endpoint, 'PUT', data, false)
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')

  if (!endpoint) {
    return NextResponse.json(
      { error: 'Missing endpoint parameter' },
      { status: 400 }
    )
  }

  return handlePrintfulRequest(endpoint, 'DELETE', undefined, false)
}

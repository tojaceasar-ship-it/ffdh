import { NextRequest } from 'next/server'
import crypto from 'crypto'

/**
 * Verify Stripe webhook signature
 */
export function verifyStripeWebhook(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  try {
    const elements = signature.split(',')
    const sigElements: Record<string, string> = {}

    for (const element of elements) {
      const [key, value] = element.split('=')
      sigElements[key] = value
    }

    const timestamp = sigElements.t
    const signatures = sigElements.v1.split(',')

    const signedPayload = `${timestamp}.${rawBody}`
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex')

    return signatures.some(sig => crypto.timingSafeEqual(
      Buffer.from(sig),
      Buffer.from(expectedSignature)
    ))
  } catch (error) {
    console.error('Stripe webhook verification failed:', error)
    return false
  }
}

/**
 * Verify Printful webhook signature
 */
export function verifyPrintfulWebhook(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error('Printful webhook verification failed:', error)
    return false
  }
}

/**
 * Generic webhook verification with retry logic
 */
export async function verifyWebhook(
  request: NextRequest,
  secret: string,
  provider: 'stripe' | 'printful' = 'stripe'
): Promise<{ isValid: boolean; body: string }> {
  try {
    const signature = request.headers.get('stripe-signature') ||
                     request.headers.get('x-printful-signature') ||
                     request.headers.get('x-signature')

    if (!signature) {
      console.error('Missing webhook signature')
      return { isValid: false, body: '' }
    }

    // Clone the request to read the body
    const clonedRequest = request.clone()
    
    // Read body as text for webhook verification
    let rawBody: string
    try {
      if (clonedRequest.body instanceof ReadableStream) {
        // For ReadableStream, we need to convert it to text
        const reader = clonedRequest.body.getReader()
        const decoder = new TextDecoder()
        let bodyText = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          bodyText += decoder.decode(value, { stream: true })
        }
        rawBody = bodyText
      } else if (typeof clonedRequest.body === 'string') {
        rawBody = clonedRequest.body
      } else {
        // Body is null or unknown type
        rawBody = ''
      }
    } catch (error) {
      console.error('Error reading webhook body:', error)
      return { isValid: false, body: '' }
    }

    if (!rawBody) {
      console.error('Empty webhook body')
      return { isValid: false, body: '' }
    }

    let isValid = false

    if (provider === 'stripe') {
      isValid = verifyStripeWebhook(rawBody, signature, secret)
    } else if (provider === 'printful') {
      isValid = verifyPrintfulWebhook(rawBody, signature, secret)
    }

    return { isValid, body: rawBody }
  } catch (error) {
    console.error('Webhook verification error:', error)
    return { isValid: false, body: '' }
  }
}

/**
 * Rate limiting for webhook endpoints
 */
const webhookRateLimit = new Map<string, { count: number; resetTime: number }>()

export function checkWebhookRateLimit(
  ip: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
  const now = Date.now()
  const key = ip
  const record = webhookRateLimit.get(key)

  if (!record || now > record.resetTime) {
    webhookRateLimit.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

/**
 * Clean up expired rate limit records
 */
export function cleanupRateLimit(): void {
  const now = Date.now()
  for (const [key, record] of webhookRateLimit.entries()) {
    if (now > record.resetTime) {
      webhookRateLimit.delete(key)
    }
  }
}

// Clean up rate limit records every 5 minutes
setInterval(cleanupRateLimit, 5 * 60 * 1000)

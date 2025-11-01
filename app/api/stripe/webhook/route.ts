import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/stripe/webhook
 * Legacy route - redirects to unified webhook handler
 *
 * @deprecated Use /api/webhooks/stripe instead
 */
export async function POST(request: NextRequest) {
  // Redirect to the new unified webhook handler
  const url = new URL(request.url)
  url.pathname = '/api/webhooks/stripe'

  // Forward the request to the new handler
  const newRequest = new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })

  // Import and call the new handler
  const { POST: newHandler } = await import('../../webhooks/[source]/route')

  return newHandler(
    newRequest as any,
    { params: Promise.resolve({ source: 'stripe' }) }
  )
}

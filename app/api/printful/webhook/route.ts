import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhook, checkWebhookRateLimit } from '@/utils/webhook-verification'
import * as Sentry from '@sentry/nextjs'

/**
 * POST /api/printful/webhook
 * Handle Printful webhook events with verification
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown'

    if (!checkWebhookRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`)
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Verify webhook signature
    const secret = process.env.PRINTFUL_WEBHOOK_SECRET
    if (!secret) {
      console.error('Missing PRINTFUL_WEBHOOK_SECRET')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const { isValid, body } = await verifyWebhook(request, secret, 'printful')

    if (!isValid) {
      console.error('Invalid Printful webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse webhook payload
    const event = JSON.parse(body)

    console.log(`[Printful Webhook] Received event: ${event.type}`)

    // Handle different event types
    switch (event.type) {
      case 'order_created':
        // Handle order creation
        console.log('Order created:', event.data.id)
        // TODO: Process order fulfillment
        break

      case 'order_updated':
        // Handle order updates
        console.log('Order updated:', event.data.id, 'status:', event.data.status)
        // TODO: Update order status
        break

      case 'order_failed':
        // Handle failed orders
        console.error('Order failed:', event.data.id, 'reason:', event.data.failure_reason)
        // TODO: Handle order failure
        break

      case 'order_canceled':
        // Handle canceled orders
        console.log('Order canceled:', event.data.id)
        // TODO: Handle order cancellation
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({
      received: true,
      event: event.type,
    })
  } catch (error) {
    console.error('Printful webhook error:', error)
    Sentry.captureException(error)

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

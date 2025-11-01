import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhook, checkWebhookRateLimit } from '@/utils/webhook-verification'
import * as Sentry from '@sentry/nextjs'

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events with verification
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
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    if (!secret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const { isValid, body } = await verifyWebhook(request, secret, 'stripe')

    if (!isValid) {
      console.error('Invalid Stripe webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse webhook payload
    const event = JSON.parse(body)

    console.log(`[Stripe Webhook] Received event: ${event.type}`)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful payment
        console.log('Payment completed:', event.data.object.id)
        // TODO: Update order status in database
        break

      case 'payment_intent.payment_failed':
        // Handle failed payment
        console.error('Payment failed:', event.data.object.id)
        // TODO: Handle failed payment logic
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({
      received: true,
      event: event.type,
    })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    Sentry.captureException(error)

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

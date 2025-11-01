import { NextRequest, NextResponse } from 'next/server'

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

/**
 * POST /api/stripe/webhook
 * Stripe webhook handler for payment events
 * Handles: checkout.session.completed, payment_intent.succeeded
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature || !STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // TODO: Verify Stripe signature
    // const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)

    // Temporary: Parse event manually
    const event = JSON.parse(body)

    console.log(`[Webhook] Event type: ${event.type}`)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log(`[Webhook] Checkout completed: ${session.id}`)

        // TODO: Create order in Printful
        // TODO: Save order to Supabase
        // TODO: Send confirmation email
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        console.log(`[Webhook] Payment succeeded: ${paymentIntent.id}`)
        break
      }

      case 'charge.failed': {
        const charge = event.data.object
        console.log(`[Webhook] Charge failed: ${charge.id}`)
        // TODO: Notify user
        break
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 500 }
    )
  }
}

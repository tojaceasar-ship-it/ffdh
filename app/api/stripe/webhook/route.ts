import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    // For development, just acknowledge receipt
    console.log('[Webhook] Received Stripe event')

    return NextResponse.json({
      received: true,
      message: 'Webhook acknowledged',
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 500 }
    )
  }
}

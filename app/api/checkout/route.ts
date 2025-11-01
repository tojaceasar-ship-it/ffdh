import { NextRequest, NextResponse } from 'next/server'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

/**
 * POST /api/checkout
 * Create Stripe checkout session
 * Body: { items: Array<{variantId, quantity, priceEUR, name}>, successUrl?, cancelUrl? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, successUrl, cancelUrl } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing items' }, { status: 400 })
    }

    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    // TODO: Call Stripe API to create checkout session
    // const stripe = new Stripe(STRIPE_SECRET_KEY)
    // const session = await stripe.checkout.sessions.create({...})
    // return NextResponse.json({ url: session.url })

    // Temporary mock response
    return NextResponse.json({
      id: 'cs_test_' + Date.now(),
      url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      mode: 'test',
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    )
  }
}

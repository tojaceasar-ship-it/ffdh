import { NextRequest, NextResponse } from 'next/server'
import { validateApiRequest, createCheckoutSessionSchema } from '@/lib/validation'
import Stripe from 'stripe'
import * as Sentry from '@sentry/nextjs'
import { fetchProductBySlug } from '../../../src/services/productService'

/**
 * POST /api/checkout
 * Create Stripe checkout session with validation
 */
export async function POST(request: NextRequest) {
  try {
    const validation = await validateApiRequest(createCheckoutSessionSchema, request)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.errors,
        },
        { status: 400 }
      )
    }

    const { items, shipping, successUrl, cancelUrl } = validation.data

    // Initialize Stripe with validation
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      console.warn('[Checkout] Stripe key missing, returning mock session')
      return NextResponse.json({
        success: true,
        sessionId: 'mock-session',
        url: successUrl,
        mock: true,
      })
    }

    const stripe = new Stripe(stripeKey)

    // Transform items for Stripe with real product data
    const lineItems = await Promise.all(
      items.map(async (item) => {
        // Extract product slug from variant ID (assuming format: "product-slug-variant")
        const productSlug = item.variantId.split('-').slice(0, -1).join('-') || item.variantId;

        // Fetch real product data
        const product = await fetchProductBySlug(productSlug);

        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product?.name || item.variantId, // Use real name or fallback to variant ID
              description: `Quantity: ${item.quantity}${product?.description ? ` - ${product.description}` : ''}`,
              images: product?.imageUrl ? [product.imageUrl] : undefined,
            },
            unit_amount: product?.priceEUR
              ? Math.round(product.priceEUR * 100) // Convert EUR to cents
              : Math.round(29.99 * 100), // Fallback price
          },
          quantity: item.quantity,
        };
      })
    );

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: shipping.email,
      shipping_address_collection: {
        allowed_countries: ['PL', 'US', 'GB', 'DE', 'FR'],
      },
      metadata: {
        shipping_name: shipping.name,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_postal_code: shipping.postalCode,
        shipping_country: shipping.country,
        shipping_phone: shipping.phone || '',
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    })

    console.log(`[Checkout] Created session: ${session.id}`)

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    Sentry.captureException(error)

    return NextResponse.json(
      { error: 'Checkout session creation failed' },
      { status: 500 }
    )
  }
}

import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Runtime and dynamic config for raw body access
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Idempotency store (in production, use Redis/DB)
// Note: In serverless, Map is per-instance, so entries expire when function times out
const processedEvents = new Map<string, number>();

// Clean up old entries on-demand (no setInterval for serverless compatibility)
function cleanupOldEntries(): void {
  const now = Date.now();
  const TTL = 60 * 60 * 1000; // 1 hour TTL
  for (const [key, timestamp] of processedEvents.entries()) {
    if (now - timestamp > TTL) {
      processedEvents.delete(key);
    }
  }
}

// Check if event was already processed (and clean up old entries)
function isEventProcessed(eventKey: string): boolean {
  cleanupOldEntries(); // Clean up before checking
  return processedEvents.has(eventKey);
}

// Mark event as processed
function markEventProcessed(eventKey: string): void {
  processedEvents.set(eventKey, Date.now());
}

interface WebhookVerificationResult {
  isValid: boolean;
  eventId?: string;
  error?: string;
}

async function verifyHmac({
  rawBody,
  signatureHeader,
  timestampHeader,
  secret,
  toleranceSec = 300, // 5 min replay protection
  source,
}: {
  rawBody: string;
  signatureHeader: string | null;
  timestampHeader: string | null;
  secret: string;
  toleranceSec?: number;
  source: string;
}): Promise<WebhookVerificationResult> {
  if (!signatureHeader || !timestampHeader) {
    return { isValid: false, error: "Missing signature or timestamp headers" };
  }

  const ts = Number(timestampHeader);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > toleranceSec) {
    return { isValid: false, error: "Timestamp outside tolerance window" };
  }

  let canonicalString: string;
  let expectedSignature: string;

  // Provider-specific canonical string construction
  switch (source.toLowerCase()) {
    case "stripe":
      // Stripe: t=<timestamp>,v1=<signature>
      canonicalString = `${timestampHeader}.${rawBody}`;
      const stripeElements = signatureHeader.split(",");
      const stripeSig = stripeElements.find(el => el.startsWith("v1="))?.replace("v1=", "");
      if (!stripeSig) return { isValid: false, error: "Invalid Stripe signature format" };

      expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(canonicalString, "utf8")
        .digest("hex");

      if (!crypto.timingSafeEqual(Buffer.from(stripeSig), Buffer.from(expectedSignature))) {
        return { isValid: false, error: "Invalid signature" };
      }
      break;

    case "github":
      // GitHub: sha256=<hex>
      canonicalString = rawBody;
      expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(canonicalString, "utf8")
        .digest("hex");

      const githubSig = signatureHeader.replace(/^sha256=/, "");
      if (!crypto.timingSafeEqual(Buffer.from(githubSig), Buffer.from(expectedSignature))) {
        return { isValid: false, error: "Invalid signature" };
      }
      break;

    default:
      return { isValid: false, error: `Unsupported webhook source: ${source}` };
  }

  return { isValid: true };
}

function extractEventId(data: any, source: string): string | null {
  switch (source.toLowerCase()) {
    case "stripe":
      return data.id || data.data?.object?.id || null;
    case "github":
      return data.id || null;
    default:
      return null;
  }
}

async function readRawBody(request: NextRequest): Promise<string> {
  // IMPORTANT: Read as text to preserve exact bytes for HMAC verification
  const text = await request.text();
  return text;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ source: string }> }
) {
  const { source } = await params;
  const sourceLower = source.toLowerCase();

  // Validate source parameter
  const validSources = ["stripe", "github"];
  if (!validSources.includes(sourceLower)) {
    console.warn(`[Webhook] Invalid source attempted: ${source}`);
    return NextResponse.json({ error: "Invalid webhook source" }, { status: 400 });
  }

  // Get provider-specific secret
  let secret: string | undefined;

  switch (sourceLower) {
    case "stripe":
      secret = process.env.STRIPE_WEBHOOK_SECRET;
      break;
    case "github":
      secret = process.env.GITHUB_WEBHOOK_SECRET;
      break;
    default:
      secret = undefined;
  }

  if (!secret) {
    console.error(`[Webhook] Missing secret for ${sourceLower}`);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    // Read raw body BEFORE any processing
    const rawBody = await readRawBody(request);

    // Extract headers based on provider
    let signatureHeader: string | null = null;
    let timestampHeader: string | null = null;

    switch (source) {
      case "stripe":
        signatureHeader = request.headers.get("stripe-signature");
        timestampHeader = request.headers.get("stripe-timestamp");
        break;
      case "github":
        signatureHeader = request.headers.get("x-hub-signature-256");
        timestampHeader = request.headers.get("x-github-delivery-timestamp");
        break;
    }

    // Verify HMAC signature
    const verification = await verifyHmac({
      rawBody,
      signatureHeader,
      timestampHeader,
      secret,
      source: sourceLower,
    });

    if (!verification.isValid) {
      console.warn(`[Webhook:${sourceLower}] Verification failed: ${verification.error}`);
      return NextResponse.json(
        { error: verification.error || "Invalid signature" },
        { status: 400 }
      );
    }

    // Parse JSON after verification
    let data: any;
    try {
      data = JSON.parse(rawBody);
    } catch (parseError) {
      console.error(`[Webhook:${sourceLower}] JSON parse error:`, parseError);
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    // Extract event ID for idempotency
    const eventId = extractEventId(data, sourceLower);
    if (eventId) {
      const eventKey = `${sourceLower}:${eventId}`;

      // Check for duplicate processing (with automatic cleanup)
      if (isEventProcessed(eventKey)) {
        console.log(`[Webhook:${sourceLower}] Duplicate event ignored: ${eventId}`);
        return NextResponse.json({ status: "duplicate" }, { status: 200 });
      }

      // Mark as processed
      markEventProcessed(eventKey);
    }

    // Log verification success (no sensitive data)
    console.log(`[Webhook:${sourceLower}] Verified event: ${eventId || 'unknown'}`);

    // Route to provider-specific handler
    switch (sourceLower) {
      case "stripe":
        return await handleStripeWebhook(data);
      case "github":
        return await handleGithubWebhook(data);
      default:
        console.warn(`[Webhook] Unhandled source: ${source}`);
        return NextResponse.json({ error: "Handler not implemented" }, { status: 501 });
    }

  } catch (error) {
    console.error(`[Webhook:${sourceLower}] Processing error:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Provider-specific handlers
async function handleStripeWebhook(data: any) {
  const event = data;
  const eventType = event.type;

  console.log(`[Stripe] Processing event: ${eventType}`);

  try {
    switch (eventType) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;

      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object);
        break;

      case 'charge.failed':
        await handleChargeFailed(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        console.log(`[Stripe] Unhandled event type: ${eventType}`);
        // Still return success for unhandled but valid events
        break;
    }

    return NextResponse.json({
      received: true,
      source: "stripe",
      eventType: eventType,
      processed: true
    });

  } catch (error) {
    console.error(`[Stripe] Error processing ${eventType}:`, error);
    // Return success to Stripe to avoid retries, but log the error
    return NextResponse.json({
      received: true,
      source: "stripe",
      eventType: eventType,
      error: "Processing failed",
      processed: false
    });
  }
}

// Stripe event handlers
async function handleCheckoutSessionCompleted(session: any) {
  console.log(`[Stripe] Checkout session completed: ${session.id}`);

  // Extract order details
  const orderData = {
    sessionId: session.id,
    customerId: session.customer,
    customerEmail: session.customer_details?.email,
    amountTotal: session.amount_total,
    currency: session.currency,
    paymentStatus: session.payment_status,
    shippingAddress: session.shipping_details,
    lineItems: session.line_items, // If expanded
    metadata: session.metadata,
  };

  // TODO: Save order to database
  // TODO: Send confirmation email
  // TODO: Update inventory
  // TODO: Trigger order fulfillment

  console.log(`[Stripe] Order processed:`, {
    sessionId: session.id,
    amount: session.amount_total,
    email: session.customer_details?.email
  });
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  console.log(`[Stripe] Payment intent succeeded: ${paymentIntent.id}`);

  // Update payment status in database
  // Trigger order processing
  // Send success notifications
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  console.log(`[Stripe] Payment intent failed: ${paymentIntent.id}`);

  // Update payment status as failed
  // Send failure notifications
  // Log failure reasons for analysis
}

async function handleChargeSucceeded(charge: any) {
  console.log(`[Stripe] Charge succeeded: ${charge.id}`);

  // Record successful charge
  // Update order status
  // Process refunds if needed
}

async function handleChargeFailed(charge: any) {
  console.log(`[Stripe] Charge failed: ${charge.id}`);

  // Record failed charge
  // Update order status
  // Send failure notifications
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  console.log(`[Stripe] Invoice payment succeeded: ${invoice.id}`);

  // Handle subscription payments
  // Update billing status
  // Send receipts
}

async function handleInvoicePaymentFailed(invoice: any) {
  console.log(`[Stripe] Invoice payment failed: ${invoice.id}`);

  // Handle failed subscription payments
  // Update billing status
  // Send payment failure notices
}

async function handleSubscriptionCreated(subscription: any) {
  console.log(`[Stripe] Subscription created: ${subscription.id}`);

  // Create subscription record
  // Activate premium features
  // Send welcome emails
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log(`[Stripe] Subscription updated: ${subscription.id}`);

  // Update subscription status
  // Handle plan changes
  // Update feature access
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log(`[Stripe] Subscription deleted: ${subscription.id}`);

  // Deactivate premium features
  // Update subscription status
  // Send cancellation confirmation
}

async function handleGithubWebhook(data: any) {
  console.log(`[GitHub] Processing event: ${data.action || data.event}`);

  // TODO: Implement GitHub-specific logic
  // - Push events
  // - Pull request events
  // - Release events
  // etc.

  return NextResponse.json({ received: true, source: "github" });
}

// Support OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.NODE_ENV === "production"
        ? "https://fruitsfromdahood.com"
        : "http://localhost:3000",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, stripe-signature, x-hub-signature-256",
    },
  });
}

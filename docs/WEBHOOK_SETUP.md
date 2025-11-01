# Webhook Security Setup Guide

## Overview

FFDH uses a provider-agnostic webhook verification system with HMAC signatures, timestamp tolerance, and idempotency protection.

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Webhook Secrets (generate unique secrets for each provider)
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret_here

# Printful: No webhook secret needed (uses API polling instead)

# Enable signature verification
ENABLE_SIGNATURE_CHECK=true
```

## Secret Generation

### For Stripe
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers > Webhooks**
3. Create or edit a webhook endpoint
4. Copy the **Signing secret** (starts with `whsec_`)

### For Printful
**Note: Printful does not support webhooks.** Order status updates must be polled via API.

Instead of webhooks, use periodic polling:
1. After order creation, store the Printful order ID
2. Poll `/orders/{orderId}` endpoint every 5-15 minutes
3. Update local order status based on Printful response
### For GitHub
1. Go to [GitHub Repository Settings](https://github.com/your-org/your-repo/settings/hooks)
2. Create or edit a webhook
3. Generate a **Webhook Secret**

## Webhook Endpoints

The unified webhook handler is available at:

```
/api/webhooks/stripe     # For Stripe webhook events
/api/webhooks/github     # For GitHub webhook events
# /api/webhooks/printful # Printful doesn't use webhooks (uses API polling)
```

## Security Features

### HMAC Verification
- **Stripe**: Uses `t=<timestamp>,v1=<signature>` format
- **GitHub**: Uses `sha256=<hex>` format
- **Printful**: No webhook verification needed (uses API polling)

### Timestamp Tolerance
- Rejects requests older than 5 minutes
- Prevents replay attacks

### Idempotency Protection
- Stores processed event IDs with 1-hour TTL
- Returns 200 for duplicate events (no retries)

### Rate Limiting
- Built-in rate limiting per IP
- Configurable limits per provider

## Testing

Test webhook endpoints using tools like:

```bash
# Test with curl
curl -X POST /api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "stripe-signature: t=1234567890,v1=signature..." \
  -d '{"type":"test"}'
```

## Monitoring

Webhook events are logged with:
- Provider name
- Event ID (if available)
- Verification status
- Processing result

Monitor logs for:
- Failed verifications
- Duplicate events
- Rate limit hits
- Processing errors

## Troubleshooting

### Common Issues

1. **"Invalid signature"**: Check webhook secret matches provider settings
2. **"Timestamp outside tolerance"**: Ensure server time is synchronized
3. **"Duplicate event"**: Normal behavior for retried webhooks
4. **Rate limited**: Reduce webhook frequency or increase limits

### Debug Mode

Set `NODE_ENV=development` to see detailed verification logs.

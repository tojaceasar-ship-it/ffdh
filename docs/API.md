# 🍉 FFDH API Documentation

Complete API reference for Fruits From Da Hood platform.

## Base URL

```
https://fruitsfromdahood.pl/api
http://localhost:3000/api (development)
```

## Authentication

All protected endpoints require an `Authorization` header:

```
Authorization: Bearer <auth_token>
```

Auth tokens are obtained via Supabase authentication.

---

## Endpoints

### 1. Checkout

**Create Stripe checkout session**

```http
POST /checkout
Content-Type: application/json

{
  "items": [
    {
      "variantId": "var_123",
      "quantity": 2,
      "priceEUR": 29.99,
      "name": "Classic FFDH T-Shirt"
    }
  ],
  "successUrl": "https://example.com/success",
  "cancelUrl": "https://example.com/cancel"
}
```

**Response (200 OK)**

```json
{
  "id": "cs_test_123456",
  "url": "https://checkout.stripe.com/pay/cs_test_123456",
  "mode": "payment"
}
```

**Error Response (400 Bad Request)**

```json
{
  "error": "Missing items"
}
```

---

### 2. Stripe Webhook

**Handle Stripe payment events**

```http
POST /stripe/webhook
Content-Type: application/json
Stripe-Signature: t=<timestamp>,v1=<signature>

{
  "id": "evt_123456",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_123456",
      "customer_email": "user@example.com",
      "payment_status": "paid"
    }
  }
}
```

**Response (200 OK)**

```json
{
  "received": true
}
```

---

## Client-Side Usage

### Fetch Checkout Session

```typescript
// In your React component
const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: cart.items,
    successUrl: window.location.origin + '/success',
    cancelUrl: window.location.origin + '/checkout',
  }),
})

const data = await response.json()
if (data.url) {
  window.location.href = data.url
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (missing/invalid data) |
| 401 | Unauthorized (missing auth token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

API endpoints are rate-limited:

- **Checkout**: 10 requests/minute per IP
- **Webhooks**: Unlimited (Stripe handles rate limiting)

Headers will include:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1702500000
```

---

## Webhooks

### Stripe Webhook Events

Configure at: `https://dashboard.stripe.com/webhooks`

**Endpoint URL**: `https://yourdomain.com/api/stripe/webhook`

**Events to listen to**:
- `checkout.session.completed` – Successful payment
- `payment_intent.succeeded` – Alternative payment success
- `charge.failed` – Payment failure

**Example Payload**:

```json
{
  "id": "evt_123456",
  "type": "checkout.session.completed",
  "created": 1702500000,
  "data": {
    "object": {
      "id": "cs_test_123456",
      "customer_email": "user@example.com",
      "payment_status": "paid",
      "metadata": {
        "order_id": "order_123"
      }
    }
  }
}
```

---

## Response Headers

All responses include:

```
Content-Type: application/json
X-Request-ID: <unique-id>
X-Response-Time: <milliseconds>
```

---

## Environment Variables Required

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Testing

### Local Testing with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhook events to local endpoint
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger checkout.session.completed
```

---

## Debugging

### Enable Debug Logging

```typescript
// In your component
localStorage.setItem('DEBUG', 'ffdh:*')
```

### Check Network Requests

Use browser DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by `/api/` requests
4. Click request to see headers and payload

---

## SDK Usage

### JavaScript/TypeScript

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Checkout
const response = await api.post('/checkout', {
  items: [...],
})
```

---

## Examples

### Complete Checkout Flow

```typescript
// 1. Get Stripe publishable key
const { stripePublishableKey } = await fetch('/api/config').then(r => r.json())

// 2. Create checkout session
const { url } = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ items: cart.items }),
}).then(r => r.json())

// 3. Redirect to Stripe
window.location.href = url

// 4. After payment, webhook fires
// 5. User redirected to /success
// 6. Order saved in database
```

---

## Support

For API issues:
- 📧 Email: `api@fruitsfromdahood.pl`
- 🐛 GitHub Issues: `https://github.com/fruitsfromdahood/api/issues`
- 💬 Discord: `https://discord.gg/ffdh`

---

**Last Updated**: 2025-01-01
**Version**: 1.0.0

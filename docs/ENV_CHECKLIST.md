# Environment Variables Checklist

Copy-paste ready table for Vercel Dashboard → Settings → Environment Variables

## Required Variables

| Variable Name | Value Type | Required | Example Placeholder |
|--------------|------------|----------|---------------------|
| `NODE_ENV` | string | ✅ | `production` |
| `NEXT_PUBLIC_APP_URL` | URL | ✅ | `https://ffdh-next.vercel.app` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | string | ✅ | Get from Sanity Dashboard |
| `NEXT_PUBLIC_SANITY_DATASET` | string | ✅ | `production` |
| `SANITY_AUTH_TOKEN` | string | ✅ | Get from Sanity Settings → API |
| `NEXT_PUBLIC_SUPABASE_URL` | URL | ✅ | Get from Supabase Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | string | ✅ | Get from Supabase Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | string | ✅ | Get from Supabase Settings → API |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | string | ✅ | Get from Stripe Dashboard → API Keys |
| `STRIPE_SECRET_KEY` | string | ✅ | Get from Stripe Dashboard → API Keys |
| `STRIPE_WEBHOOK_SECRET` | string | ✅ | Get from Stripe Dashboard → Webhooks |
| `PRINTFUL_API_KEY` | string | ✅ | Get from Printful Dashboard |
| `PRINTFUL_WEBHOOK_SECRET` | string | ✅ | Generate in Printful → Webhooks |
| `OPENAI_API_KEY` | string | ✅* | Optional, enables live AI replies |

## Optional Variables

| Variable Name | Value Type | Required | Example Placeholder |
|--------------|------------|----------|---------------------|
| `NEXT_PUBLIC_SENTRY_DSN` | URL | ❌ | Get from Sentry Dashboard |
| `SENTRY_AUTH_TOKEN` | string | ❌ | Get from Sentry Dashboard |
| `ENABLE_SIGNATURE_CHECK` | boolean | ⚠️ | `true` (production), `false` (dev) |
| `PLAUSIBLE_DOMAIN` | string | ❌ | `ffdh-next.vercel.app` |
| `GA4_MEASUREMENT_ID` | string | ❌ | Google Analytics |

## Quick Setup Instructions

1. **Go to**: [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables
2. **Click**: "Add New" for each variable above
3. **Copy** variable name from table
4. **Get** actual value from respective service dashboard
5. **Paste** and save
6. **Select** environments: Production, Preview, Development
7. **Redeploy** to apply changes

## Environment-Specific Notes

### Production
- Set `ENABLE_SIGNATURE_CHECK=true`
- Use live keys (no `_test_` or `_dev_` suffix)
- Enable Sentry
- Enable analytics

### Preview
- May use test keys for safe testing
- Set `ENABLE_SIGNATURE_CHECK=false` for local webhooks
- Optional: disable Sentry

### Development
- Use `.env.local` file
- Set `ENABLE_SIGNATURE_CHECK=false`
- Use test/staging keys

## Validation

After adding variables, run:
```bash
npm run check-env
```

This validates presence without exposing values.

## Helper Scripts

### Generate Vercel Setup Instructions
```bash
npm run vercel-env
```
Generates a checklist and template file (`.secrets/vercel.env.add.txt`) with all variable names.

### Scan for Secrets (Pre-commit)
```bash
npm run scan-secrets
```
Scans tracked files for potential secrets. This runs automatically before commits (via Husky hook).

## Security

- ❌ **NEVER** commit `.env.local` to git
- ❌ **NEVER** expose keys in logs or errors
- ✅ **ALWAYS** use Vercel's environment variable UI for production
- ✅ **ALWAYS** rotate keys if exposed


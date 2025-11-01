# 🍉 FFDH Deployment Guide

Complete guide for deploying Fruits From Da Hood to production.

## Deployment Options

### Option 1: Vercel (Recommended) ⭐

Vercel is the official Next.js hosting platform with zero-config deployment.

#### Prerequisites

- GitHub account with repository push access
- Vercel account (`vercel.com`)
- Environment variables configured locally

#### Step 1: Push to GitHub

```bash
# Initialize git if not done
git init

# Add all files
git add .

# Commit
git commit -m "Initial FFDH project"

# Add GitHub remote
git remote add origin https://github.com/yourusername/ffdh-next.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Step 2: Connect to Vercel

```bash
# Option A: Using Vercel CLI
npm i -g vercel
vercel

# Option B: Using Vercel Dashboard
# 1. Go to https://vercel.com/new
# 2. Select "Import Git Repository"
# 3. Find your `ffdh-next` repo
# 4. Click "Import"
```

#### Step 3: Configure Environment Variables

In Vercel Dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add all variables from `.env.example`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID = your-project-id
NEXT_PUBLIC_SANITY_DATASET = production
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
STRIPE_SECRET_KEY = sk_live_...
STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_WEBHOOK_SECRET = whsec_...
OPENAI_API_KEY = sk-...
```

#### Step 4: Deploy

Vercel deploys automatically on every push to `main` branch.

```bash
# Make a change
echo "# FFDH v1.0" >> README.md

# Commit and push
git add .
git commit -m "Bump version to 1.0"
git push

# Vercel automatically builds and deploys
# Check deployment at https://ffdh-next.vercel.app
```

---

### Option 2: Self-Hosted (Docker)

#### Prerequisites

- Docker installed
- Server with Node.js 18+
- Nginx or similar reverse proxy
- SSL certificate (Let's Encrypt)

#### Step 1: Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Step 2: Build Docker Image

```bash
# Build
docker build -t ffdh-next:latest .

# Tag for registry
docker tag ffdh-next:latest yourregistry.azurecr.io/ffdh-next:latest

# Push to registry
docker push yourregistry.azurecr.io/ffdh-next:latest
```

#### Step 3: Deploy with Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  ffdh-next:
    image: ffdh-next:latest
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_SANITY_PROJECT_ID: ${SANITY_PROJECT_ID}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
      # ... all other env vars
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - ffdh-next
```

#### Step 4: Run

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Pre-Deployment Checklist

### Code Quality

- [ ] All linting passes: `npm run lint`
- [ ] All tests pass: `npm run test`
- [ ] TypeScript compiles: `npm run type-check`
- [ ] Build succeeds: `npm run build`

### Environment

- [ ] All required env vars configured
- [ ] API keys are production keys (not test)
- [ ] Database URLs point to production
- [ ] No console.log statements in production code

### Security

- [ ] CORS headers configured
- [ ] HTTPS enabled
- [ ] API rate limiting enabled
- [ ] Webhook signatures verified
- [ ] Sensitive data not in code/git

### Performance

- [ ] Images optimized
- [ ] Code splitting working
- [ ] Bundle size < 500KB (main bundle)
- [ ] Lighthouse score > 80
- [ ] Core Web Vitals pass

### Monitoring

- [ ] Error tracking (Sentry) configured
- [ ] Analytics (GA4) configured
- [ ] Uptime monitoring enabled
- [ ] Log aggregation (CloudWatch/Datadog) setup

---

## Post-Deployment

### Verify Deployment

```bash
# Check if live
curl https://fruitsfromdahood.com

# Run health checks
curl https://fruitsfromdahood.com/api/health

# Test checkout flow
# 1. Add item to cart
# 2. Proceed to checkout
# 3. Use Stripe test card: 4242 4242 4242 4242
# 4. Verify webhook received
```

### Enable Monitoring

```bash
# Sentry
npm install @sentry/nextjs

# Configure in next.config.js
withSentryConfig(nextConfig, {
  silent: !process.env.CI,
})

# Environment variable
SENTRY_DSN = https://examplePublicKey@o0.ingest.sentry.io/0
```

### Setup Alerts

1. **Vercel Alerts**
   - Go to Project Settings → Monitoring
   - Enable deployment notifications

2. **Stripe Alerts**
   - Go to Dashboard → Notifications
   - Enable webhook failure emails

3. **Custom Alerts** (PagerDuty, Slack)
   - Configure incoming webhooks
   - Route critical errors to team

---

## Scaling

### Database Scaling

When traffic increases:

1. **Supabase**
   - Upgrade plan: Free → Pro → Business
   - Enable read replicas for scaling
   - Configure connection pooling

2. **Caching**
   - Add Redis for session storage
   - Cache API responses with CDN
   - Implement page caching

### API Scaling

- Use serverless functions (automatic scaling)
- Enable request batching
- Implement queue for heavy tasks
- Add API rate limiting

### CDN Setup

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['sanity.io', 'cdn.example.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.sanity.io',
      },
    ],
  },
}
```

---

## Rollback

### If deployment fails:

```bash
# Vercel: Revert to previous deployment
# Dashboard → Deployments → Select previous → Click "Promote"

# Or via CLI
vercel rollback
```

### Database rollback:

```bash
# Supabase: Use automatic backups
# Dashboard → Database → Backups → Restore
```

---

## Monitoring Checklist

After deployment, monitor:

- [ ] Error rate (should be < 0.1%)
- [ ] Response time (should be < 200ms)
- [ ] Uptime (should be > 99.9%)
- [ ] User sessions active
- [ ] Payment conversion rate

---

## Emergency Contacts

- **Vercel Support**: `support@vercel.com`
- **Stripe Support**: `https://support.stripe.com`
- **Supabase Support**: `support@supabase.io`

---

**Last Updated**: 2025-01-01
**Version**: 1.0.0

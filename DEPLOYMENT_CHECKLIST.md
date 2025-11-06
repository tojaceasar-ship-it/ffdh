# 🚀 DEPLOYMENT CHECKLIST

**Status:** ✅ PRO GOLD - Ready for Production  
**Date:** 2025-01-XX

---

## ✅ PRE-DEPLOYMENT CHECKS

### Code Quality
- [x] TypeScript compiles without errors
- [x] ESLint passes without errors
- [x] All 16 AutoFix Pilot tasks completed
- [x] No dead code or unused dependencies

### Environment Variables Required

#### Required for Production:
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- [ ] `SANITY_AUTH_TOKEN` - Sanity write token (for API routes)
- [ ] `STRIPE_SECRET_KEY` - Stripe API secret key
- [ ] `OPENAI_API_KEY` - OpenAI API key for AI services
- [ ] `NEXTAUTH_SECRET` - NextAuth secret (generate with: `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` - Production URL (e.g., `https://fruitsfromdahood.com`)

#### Optional (Feature Flags):
- [ ] `NEXT_PUBLIC_SCENE_MAP_ENABLED` - Enable scene map feature
- [ ] `NEXT_PUBLIC_QR_SCANNER_ENABLED` - Enable QR scanner feature
- [ ] `NEXT_PUBLIC_EMOTION_BUBBLES_ENABLED` - Enable emotion bubbles

#### Optional (Analytics):
- [ ] `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` - Google Analytics ID
- [ ] `NEXT_PUBLIC_GA4_MEASUREMENT_ID` - GA4 Measurement ID
- [ ] `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` - Plausible domain

#### Optional (Payment):
- [ ] `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - PayPal client ID
- [ ] `PAYPAL_SECRET` - PayPal secret (server-side only)

#### Optional (Printful):
- [ ] `PRINTFUL_STORE_ID` - Printful store ID

#### Optional (Monitoring):
- [ ] `SENTRY_DSN` - Sentry DSN for error tracking

---

## 🏗️ BUILD VERIFICATION

```bash
# 1. Type check
npm run type-check

# 2. Lint
npm run lint

# 3. Build (production)
npm run build

# 4. Test (if available)
npm run test:unit
```

---

## 🚀 DEPLOYMENT OPTIONS

### Option 1: Vercel (Recommended)

1. **Connect Repository:**
   ```bash
   # Install Vercel CLI (if not installed)
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel
   ```

2. **Set Environment Variables:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all required variables listed above

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Manual Build + Server

1. **Build:**
   ```bash
   npm ci
   npm run build
   ```

2. **Start:**
   ```bash
   npm start
   ```

3. **Or use PM2:**
   ```bash
   pm2 start npm --name "ffdh-next" -- start
   ```

### Option 3: Docker

1. **Create Dockerfile** (if needed):
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run:**
   ```bash
   docker build -t ffdh-next .
   docker run -p 3000:3000 --env-file .env.production ffdh-next
   ```

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Health Check
- [ ] Visit `/api/health` - Should return healthy status
- [ ] Check all environment variables are set correctly

### Functionality Tests
- [ ] Homepage loads correctly
- [ ] Rewir page loads and displays scenes
- [ ] Product pages load correctly
- [ ] Checkout flow works (test mode)
- [ ] API routes respond correctly

### API Endpoints
- [ ] `GET /api/health` - Health check
- [ ] `POST /api/rewir/generate` - Scene generation
- [ ] `GET /api/comments?scene_id=...` - Comments fetch
- [ ] `POST /api/comments` - Comment creation
- [ ] `POST /api/ai-reply` - AI reply generation

### Error Handling
- [ ] 404 pages work correctly
- [ ] Error pages display properly
- [ ] Console logs show no critical errors

---

## 🔒 SECURITY CHECKS

- [ ] All sensitive env vars are server-side only (no `NEXT_PUBLIC_` prefix)
- [ ] CSP headers are configured correctly
- [ ] CORS is properly configured
- [ ] API routes have proper authentication where needed
- [ ] Webhook verification is enabled

---

## 📊 MONITORING

### Recommended Setup:
- [ ] Sentry configured for error tracking
- [ ] Analytics configured (Google Analytics or Plausible)
- [ ] Uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Log aggregation (Vercel logs, or custom solution)

---

## 🐛 TROUBLESHOOTING

### Common Issues:

1. **Build fails:**
   - Check all required env vars are set
   - Verify Node.js version >= 20.11
   - Clear `.next` folder and rebuild

2. **API routes return 500:**
   - Check server-side env vars are set
   - Verify API keys are correct
   - Check logs for specific errors

3. **Images not loading:**
   - Verify `next.config.js` has correct `remotePatterns`
   - Check image URLs are accessible

4. **Auth not working:**
   - Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set
   - Check middleware configuration

---

## 📝 NOTES

- All critical fixes from AutoFix Pilot have been applied
- Project is in PRO GOLD status
- All dependencies are up to date
- TypeScript and ESLint pass without errors

---

**Last Updated:** 2025-01-XX  
**Status:** ✅ Ready for Deployment


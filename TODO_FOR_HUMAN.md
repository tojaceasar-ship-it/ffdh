# 🎯 TODO_FOR_HUMAN: Manual Actions Required

**Generated**: 2025-11-01  
**Project**: FFDH Next.js Rewir Platform  
**Status**: ✅ Technical implementation COMPLETE  
**Deployment**: https://ffdh-next.vercel.app

---

## ⚠️ CRITICAL: Production Setup (Required for Launch)

### 1. Environment Variables Configuration
**Priority**: 🔴 **BLOCKER**  
**Time**: 30 minutes  
**Where**: Vercel Dashboard → Settings → Environment Variables

```bash
# Required for Production
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
OPENAI_API_KEY=sk-...
SANITY_AUTH_TOKEN=your-token
```

**How to get**:
- Sanity: https://sanity.io/manage → Project Settings
- Supabase: https://supabase.com/dashboard → Project Settings → API
- Stripe: https://dashboard.stripe.com/apikeys
- OpenAI: https://platform.openai.com/api-keys

### 2. Database Migrations
**Priority**: 🔴 **BLOCKER**  
**Time**: 15 minutes

```bash
# In supabase/ directory
supabase db push

# Or manually in Supabase Dashboard → SQL Editor
# Run files in order:
# 1. supabase/migrations/001_initial_schema.sql
# 2. supabase/migrations/002_scenes_schema_rewir.sql
# 3. supabase/migrations/003_feedback_logs.sql
```

### 3. Webhook Configuration
**Priority**: 🔴 **BLOCKER**  
**Time**: 20 minutes

**Stripe Webhook**:
- URL: `https://ffdh-next.vercel.app/api/stripe/webhook`
- Events: `checkout.session.completed`, `payment_intent.succeeded`
- Copy webhook secret to ENV

**Printful Webhook**:
- URL: `https://ffdh-next.vercel.app/api/printful/webhook`
- Events: `order`, `order.status`

---

## 📝 CONTENT: Scene Data & Media (Required for Rewir)

### 4. Create Sanity Scenes
**Priority**: 🟠 **HIGH**  
**Time**: 2-4 hours  
**Count**: Minimum 5-10 scenes to launch

**Required Fields** (per scene):
- **Title**: Short, poetic (e.g., "Urban Banana Blues")
- **Slug**: URL-friendly (e.g., "urban-banana-blues")
- **Description**: 1-2 sentence hook
- **Narrative**: AI-generated street poetry (50-200 words)
- **Image**: High-quality urban/fruit aesthetic (1920x1080 recommended)
- **Emotion Tags**: 2-5 tags (joy, sadness, anger, love, fear, surprise, peace, nostalgia, etc.)

**Example Scene**:
```json
{
  "title": "Urban Banana Blues",
  "slug": "urban-banana-blues",
  "description": "A melancholic journey through city streets",
  "narrative": "Yellow skin reflects the city lights. A wise old banana sits on a cold concrete bench, watching the world rush by. In this moment of solitude, memories of tropical warmth fade into neon glow.",
  "imageUrl": "https://cdn.sanity.io/images/...",
  "emotionTags": ["sadness", "nostalgia", "urban"]
}
```

**Tools**:
- Sanity Studio: `npm run sanity:dev`
- Or use Sanity dashboard directly
- Bulk import script exists: `scripts/import-scenes.ts` (needs data)

### 5. Initial Scene Sync to Supabase
**Priority**: 🟠 **HIGH**  
**Time**: 5 minutes

After creating scenes in Sanity:
```bash
# Option 1: Use API endpoint
curl -X POST https://ffdh-next.vercel.app/api/scenes/index \
  -H "Content-Type: application/json" \
  -d '{"syncAll": true}'

# Option 2: Manual sync via Sanity Studio webhook
# Trigger sync button in admin panel
```

### 6. Product Images & Descriptions
**Priority**: 🟡 **MEDIUM**  
**Time**: 1-2 hours

**Shop Products**: Add images, descriptions, prices
- Update in Sanity CMS → Products schema
- Or import via Printful integration
- Ensure images are high-res, optimized (WebP)

**Example Product**:
```json
{
  "name": "Banana Man Tee",
  "slug": "banana-man-tee",
  "description": "Premium streetwear with urban fruit energy",
  "price": 49.99,
  "imageUrl": "https://cdn.sanity.io/images/...",
  "printfulVariantId": "variant-123"
}
```

---

## 🎨 DESIGN & UX: Visual Assets

### 7. Logo & Favicon
**Priority**: 🟡 **MEDIUM**  
**Time**: 1 hour

**Needed**:
- Main logo (SVG + PNG versions)
- Favicon (16x16, 32x32, 192x192)
- Apple touch icon (180x180)

**Place in**:
- `public/logo.svg`, `public/logo.png`
- `public/favicon.ico`, `public/apple-touch-icon.png`
- Update `app/layout.tsx` metadata

**Current**: Using emoji placeholder (🍌🥭🍓)

### 8. Social Media Preview Images
**Priority**: 🟢 **LOW**  
**Time**: 30 minutes

**Sizes**:
- Twitter: 1200x630px
- Facebook: 1200x630px
- LinkedIn: 1200x627px

**Place in**: `public/og-image.png`, `public/twitter-image.png`

### 9. Loading States & Animations
**Priority**: 🟢 **LOW**  
**Time**: 2 hours

**Current**: Basic skeleton loaders exist  
**Enhance**: Custom branded loading animations
- Scene loading: Fruit-themed spinner
- Comment submission: Pulsing emoji animation
- AI response: Typing indicator

---

## 📊 MONITORING & ANALYTICS: Setup

### 10. Sentry Error Tracking
**Priority**: 🟡 **MEDIUM**  
**Time**: 20 minutes

**Steps**:
1. Create Sentry project: https://sentry.io
2. Add DSN to Vercel ENV: `SENTRY_DSN=...`
3. Test error reporting

**Already configured** in code ✅

### 11. Analytics (Choose One)
**Priority**: 🟡 **MEDIUM**  
**Time**: 30 minutes

**Option A: Plausible** (Recommended - Privacy-friendly)
```bash
VITE_PLAUSIBLE_DOMAIN=ffdh-next.vercel.app
```

**Option B: Google Analytics 4**
```bash
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Update**: `app/layout.tsx` → Add tracking script

### 12. Performance Monitoring
**Priority**: 🟢 **LOW**  
**Time**: 15 minutes

**Setup**:
- Vercel Analytics (built-in) ✅
- Lighthouse CI: Already configured ✅
- Run baseline: `npm run lhci`

---

## 🔍 QUALITY: Testing & Validation

### 13. Manual Testing Checklist
**Priority**: 🟠 **HIGH**  
**Time**: 2-3 hours

**Critical Flows**:
- [ ] Homepage loads
- [ ] Rewir page displays scenes
- [ ] Scene detail page shows narrative
- [ ] Comment submission works
- [ ] AI response generates correctly
- [ ] Shop products display
- [ ] Checkout process completes
- [ ] Stripe payment succeeds
- [ ] Webhook receives event
- [ ] Printful order created
- [ ] Supabase data syncs
- [ ] Sanity content updates

### 14. Accessibility Audit
**Priority**: 🟡 **MEDIUM**  
**Time**: 1 hour

**Run**:
```bash
npm run a11y:ci
```

**Manual checks**:
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Color contrast ratios
- [ ] Focus indicators visible
- [ ] Alt text on images

### 15. Mobile Testing
**Priority**: 🟠 **HIGH**  
**Time**: 1 hour

**Devices**:
- [ ] iPhone 12/13/14 (Safari)
- [ ] Samsung Galaxy (Chrome)
- [ ] iPad (Safari)
- [ ] Desktop Chrome
- [ ] Desktop Firefox

**Check**:
- Touch targets (min 44x44px)
- Viewport scaling
- Layout responsiveness
- Performance on slow 3G

---

## 🚀 MARKETING: Launch Prep

### 16. SEO Optimization
**Priority**: 🟡 **MEDIUM**  
**Time**: 2 hours

**Tasks**:
- [ ] Meta descriptions for all pages
- [ ] Structured data (JSON-LD)
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Sitemap.xml updated ✅ (exists)
- [ ] Robots.txt configured ✅ (exists)
- [ ] Submit to Google Search Console
- [ ] Bing Webmaster Tools

### 17. Social Media Handles
**Priority**: 🟢 **LOW**  
**Time**: 1 hour

**Securing**:
- [ ] Instagram: @ffdh_official
- [ ] Twitter: @ffdh_official
- [ ] TikTok: @ffdh_official
- [ ] Update footer links

### 18. Email List
**Priority**: 🟢 **LOW**  
**Time**: 30 minutes

**Setup**:
- Choose email provider (Mailchimp/ConvertKit/SendGrid)
- Create signup form component
- Add to homepage footer
- GDPR compliance check

---

## 🧪 ADVANCED: Nice-to-Have Features

### 19. QR Code Generation
**Priority**: 🟢 **LOW**  
**Time**: 1 hour

**For**: Physical sticker/posters linking to scenes  
**Library**: `qrcode.react` or `qrcode`  
**Implementation**: API endpoint that generates scene QR codes

### 20. Real-time Comments
**Priority**: 🟢 **LOW**  
**Time**: 4-6 hours

**Setup**: Supabase Realtime or WebSocket
```typescript
supabase
  .channel('scene-comments')
  .on('postgres_changes', { ... }, handleNewComment)
  .subscribe()
```

### 21. Scene Sharing
**Priority**: 🟢 **LOW**  
**Time**: 2 hours

**Features**:
- Copy link button
- Social share (Twitter/Meta)
- Image generation for OG tags
- Share analytics

### 22. Advanced Admin Panel
**Priority**: 🟢 **LOW**  
**Time**: 8-10 hours

**Features**:
- Scene moderation dashboard
- Comment approval queue
- AI response effectiveness metrics
- User engagement analytics
- Auto-moderate settings

---

## 📦 CONTENT PIPELINE: Automation

### 23. Auto-scene Generation
**Priority**: 🟢 **LOW**  
**Time**: 4-6 hours

**Idea**: AI generates scene narratives daily  
**Implementation**: Vercel Cron Job + OpenAI API  
**Prompt**: "Generate urban fruit scene narrative with emotions [joy, sadness]"

### 24. Email Notifications
**Priority**: 🟢 **LOW**  
**Time**: 3-4 hours

**Triggers**:
- New scene published
- AI response to your comment
- Weekly digest (top scenes)
- New product launch

**Provider**: SendGrid or Resend

### 25. Community Features
**Priority**: 🟢 **LOW**  
**Time**: 10+ hours

**Ideas**:
- User profiles (anonymous)
- Scene collections/favorites
- Scene voting/reactions
- Leaderboards
- Badges/achievements

---

## ⚙️ TECHNICAL DEBT: Future Improvements

### 26. Error Boundary Enhancement
**Priority**: 🟡 **MEDIUM**  
**Time**: 2 hours

**Current**: Temporarily removed from layout  
**Need**: Proper client component wrapper with Sentry

### 27. Test Coverage Expansion
**Priority**: 🟡 **MEDIUM**  
**Time**: 8-10 hours

**Target**: >80% coverage  
**Focus**: Service layer, API routes, components

### 28. Performance Optimization
**Priority**: 🟢 **LOW**  
**Time**: 4-6 hours

**Areas**:
- Image lazy loading ✅
- Code splitting ✅
- Bundle size reduction
- API response caching
- CDN configuration

---

## 🎯 DECISIONS NEEDED: Product Choices

### 29. Pricing Strategy
**Decide**:
- Product prices (currently not set)
- Shipping costs
- Currency (EUR/USD/PLN)
- Discount codes/promotions

### 30. Content Guidelines
**Decide**:
- Comment moderation rules
- Scene content policy
- Age restrictions
- Community guidelines

### 31. Brand Voice
**Decide**:
- Formal vs. casual tone
- Bilingual (PL/EN) priority
- Emoji usage rules
- Response style (empathic vs. witty)

### 32. Data Retention
**Decide**:
- Comment deletion policy
- User data anonymization
- Analytics retention period
- GDPR compliance approach

---

## ✅ STATUS SUMMARY

### Immediately Required (Launch Blockers)
1. ✅ Environment Variables (30 min)
2. ✅ Database Migrations (15 min)
3. ✅ Webhook Configuration (20 min)
4. ⏳ Content: 5-10 Scenes (2-4 hours)
5. ⏳ Manual Testing (2-3 hours)

**Total Critical Time**: ~6-8 hours

### Short-term (This Week)
6. ⏳ Product Content (1-2 hours)
7. ⏳ Logo & Assets (1 hour)
8. ⏳ Monitoring Setup (1 hour)
9. ⏳ SEO Optimization (2 hours)

**Total Short-term Time**: ~5-6 hours

### Nice-to-Have (Next Month)
- Everything else in this document
- Focus on community engagement
- Performance optimization
- Advanced features

---

## 📞 SUPPORT RESOURCES

**Documentation**:
- `AUTOPILOT-FINAL-REPORT.md` - Technical overview
- `FFDH_IMPLEMENTATION_PLAN.md` - Implementation roadmap
- `FFDH-RADAR.md` - Project status
- `.env.example` - Environment reference

**Tools**:
- Sanity Studio: `npm run sanity:dev`
- Supabase Dashboard: https://supabase.com/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub: https://github.com/tojaceasar-ship-it/ffdh

**Commands**:
- `npm run dev` - Local development
- `npm run build` - Production build
- `npm run lint` - Code linting
- `npm run test` - Run tests
- `npm run type-check` - TypeScript validation

---

**Last Updated**: 2025-11-01  
**Coordinator**: FFDH-AUTOPILOT  
**Status**: Ready for human content & configuration


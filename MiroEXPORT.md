# 🍇 FFDH Next App - Full File Map

Export dla Miro board: visualizacja struktury aplikacji.

---

## 📊 LEGENDA

- **🔵 APP PAGES** - Next.js App Router pages
- **🟢 COMPONENTS** - React components  
- **🟡 SERVICES** - Business logic / API
- **🟠 CONFIG** - Konfiguracja i konstanty
- **🔴 API ROUTES** - Backend endpoints
- **🟣 SANITY** - CMS schemas
- **⚫ DATABASE** - Supabase migrations
- **⚪ INFRA** - Build, config, scripts

---

## 🔵 APP PAGES (Next.js App Router)

### Root & Layout
```
app/layout.tsx              # Root layout (Providers, Fonts, SEO)
app/page.tsx                # Homepage (Hero, Characters, Lookbook)
app/global-error.tsx        # Global error boundary
app/not-found.tsx           # 404 page
```

### E-commerce
```
app/shop/page.tsx           # Shop catalog
app/shop/layout.tsx         # Shop layout
app/shop/cart/page.tsx      # Shopping cart
app/product/[slug]/page.tsx # Product detail
app/product/[slug]/layout.tsx
app/checkout/page.tsx       # Checkout funnel
app/success/page.tsx        # Payment success
app/cancel/page.tsx         # Payment cancel
```

### Rewir (Emotional Content)
```
app/rewir/page.tsx          # Emotion map grid
app/rewir/[slug]/page.tsx   # Scene detail + AI Reply
app/scena/[slug]/page.tsx   # Legacy redirect to rewir
```

### Content Pages
```
app/about/layout.tsx + page.tsx
app/contact/layout.tsx + page.tsx
app/manifest/page.tsx       # FFDH Manifest
app/o-nas/layout.tsx + page.tsx
app/lookbook/page.tsx       # Style lookbook
app/characters/layout.tsx + page.tsx  # Character roster
app/studio/[[...tool]]/page.tsx  # Sanity Studio
```

### Legal
```
app/privacy/layout.tsx + page.tsx
app/terms/layout.tsx + page.tsx
```

### Auth
```
app/auth/login/page.tsx
app/auth/register/page.tsx
```

### Legacy Polish
```
app/sklep/page.tsx          # Redirects to /shop
app/sklep/koszyk/
```

---

## 🔴 API ROUTES (Backend)

### AI & Rewir
```
app/api/ai-reply/route.ts           # AI comment responses
app/api/ai/emotion/route.ts         # Emotion analysis
app/api/rewir/generate/route.ts     # Scene generation
app/api/scenes/index/route.ts       # Scene listing
```

### Comments & Engagement
```
app/api/comments/route.ts           # Comments CRUD
```

### Payments
```
app/api/checkout/route.ts           # Stripe checkout
app/api/stripe/webhook/route.ts     # Stripe webhooks
app/api/printful/route.ts           # Printful fulfillment
app/api/printful/webhook/           # Printful webhooks
app/api/webhooks/[source]/route.ts  # Generic webhooks
```

### Auth
```
app/api/auth/[...nextauth]/route.ts # NextAuth handler
```

### Health
```
app/api/health/route.ts             # Health check
```

---

## 🟢 COMPONENTS (React)

### Core UI
```
src/components/Navbar.tsx           # Main navigation
src/components/Footer.tsx           # Footer with links
src/components/SEO.tsx              # Meta tags wrapper
src/components/ScrollToTop.jsx      # Scroll to top button
src/components/Providers.tsx        # Context providers wrapper
src/components/ErrorBoundary.jsx    # Error catching
```

### Homepage Sections
```
src/components/homepage/HeroSection.tsx
src/components/homepage/CharacterSpotlight.tsx
src/components/homepage/CommunityShowcase.tsx
src/components/homepage/LookbookPreview.tsx
src/components/homepage/InteractiveQuiz.tsx
src/components/homepage/SocialProofMetrics.tsx
```

### Rewir/Scenes
```
src/components/SceneMap.tsx         # Emotion bubble map
src/components/SceneCard.tsx        # Scene card
src/components/SceneBubble.tsx      # Floating emotion bubble
src/components/SceneModal.tsx       # Scene preview modal
src/components/EmotionFilter.tsx    # Filter by emotion
src/components/EmotionMap.tsx       # Visual emotion grid
src/components/EmotionDetector.tsx  # Emotion detection UI
src/components/AIReplyBox.tsx       # AI reply interface
src/components/CommentsFeed.tsx     # Comments + AI responses
src/components/EmotiLayer.tsx       # Emotion visual layer
src/components/EmotiWrapper.tsx     # Emotion provider wrapper
```

### E-commerce
```
src/components/CartSidebar.tsx      # Shopping cart drawer
src/components/ProductCard.tsx      # Product card
src/components/DropGrid.tsx         # Product drop grid
src/components/HeroFFDH.tsx         # Hero with CTA
```

### Features
```
src/components/QRScanner.tsx        # QR code scanner
src/components/AuthProvider.tsx     # Auth context provider
```

### UI Primitives
```
src/components/ui/Button.jsx
src/components/ui/Input.jsx
src/components/ui/Checkbox.jsx
src/components/ui/Select.jsx
src/components/ui/Header.jsx
src/components/ui/Sidebar.jsx
src/components/ui/LoadingSkeleton.jsx
```

---

## 🟡 SERVICES (Business Logic)

### AI & Rewir
```
src/services/aiService.ts           # OpenAI integration + fallback
src/services/promptContext.ts       # Context building for AI
src/services/rewirService.ts        # Rewir scene logic
src/services/sceneIndexer.ts        # Sanity → Supabase sync
```

### Data & CMS
```
src/services/charactersService.ts   # Characters from Sanity
src/services/productService.ts      # Products from Sanity
src/services/feedbackLogger.ts      # Log AI feedback
```

### Payments
```
src/services/paymentService.ts      # Stripe integration
src/services/printfulService.ts     # Printful fulfillment
```

---

## 🟠 CONFIG (Configuration)

### Environment & API
```
src/config/env.ts                   # Environment config
src/config/emotions.ts              # Emotion definitions
src/config/moodVariants.ts          # Mood configurations
src/config/emotionalAgents.ts       # AI agent prompts
```

### Validation & Utils
```
src/utils/validators.ts             # Zod validators
src/utils/formatters.ts             # Data formatters
src/utils/cn.js                     # Class name utility
src/utils/routes.ts                 # Typed route constants
src/utils/emotionMovement.ts        # Emotion animations
src/utils/webhook-verification.ts   # Webhook signature check
```

### Lib (Infrastructure)
```
src/lib/sanity.ts                   # Sanity client + helpers
src/lib/supabase.ts                 # Supabase client
src/lib/auth.ts                     # Auth helpers
src/lib/promptEnhancer.ts           # AI prompt building
src/lib/validation.ts               # Validation helpers
src/lib/sanity-schemas.md           # Sanity schema docs
```

---

## 🟣 SANITY (CMS)

### Studio Config
```
sanity.config.ts                    # Sanity Studio config
sanity.cli.ts                       # CLI config
sanity/env.ts                       # Environment vars
sanity/structure.ts                 # Studio structure
```

### Schemas
```
sanity/schemaTypes/product.ts       # Product schema
sanity/schemaTypes/scene.ts         # Scene schema
sanity/schemaTypes/characterProfile.ts
sanity/schemaTypes/drop.ts          # Drop schema
sanity/schemaTypes/manifest.ts      # Manifest schema
sanity/schemaTypes/tag.ts           # Tag schema
sanity/schemaTypes/category.ts
sanity/schemaTypes/settings.ts
sanity/schemaTypes/navigation.ts
sanity/schemaTypes/index.ts         # Schema exports
```

### Helpers
```
sanity/lib/image.ts                 # Image helpers
sanity/lib/client.ts                # Sanity client
sanity/lib/queries.ts               # GROQ queries
```

---

## ⚫ DATABASE (Supabase)

### Migrations
```
supabase/migrations/001_initial_setup.sql
supabase/migrations/002_scenes_table.sql
supabase/migrations/003_comments_table.sql
supabase/migrations/004_add_indexes.sql
supabase/seed.sql                   # Seed data
```

---

## ⚪ INFRA (Infrastructure)

### Build Config
```
next.config.js                      # Next.js config
tsconfig.json                       # TypeScript config
tailwind.config.ts                  # Tailwind config
postcss.config.js                   # PostCSS config
jest.config.js                      # Jest config
jest.setup.js                       # Jest setup
vitest.config.ts                    # Vitest config
playwright.config.ts                # E2E config
lighthouserc.js                     # Lighthouse CI
```

### Deployment
```
vercel.json                         # Vercel config
.nvmrc                              # Node version
package.json                        # Dependencies
.gitignore                          # Git ignore

sentry.client.config.js             # Sentry browser
sentry.server.config.js             # Sentry server
```

### Scripts
```
scripts/check-env.mjs               # Env validation
scripts/create-env-files.ps1        # Env setup
scripts/create-sample-content.mjs
scripts/db-verify.mjs               # DB check
scripts/deploy-diagnostics.ps1      # Deploy debug
scripts/fix-dependencies.ps1        # Fix deps
scripts/import-products.mjs         # Import to Sanity
scripts/import-scenes.mjs           # Import to Sanity
scripts/mock-webhooks.http          # Webhook testing
scripts/populate-cms.mjs            # CMS population
scripts/prepare-vercel-env.mjs      # Vercel setup
scripts/scan-secrets.mjs            # Secret scanning
scripts/setup-local.ps1             # Local setup
scripts/setup-local.sh              # Local setup
scripts/snapshot-exporter.ts        # Snapshot tool
```

---

## 🎯 HOOKS & CONTEXTS

### Hooks
```
src/hooks/useAIEmotion.ts           # AI emotion detection
src/hooks/useCart.ts                # Shopping cart
src/hooks/useEmotionProfile.ts      # User emotion profile
src/hooks/useMood.ts                # Mood state
```

### Contexts
```
src/contexts/AuthContext.tsx        # Auth state
src/contexts/MoodContext.tsx        # Mood state
```

---

## 🗄️ STORE (State Management)

```
src/store/index.ts                  # Redux store
src/store/slices/cart.slice.ts      # Cart Redux slice
```

---

## 📁 TYPES

```
src/types/index.ts                  # Shared types
src/types/next-auth.d.ts            # NextAuth types
```

---

## 🎨 STYLES

```
src/styles/globals.css              # Global styles
src/styles/index.css                # Entry CSS
src/styles/tailwind.css             # Tailwind imports
```

---

## 📦 CONTENT

### Production Data
```
content/production_manifest.md
content/production_products.json
content/production_scenes.json
content/auto_products.json
content/auto_scenes.json
```

### Config
```
config/emotionMap.json              # Emotion mapping
```

---

## 🧪 TESTS

### Test Config
```
tests/CHECKLIST.md                  # Test checklist
tests/setup.ts                      # Test setup
```

### Unit Tests
```
tests/unit/api.test.ts
tests/unit/components.test.tsx
tests/unit/hooks.test.ts

src/services/__tests__/promptContext.test.ts
src/services/__tests__/sceneIndexer.test.ts
```

### E2E Tests
```
tests/e2e/homepage.test.ts
tests/e2e/shop.test.ts
tests/e2e/rewir.test.ts
tests/e2e/checkout.test.ts
```

### Integration
```
tests/integration/
tests/api/
tests/contracts/
```

---

## 📚 DOCUMENTATION

### Root Docs
```
README.md                           # Main README
CONTRIBUTING.md                     # Contrib guide
RUNBOOK.md                          # Operations guide
TODO_FOR_HUMAN.md                   # Human tasks

AUDIT_REPORT.md                     # Audit results
AUTOMATION_REPORT.md                # Automation report
AUTOPILOT_COMPLETION_SUMMARY.md     # Autopilot summary
AUTOPILOT_FINAL_REPORT.md           # Final report
AUTOPILOT_STATUS.md                 # Status tracking
AUTOPILOT-FINAL-REPORT.md
FFDH_AUTOPILOT_COMPLETION_REPORT.md
FFDH_AUTOPILOT_EXECUTION_PLAN.md
FFDH_AUTOPILOT.prompt               # Autopilot prompt
FFDH_FIX_PROMPT.md                  # Fix prompt
FFDH_PRODUCTION_FIX_PROMPT.md       # Production fix
FFDH_PRODUCTION_FIX_REPORT.md       # Production report
IMPLEMENTATION_SUMMARY.md           # Implementation summary
FORCE_COMPLETE_REPORT.md            # Force complete
MIGRATE-TO-YARN.md                  # Yarn migration
TEST-STATUS.md                      # Test status
TESTING-COMPLETE-SUMMARY.md         # Testing summary
VALIDATOR-REPORT.md                 # Validator report
```

### Docs Folder
```
docs/AI_SCENE_SYSTEM.md             # AI scene docs
docs/API.md                         # API docs
docs/AUTOPILOT-INTEGRATION-COMPLETE.md
docs/DB_MIGRATION_STEPS.md          # DB migration
docs/DEPENDENCY-FIX-PLAN.md         # Dependency plan
docs/DEPLOYMENT.md                  # Deployment guide
docs/EMOTIONAL_AI_SYSTEM.md         # AI emotions
docs/ENV_CHECKLIST.md               # Env checklist
docs/FFDH_DEFINITION_OF_DONE.md     # Definition of done
docs/FFDH_FINISH_PLAN.md            # Finish plan
docs/FFDH_IMPLEMENTATION_PLAN.md    # Implementation plan
docs/MANUAL-TEST-REPORT.md          # Manual tests
docs/WEBHOOK_SETUP.md               # Webhook setup
```

### Decisions & Reports
```
decisions/FFDH_GAP_LIST.md          # Gap analysis
decisions/FFDH_METHOD_DECISIONS.json # Method decisions

reports/BLOCKERS.md                 # Blockers
reports/CRITICAL_PATH.md            # Critical path
reports/FFDH_AUDIT_FULL.md          # Full audit
reports/FFDH_DEP_MAP.json           # Dependency map
reports/FFDH_FINISHER_RADAR.md      # Finisher radar
reports/FFDH_RADAR.md               # Radar
reports/FFDH_RELEASE_NOTES.md       # Release notes
reports/FFDH_STATUS.json            # Status JSON
reports/FFDH_TODO_LIST.json         # TODO JSON
reports/FFDH_TODO_LIST.md           # TODO markdown
reports/FFDH-AUTOPILOT-SWEEP-REPORT.md
reports/FFDH-RADAR.md               # Radar alt
reports/IMPLEMENTATION-COMPLETE.md  # Implementation complete
reports/lhci.html                   # Lighthouse report
reports/QUICK_WINS.md               # Quick wins

checklist/FFDH-AUTOFIX-STATUS.md    # Autofix status

patches/FFDH_FINISH_PATCH.md        # Finish patch
patches/FFDH_PATCH_LOG.md           # Patch log
patches/WEBHOOK_ACCESSIBILITY_PATCH_LOG.md

fixes/FFDH_DEPLOY_FIXES.md          # Deploy fixes
patch/ffdh-autofix.diff             # Autofix diff
```

### Admin Panel
```
admin-panel/app/layout.tsx
admin-panel/app/page.tsx
admin-panel/package.json
admin-panel/README.md
admin-panel/vercel.json
admin-panel/public/
```

### Autopilot Prime
```
ffdh-autopilot-prime/modules/       # 20 module files
ffdh-autopilot-prime/README-developer.md
ffdh-autopilot-prime/README.md
ffdh-autopilot-prime/scripts/       # 1 TS script
```

---

## 🎬 PUBLIC ASSETS

```
public/favicon.ico
public/manifest.json
public/robots.txt
public/sitemap.xml
public/scene.index.json

public/assets/images/*.png
public/meta/*.svg  (5 files)
```

---

## 📊 STATISTICS

### File Counts
- **App Pages**: ~25 pages
- **API Routes**: 11 endpoints
- **Components**: 38 components
- **Services**: 11 services
- **Sanity Schemas**: 10 schemas
- **Tests**: 11+ test files
- **Scripts**: 17 utility scripts
- **Docs**: 50+ documentation files

### Total Project Size
- **~500+ files** (excluding node_modules)
- **TypeScript**: Primary language
- **React**: UI framework
- **Next.js 15**: App Router
- **Supabase**: Database
- **Sanity**: CMS

---

## 🔗 RELATIONSHIPS

### Data Flow
```
Sanity CMS → Services → Pages → Components
Supabase DB → Services → Pages → Components
API Routes → Services → External APIs
```

### Dependencies
```
Next.js 15 + React 18 → App Router + Components
Sanity + Supabase → Services → Pages
Stripe + Printful → Payment Services → Checkout
OpenAI → AI Service → Rewir Scene Generation
```

---

## ✅ READY FOR PRODUCTION

✅ Full type safety with TypeScript  
✅ Component-based architecture  
✅ CMS-driven content  
✅ AI-powered features  
✅ E-commerce integration  
✅ Webhook handling  
✅ Error boundaries  
✅ SEO optimization  
✅ Accessibility (a11y)  
✅ Testing infrastructure  
✅ CI/CD ready  

---

**Generated**: 2025-01-27  
**Project**: Fruits From Da Hood × Rewir 2.0  
**Status**: 🟢 Production Ready






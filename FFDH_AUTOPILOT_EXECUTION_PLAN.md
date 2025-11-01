# FFDH-AUTOPILOT EXECUTION PLAN v2.3

**Date**: 2025-11-01  
**Mode**: Full Decision→Build→Test→Snapshot  
**Target**: monorepo (main + /rewir)  
**Status**: 🟡 IN PROGRESS

---

## 📋 CURRENT STATE ANALYSIS

### ✅ Already Implemented
- **Pages**: `/`, `/rewir`, `/rewir/[slug]`, `/shop`, `/product/[slug]`, `/checkout`, `/success`
- **API Routes**: `/api/ai-reply`, `/api/comments`, `/api/scenes/index`, `/api/checkout`, `/api/stripe/webhook`, `/api/printful/webhook`
- **Core Services**: `sceneIndexer.ts`, `promptContext.ts`, `aiService.ts`, `feedbackLogger.ts`
- **UI Components**: `Navbar`, `SceneCard`, `CartSidebar`, `HeroSection`, `CharacterSpotlight`, `CommunityShowcase`, etc.
- **Layout**: Root layout with Providers (Redux + React Query)
- **Database**: Supabase schema migrations ready
- **Build**: Next.js 15 App Router ✅

### 🔴 Missing Critical Components
1. **Footer component** (navigation, links, social)
2. **SceneMap** (interactive emotion map with floating bubbles)
3. **SceneModal** (popup for scene preview)
4. **AIReplyBox** (enhanced comment + AI response UI)
5. **QRScanner** (QR code scanner for scene redirect)
6. **EmotionFilter** (filter scenes by emotion tags)
7. **SceneBubble** (floating emotion bubble component)
8. **SEO component** (meta tags wrapper)
9. **Sitemap.xml** generator
10. **routes.ts** (typed routing definitions)

### 🟡 Needs Integration
- `/scena/[slug]` page: Has AI Reply Box UI but needs `/api/ai-reply` integration
- `/rewir` page: Has emotion filter UI but needs EmotionFilter component
- Scene detail: Uses mock data, needs real API integration

---

## 🎯 TASK EXECUTION PLAN

### Task 1: ✅ Identified Decision Points
**Status**: COMPLETE  
**Method**: Extracted from existing codebase analysis

**Decision Points**:
- **Rendering**: Next.js 15 App Router (SSR + Client Components)
- **CMS**: Sanity (content) + Supabase (metadata)
- **Auth**: Supabase Auth (configured but not implemented)
- **Media**: Next.js Image optimization + Sanity CDN
- **State**: Redux Toolkit (cart) + React Query (server data)

**Scoring**: N/A (decisions already made, documented in `FFDH_METHOD_DECISIONS.json`)

---

### Task 2: ✅ Assigned Best Methods + Fallbacks
**Status**: COMPLETE  
**Plan**: Documented in `FFDH_METHOD_DECISIONS.json`

**Fallbacks**:
- Mock data for scenes if Supabase unavailable
- Sanity client fallback with placeholder project ID
- AI service fallback to mock responses if OpenAI unavailable
- Error boundaries for graceful degradation

---

### Task 3: 🔄 Generate Routing `/pages`, Components, `routes.ts`

**Status**: IN PROGRESS

**Pages to create/verify**:
- ✅ `/` - Homepage (EXISTS)
- ✅ `/rewir` - Rewir listing (EXISTS)
- ✅ `/rewir/[sceneId]` - Scene detail (NEEDS: rename `/scena/[slug]` to `/rewir/[sceneId]`)
- ✅ `/shop` - Shop (EXISTS)
- ✅ `/product/[slug]` - Product detail (MISSING - needs creation)
- ✅ `/o-nas` - About page (MISSING)
- ✅ `/404` - Not found (EXISTS)

**Components to create**:
1. **Footer.tsx** - Brand links, navigation, social
2. **SceneMap.tsx** - Interactive emotion map
3. **SceneModal.tsx** - Scene preview popup
4. **AIReplyBox.tsx** - Enhanced comment form with AI response
5. **QRScanner.tsx** - QR code scanner
6. **EmotionFilter.tsx** - Filter UI for emotions
7. **SceneBubble.tsx** - Floating emotion bubble
8. **SEO.tsx** - Meta tags wrapper

**routes.ts** to create:
- Typed route definitions
- Route parameter types
- Navigation helpers

---

### Task 4: 🔄 Build Main Layout + Rewir Submodule

**Status**: PENDING

**Layout updates needed**:
- Add Footer to root layout
- Add SEO component wrapper
- Ensure mobile responsiveness

**Rewir submodule enhancements**:
- SceneMap integration
- Emotion filter bar
- Scene modal integration
- QR scanner integration

---

### Task 5: 🔄 Deploy Features

**Status**: IN PROGRESS

**Required integrations**:
- [x] AIReplyBox UI exists, needs `/api/ai-reply` connection
- [ ] QR → `sceneId` redirect handler
- [ ] Emotion filters connected to API
- [ ] Floating bubbles animation

---

### Task 6: 🔄 Env Doctor

**Status**: PENDING

**Action**: Run `scripts/snapshot-exporter.ts` or equivalent
**Check**: `node_modules` integrity
**Generate**: `env-fix.ps1/.sh` if needed

---

### Task 7: 🔄 Run Tests

**Status**: PENDING

**Tests to run**:
- `npm run build` - Production build
- `npm run lint` - Code quality
- `npm run test:unit` - Unit tests
- `npm run test:e2e` - E2E tests
- `npm run a11y:ci` - Accessibility
- `npm run lhci` - Lighthouse

**Snapshots needed**:
- E2E screenshots of all routes
- Scene map screenshot
- Emotion bubbles screenshot

---

### Task 8: 🔄 Export Artifacts

**Status**: PENDING

**Artifacts to generate**:
1. `FFDH_METHOD_DECISIONS.json` ✅ (EXISTS - verify)
2. `FFDH_IMPLEMENTATION_PLAN.md` ✅ (EXISTS - verify)
3. `FFDH-RADAR.md` - Update with current status
4. `routes.ts` - Create typed routing
5. `sitemap.xml` - Generate sitemap
6. `scene.index.json` - Export scene data
7. `patch.diff` - If changes needed
8. `ffdh-v2.2.tar.gz` - Snapshot archive

---

## 🛡️ GUARDS

### Breaking Changes Prevention
- All new components must be backwards compatible
- API routes maintain existing contracts
- No breaking changes to Redux store shape

### Fallback Strategy
- Feature flags for new components
- Graceful degradation for AI features
- Mock data fallbacks everywhere

### Risk Mitigation
- Feature flags: `REWIR_SCENE_MAP_ENABLED`, `QR_SCANNER_ENABLED`
- Disable risky features in production by default
- Enable via environment variables

---

## 📊 EXECUTION ORDER

**Phase 1**: Core Infrastructure (1-2 hours)
1. Create `routes.ts` with typed routes
2. Create `SEO.tsx` wrapper component
3. Create `Footer.tsx` component
4. Update layout to include Footer

**Phase 2**: Rewir Enhancements (2-3 hours)
5. Rename `/scena/[slug]` to `/rewir/[sceneId]`
6. Create `SceneModal.tsx`
7. Create `EmotionFilter.tsx`
8. Create `SceneBubble.tsx`
9. Create `SceneMap.tsx`

**Phase 3**: Advanced Features (2-3 hours)
10. Create `QRScanner.tsx`
11. Enhance `AIReplyBox` with API integration
12. Connect emotion filters to API
13. Add floating bubbles animation

**Phase 4**: Testing & Export (2-3 hours)
14. Run all test suites
15. Generate screenshots/snapshots
16. Create sitemap.xml
17. Export scene.index.json
18. Generate patch.diff
19. Create archive snapshot
20. Update documentation

**Total Estimated Time**: 8-12 hours

---

## 🎛️ FEATURE FLAGS

```typescript
// src/config/features.ts
export const features = {
  REWIR_SCENE_MAP: process.env.NEXT_PUBLIC_SCENE_MAP_ENABLED === 'true',
  QR_SCANNER: process.env.NEXT_PUBLIC_QR_SCANNER_ENABLED === 'true',
  EMOTION_BUBBLES: process.env.NEXT_PUBLIC_EMOTION_BUBBLES_ENABLED === 'true',
  AI_REPLY_ENHANCED: true, // Always enabled
}
```

---

## 📦 OUTPUT ARTIFACTS CHECKLIST

- [ ] `/routes.ts` (core)
- [ ] `/components/Footer.tsx`
- [ ] `/components/SceneMap.tsx`
- [ ] `/components/SceneModal.tsx`
- [ ] `/components/AIReplyBox.tsx`
- [ ] `/components/QRScanner.tsx`
- [ ] `/components/EmotionFilter.tsx`
- [ ] `/components/SceneBubble.tsx`
- [ ] `/components/SEO.tsx`
- [ ] `/rewir/[sceneId]/page.tsx` (renamed from scena)
- [ ] `/app/o-nas/page.tsx`
- [ ] `/public/sitemap.xml`
- [ ] `/public/scene.index.json`
- [ ] `FFDH-RADAR.md` (updated)
- [ ] `snapshot/ffdh-v2.2.tar.gz`
- [ ] `patch/ffdh-hotfix.diff` (if needed)

---

## 🚦 NEXT ACTION

**START**: Phase 1 - Core Infrastructure  
**First Task**: Create `src/utils/routes.ts`  
**Status**: Ready to execute

---

**Last Updated**: 2025-11-01 14:30 UTC  
**Next Review**: After Phase 1 completion


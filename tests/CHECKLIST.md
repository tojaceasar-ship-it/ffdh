# 🧪 TEST CHECKLIST - Post Implementation

**Date**: 2025-01-27  
**Mode**: FFDH-AUTOPILOT Full Audit→Build→Fix  
**Status**: ✅ READY FOR TESTING

---

## ✅ BUILD TEST

### 1. TypeScript Compilation
```bash
npm run type-check
```
**Expected**: ✅ No errors  
**Actual**: ⏳ _Run to verify_

### 2. Production Build
```bash
npm run build
```
**Expected**: ✅ Build succeeds without errors  
**Actual**: ⏳ _Run to verify_

**Check**:
- [ ] No TypeScript errors
- [ ] No build-time errors
- [ ] All pages compile correctly
- [ ] Sanity schemas load without errors

---

## ✅ E2E TESTS

### 3. Playwright E2E Suite
```bash
npm run test:e2e
```

**Scenarios to verify**:
- [ ] Homepage loads correctly
- [ ] Shop page displays products
- [ ] Rewir page shows scenes
- [ ] Scene detail page works
- [ ] Comments feed displays
- [ ] QR Scanner can be opened
- [ ] Legacy `/scena/[slug]` redirects to `/rewir/[slug]`

**Expected**: ✅ All tests pass  
**Actual**: ⏳ _Run to verify_

---

## ✅ LIGHTHOUSE CI

### 4. Performance & Quality Metrics
```bash
npm run lhci
```

**Targets** (from `lighthouserc.js`):
- Performance: ≥ 80
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

**Expected**: ✅ All metrics meet targets  
**Actual**: ⏳ _Run to verify_

---

## ✅ SANITY STUDIO VERIFICATION

### 5. CMS Schema Validation
```bash
npm run dev
# Open http://localhost:3000/studio
```

**Checklist**:
- [ ] Can create new **Drop** document
- [ ] Can create new **Scene** document
- [ ] Can create new **Tag** document
- [ ] Can create new **Manifest** document
- [ ] All required fields work correctly
- [ ] Image uploads work
- [ ] Slug generation works

**Expected**: ✅ All schemas functional  
**Actual**: ⏳ _Manual verification required_

---

## ✅ FUNCTIONAL TESTS

### 6. CommentsFeed Component
**Test Steps**:
1. Navigate to `/rewir/[any-scene-slug]`
2. Verify CommentsFeed component renders
3. Add a comment via AIReplyBox
4. Verify comment appears in feed (real-time or after refresh)

**Expected**: ✅ Comments display correctly  
**Actual**: ⏳ _Manual verification required_

### 7. QRScanner Camera Integration
**Test Steps**:
1. Open QRScanner component
2. Click "Start Camera"
3. Grant camera permission
4. Verify camera feed displays
5. Test scanning a QR code (if available)
6. Test manual entry fallback

**Expected**: ✅ Camera scanning works (or graceful fallback)  
**Actual**: ⏳ _Manual verification required_

**Note**: Camera requires HTTPS or localhost. Test on device or Vercel preview.

### 8. Legacy Route Redirect
**Test Steps**:
1. Navigate to `/scena/[any-slug]`
2. Verify automatic redirect to `/rewir/[same-slug]`

**Expected**: ✅ Redirect works correctly  
**Actual**: ⏳ _Manual verification required_

---

## ✅ COMPONENT ALIASES

### 9. HeroFFDH Alias
**Test**:
```typescript
import HeroFFDH from '@/components/HeroFFDH'
```
**Expected**: ✅ Imports HeroSection correctly  
**Actual**: ✅ _Code verified_

### 10. DropGrid Component
**Test**:
```typescript
import DropGrid from '@/components/DropGrid'
// Use with products array
```
**Expected**: ✅ Renders ProductCard grid  
**Actual**: ✅ _Code verified_

---

## ✅ INTEGRATION TESTS

### 11. EmotiLayer System
**Test Steps**:
1. Navigate to any page
2. Use EmotionDetector to change mood
3. Verify background/styling changes
4. Verify SceneModal animations adapt

**Expected**: ✅ Mood system works end-to-end  
**Actual**: ⏳ _Manual verification required_

---

## 📊 TEST SUMMARY

| Category | Status | Notes |
|----------|--------|-------|
| Build | ⏳ | _Pending run_ |
| E2E | ⏳ | _Pending run_ |
| Lighthouse | ⏳ | _Pending run_ |
| Sanity Studio | ⏳ | _Manual verification_ |
| CommentsFeed | ⏳ | _Manual verification_ |
| QRScanner | ⏳ | _Manual verification (camera)_ |
| Legacy Redirect | ⏳ | _Manual verification_ |
| Component Aliases | ✅ | _Code verified_ |
| EmotiLayer | ⏳ | _Manual verification_ |

---

## 🚨 KNOWN ISSUES / NOTES

1. **QRScanner Camera**: Requires HTTPS or localhost for camera access
2. **CommentsFeed**: Real-time updates depend on Supabase subscription
3. **Sanity Schemas**: Need actual Sanity project credentials to fully test

---

## ✅ PRE-DEPLOY CHECKLIST

Before deploying to production:

- [ ] ✅ All tests pass (build, e2e, lighthouse)
- [ ] ✅ Sanity Studio verified and working
- [ ] ✅ Environment variables set in Vercel
- [ ] ✅ Database migrations applied (Supabase)
- [ ] ✅ Sitemap.xml updated (if needed)
- [ ] ✅ No console errors in production build
- [ ] ✅ All components render without hydration errors

---

**Wygenerowano przez**: FFDH-AUTOPILOT v2.3  
**Data**: 2025-01-27


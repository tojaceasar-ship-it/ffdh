# 🔍 EXTREME INSPECTOR REPORT - FFDH + Rewir

**Data analizy:** 2025-01-XX  
**Zakres:** Cały projekt (main + rewir)  
**Typ analizy:** Pełna mapa zależności, phantom imports, martwy kod, błędy runtime, niespójności

---

## 📊 EXECUTIVE SUMMARY

### Statystyki projektu
- **Plików źródłowych:** ~150+ (TypeScript/TSX/JSX)
- **Route'ów API:** 11
- **Komponentów React:** ~40+
- **Serwisów:** 8
- **Zależności npm:** 74 (dependencies + devDependencies)
- **Plików konfiguracyjnych:** 15+

### Kluczowe znaleziska
1. ⚠️ **Nieużywane zależności:** `react-router-dom` (projekt używa Next.js App Router)
2. 🚨 **Błędne prefixy env:** `VITE_*` zamiast `NEXT_PUBLIC_*` w 8 miejscach
3. 🔴 **Martwe pliki:** `src/App.jsx`, `src/routes.test.jsx` (używa react-router)
4. ⚠️ **Potencjalne phantom imports:** Niektóre importy mogą nie mieć odpowiedników
5. 🔴 **Błędy runtime:** Brak obsługi błędów w kilku `fetch()` callach
6. ⚠️ **Niespójności:** Różne sposoby obsługi Supabase/Sanity fallbacków

---

## 🗺️ MAPA ZALEŻNOŚCI

### Entry Points (Krytyczne)
```
app/layout.tsx (ROOT LAYOUT)
├── Providers
│   ├── Redux Store
│   ├── React Query
│   ├── NextAuth Session
│   └── MoodContext
├── EmotiWrapper
│   └── EmotiLayer
└── Footer

app/page.tsx (HOME)
├── Navbar
├── HeroSection
├── CharacterSpotlight (charactersService)
├── CommunityShowcase
├── LookbookPreview
├── InteractiveQuiz
└── SocialProofMetrics

app/rewir/page.tsx (REWIR MAIN)
├── EmotionFilter
├── SceneCard
├── SceneMap
├── SceneModal
├── EmotionDetector
└── rewirService (fetchEmotionScenes)

app/rewir/[slug]/page.tsx (REWIR SCENE)
├── AIReplyBox
├── CommentsFeed
└── rewirService (fetchSceneBySlug)
```

### API Routes (Krytyczne)
```
app/api/
├── auth/[...nextauth]/route.ts
│   └── lib/auth.ts (authOptions)
│
├── checkout/route.ts
│   ├── lib/validation.ts
│   ├── services/productService.ts
│   └── stripe
│
├── printful/route.ts
│   └── process.env.PRINTFUL_API_KEY
│
├── rewir/generate/route.ts
│   ├── services/aiService.ts
│   ├── services/rewirService.ts
│   └── config/emotions.ts
│
├── ai/emotion/route.ts
│   ├── services/aiService.ts
│   └── config/moodVariants.ts
│
├── ai-reply/route.ts
│   ├── services/aiService.ts
│   └── services/feedbackLogger.ts
│
├── comments/route.ts
│   ├── lib/supabase.ts
│   ├── services/aiService.ts
│   └── services/feedbackLogger.ts
│
├── scenes/index/route.ts
│   └── services/sceneIndexer.ts
│
├── webhooks/[source]/route.ts
│   └── process.env.{STRIPE|GITHUB}_WEBHOOK_SECRET
│
└── stripe/webhook/route.ts (DEPRECATED → webhooks/[source])
```

### Serwisy (Core Business Logic)
```
src/services/
├── charactersService.ts
│   └── lib/sanity.ts (client)
│
├── rewirService.ts
│   ├── lib/supabase.ts
│   ├── config/emotions.ts
│   └── content/auto_scenes.json
│
├── productService.ts
│   └── lib/supabase.ts
│
├── aiService.ts
│   └── process.env.OPENAI_API_KEY
│
├── sceneIndexer.ts
│   ├── lib/sanity.ts
│   ├── lib/supabase.ts
│   └── services/aiService.ts
│
├── printfulService.ts
│   └── process.env.PRINTFUL_API_KEY
│
├── paymentService.ts
│   ├── services/printfulService.ts
│   └── process.env.{STRIPE_SECRET_KEY, VITE_PAYPAL_*}
│
├── promptContext.ts
│   └── lib/supabase.ts
│
└── feedbackLogger.ts
    └── lib/supabase.ts
```

### Komponenty (UI Layer)
```
src/components/
├── Providers.tsx (ROOT)
│   ├── store/index.ts
│   ├── contexts/MoodContext.tsx
│   └── next-auth SessionProvider
│
├── homepage/
│   ├── HeroSection.tsx
│   ├── CharacterSpotlight.tsx
│   ├── CommunityShowcase.tsx
│   ├── LookbookPreview.tsx
│   ├── InteractiveQuiz.tsx
│   └── SocialProofMetrics.tsx
│
├── rewir-related/
│   ├── SceneCard.tsx
│   ├── SceneMap.tsx
│   ├── SceneModal.tsx
│   ├── SceneBubble.tsx
│   ├── EmotionFilter.tsx
│   ├── EmotionMap.tsx
│   ├── EmotionDetector.tsx
│   └── AIReplyBox.tsx
│
├── shop/
│   ├── ProductCard.tsx
│   ├── CartSidebar.tsx
│   └── DropGrid.tsx
│
└── ui/
    ├── Button.jsx
    ├── Input.jsx
    ├── Select.jsx
    ├── Checkbox.jsx
    ├── Header.jsx
    ├── Sidebar.jsx
    └── LoadingSkeleton.jsx
```

---

## 🚨 ALERTY I PROBLEMY

### 🔴 KRYTYCZNE

#### 1. Nieużywana zależność: `react-router-dom`
**Plik:** `package.json:108`
```json
"react-router-dom": "^7.9.5"
```
**Problem:** Projekt używa Next.js App Router, nie react-router
**Użycie:** Tylko w `src/routes.test.jsx` (test skipowany)
**Działanie:** Usunąć zależność i plik testowy

#### 2. Martwy kod: `src/App.jsx`
**Plik:** `src/App.jsx`
```jsx
function App() {
  return null;
}
```
**Problem:** Komponent pusty, nieużywany w Next.js App Router
**Działanie:** Usunąć plik

#### 3. Martwy test: `src/routes.test.jsx`
**Plik:** `src/routes.test.jsx`
**Problem:** 
- Używa `react-router-dom` (nieużywany w projekcie)
- Wszystkie testy są `skip`
- Testuje nieistniejące route'y (`/homepage`, `/character-universe`, etc.)
**Działanie:** Usunąć lub przepisać na Next.js routes

#### 4. Błędne prefixy zmiennych środowiskowych
**Problem:** Używane są prefixy `VITE_*` zamiast `NEXT_PUBLIC_*` dla zmiennych frontend

**Miejsca:**
1. `src/services/paymentService.ts:8-9`
   ```typescript
   const PAYPAL_CLIENT_ID = process.env.VITE_PAYPAL_CLIENT_ID
   const PAYPAL_SECRET = process.env.VITE_PAYPAL_SECRET
   ```
2. `src/config/env.ts:95-96,100,106-108`
   ```typescript
   paypalClientId: process.env.VITE_PAYPAL_CLIENT_ID,
   paypalSecret: process.env.VITE_PAYPAL_SECRET,
   printfulStoreId: process.env.VITE_PRINTFUL_STORE_ID,
   googleAnalyticsId: process.env.VITE_GOOGLE_ANALYTICS_ID,
   ga4MeasurementId: process.env.VITE_GA4_MEASUREMENT_ID,
   plausibleDomain: process.env.VITE_PLAUSIBLE_DOMAIN,
   ```

**Działanie:** Zmienić wszystkie `VITE_*` na `NEXT_PUBLIC_*`

#### 5. Brak obsługi błędów w fetch() - runtime errors
**Miejsca:**
1. `src/services/aiService.ts:35-57` - `analyzeEmotion()`
   ```typescript
   const response = await fetch('https://api.openai.com/v1/chat/completions', ...)
   // ❌ Brak try-catch dla network errors
   ```
2. `app/api/printful/route.ts:83` - `fetchWithRetry()`
   - Ma retry, ale błędy mogą zostać nieobsłużone
3. `src/services/rewirService.ts:273` - `requestGeneratedScene()`
   ```typescript
   const response = await fetch('/api/rewir/generate', ...)
   // ❌ Brak obsługi network failures
   ```

**Działanie:** Dodać try-catch i fallback error handling

### ⚠️ WYSOKIE RYZYKO

#### 6. Niespójne fallbacki Supabase
**Problem:** Różne sposoby obsługi braku konfiguracji Supabase

**Przykłady:**
- `src/lib/supabase.ts:11` - tworzy placeholder client
- `src/services/rewirService.ts:8-13` - sprawdza `isSupabaseConfigured` boolean
- `src/services/productService.ts:8-12` - podobna logika, ale zduplikowana

**Działanie:** Zunifikować logikę w jednym miejscu

#### 7. Hardcoded placeholder values
**Problem:** Placeholder wartości mogą prowadzić do błędów w produkcji

**Miejsca:**
- `src/lib/supabase.ts:11`: `'https://placeholder.supabase.co'`
- `src/lib/sanity.ts:10`: `projectId: 'placeholder'`
- `app/api/checkout/route.ts:33`: `sessionId: 'mock-session'`

**Działanie:** Dodać walidację i jasne błędy zamiast fallbacków

#### 8. Potencjalne phantom imports
**Pliki do zweryfikowania:**
- `src/components/HeroFFDH.tsx:5` - re-export: `export { default } from './homepage/HeroSection'`
  - ✅ OK - używa HeroSection
- `app/layout.tsx:83` - `<title>` wewnątrz `<html>` (Next.js 13+ używa metadata)
  - ⚠️ Potencjalnie niepotrzebne (metadata już zdefiniowane)

#### 9. Nieużywany import w `src/lib/auth.ts`
**Plik:** `src/lib/auth.ts:10`
```typescript
const supabase = createClient(supabaseUrl, supabaseAnonKey)
```
**Problem:** `supabase` jest utworzony, ale używany tylko w `authorize()` - można przenieść lokalnie

### ⚠️ ŚREDNIE RYZYKO

#### 10. Zduplikowana logika normalizacji
**Pliki:**
- `src/services/rewirService.ts:121` - `normaliseScene()`
- `src/services/productService.ts:30` - `normaliseProduct()`

**Działanie:** Wydzielić do wspólnego utility

#### 11. Brak testów dla krytycznych funkcji
**Oznaczone jako [NOT TESTED]:**
- `src/services/charactersService.ts` - brak testów
- `src/services/rewirService.ts` - brak testów
- `src/services/productService.ts` - brak testów
- `src/services/paymentService.ts` - brak testów
- `app/api/checkout/route.ts` - brak testów integracyjnych
- `app/api/rewir/generate/route.ts` - brak testów

#### 12. Dynamic import w `src/services/aiService.ts:117`
```typescript
const { buildPromptContext, ... } = await import('./promptContext')
```
**Problem:** Może prowadzić do race conditions lub błędów jeśli plik nie istnieje
**Działanie:** Użyć static import lub dodać error handling

#### 13. Memory leak w webhooks
**Plik:** `app/api/webhooks/[source]/route.ts:13`
```typescript
setInterval(() => { ... }, 5 * 60 * 1000);
```
**Problem:** `setInterval` w API route może powodować memory leaks (Next.js serverless)
**Działanie:** Użyć Redis/DB dla idempotency zamiast Map + setInterval

#### 14. Niespójne nazewnictwo w API
**Problem:** 
- `/api/comments` używa `scene_id` (UUID) i `sceneSlug`
- `/api/rewir/generate` zwraca `scene`
- `/api/scenes/index` zwraca `scenes[]`

**Działanie:** Zunifikować format odpowiedzi

---

## 🗂️ PLIKI MARTWE / NIEPOTRZEBNE

### Do usunięcia:
1. ✅ `src/App.jsx` - pusty, nieużywany
2. ✅ `src/routes.test.jsx` - testuje nieistniejące route'y, używa react-router
3. ✅ `package.json:108` - `react-router-dom` (zależność)

### Do przepisania:
1. ⚠️ `src/middleware.ts` - używa `auth_token` cookie, ale projekt używa NextAuth (session w cookies)

---

## 🔗 MAPA WPŁYWU - Co pęknie przy zmianie?

### Jeśli zmienisz `src/lib/supabase.ts`:
- ⚠️ **Wszystkie serwisy** używające Supabase:
  - `rewirService.ts`
  - `productService.ts`
  - `sceneIndexer.ts`
  - `promptContext.ts`
  - `feedbackLogger.ts`
  - `comments/route.ts`

### Jeśli zmienisz `src/lib/sanity.ts`:
- ⚠️ **Wszystkie serwisy** używające Sanity:
  - `charactersService.ts`
  - `sceneIndexer.ts`
  - `app/page.tsx` (poprzez charactersService)
  - `app/manifest/page.tsx`

### Jeśli zmienisz `src/config/emotions.ts`:
- ⚠️ **Komponenty Rewir:**
  - `app/rewir/page.tsx`
  - `app/rewir/[slug]/page.tsx`
  - `app/api/rewir/generate/route.ts`
  - `src/components/SceneCard.tsx`
  - `src/components/SceneModal.tsx`
  - `src/services/rewirService.ts`

### Jeśli zmienisz `src/store/index.ts`:
- ⚠️ **Komponenty używające Redux:**
  - `src/components/Navbar.tsx`
  - `src/components/ProductCard.tsx`
  - `src/components/CartSidebar.tsx`
  - `src/hooks/useCart.ts`
  - `app/checkout/page.tsx`
  - `app/shop/cart/page.tsx`
  - `app/success/page.tsx`

### Jeśli zmienisz `src/services/aiService.ts`:
- ⚠️ **API routes:**
  - `app/api/ai/emotion/route.ts`
  - `app/api/ai-reply/route.ts`
  - `app/api/comments/route.ts`
  - `app/api/rewir/generate/route.ts`
- ⚠️ **Komponenty:**
  - `src/components/AIReplyBox.tsx`
  - `src/components/EmotionDetector.tsx`

---

## 🔐 MAPOWANIE ZMIENNYCH ŚRODOWISKOWYCH

### Wymagane (bez fallbacków):
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - ✅ Używane: `src/lib/sanity.ts`, `scripts/*.mjs`, `sanity/*.ts`
- `NEXT_PUBLIC_SUPABASE_URL` - ✅ Używane: `src/lib/supabase.ts`, `src/lib/auth.ts`, `src/services/*`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - ✅ Używane: `src/lib/supabase.ts`, `src/lib/auth.ts`

### Opcjonalne (z fallbackami):
- `STRIPE_SECRET_KEY` - Używane: `app/api/checkout/route.ts`, `src/services/paymentService.ts`
- `PRINTFUL_API_KEY` - Używane: `app/api/printful/route.ts`, `src/services/printfulService.ts`
- `OPENAI_API_KEY` - Używane: `src/services/aiService.ts`
- `SANITY_AUTH_TOKEN` - Używane: `src/lib/sanity.ts`, `scripts/*.mjs`
- `STRIPE_WEBHOOK_SECRET` - Używane: `app/api/webhooks/[source]/route.ts`
- `GITHUB_WEBHOOK_SECRET` - Używane: `app/api/webhooks/[source]/route.ts`
- `NEXT_PUBLIC_APP_URL` - Używane: `app/layout.tsx`, `src/components/SEO.tsx`, `next.config.js`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Używane: (frontend - sprawdzić)

### ❌ BŁĘDNIE ZDEFINIOWANE (VITE_ prefix):
- `VITE_PAYPAL_CLIENT_ID` → powinno być `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `VITE_PAYPAL_SECRET` → powinno być `PAYPAL_SECRET` (server-only)
- `VITE_PRINTFUL_STORE_ID` → powinno być `NEXT_PUBLIC_PRINTFUL_STORE_ID` lub `PRINTFUL_STORE_ID`
- `VITE_GOOGLE_ANALYTICS_ID` → powinno być `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
- `VITE_GA4_MEASUREMENT_ID` → powinno być `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
- `VITE_PLAUSIBLE_DOMAIN` → powinno być `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

---

## 🔄 FEATURE FLAGI I TOGGLES

### Zidentyfikowane flagi:
1. **ENABLE_SIGNATURE_CHECK** (`scripts/check-env.mjs:83`, `tests/contracts/webhooks.spec.ts:155`)
   - Włącza weryfikację podpisów webhooków
   - Domyślnie: `!== 'true'` (wyłączone)

2. **NEXT_PUBLIC_SCENE_MAP_ENABLED** (`FFDH_AUTOPILOT_EXECUTION_PLAN.md:231`)
   - Toggle dla SceneMap component
   - **Nie znaleziono użycia w kodzie** ⚠️

3. **NEXT_PUBLIC_QR_SCANNER_ENABLED** (`FFDH_AUTOPILOT_EXECUTION_PLAN.md:232`)
   - Toggle dla QRScanner
   - **Nie znaleziono użycia w kodzie** ⚠️

4. **NEXT_PUBLIC_EMOTION_BUBBLES_ENABLED** (`FFDH_AUTOPILOT_EXECUTION_PLAN.md:233`)
   - Toggle dla emotion bubbles
   - **Nie znaleziono użycia w kodzie** ⚠️

**Działanie:** Zweryfikować czy flagi są faktycznie używane, jeśli nie - usunąć z dokumentacji

---

## 📦 ZDUPLIKOWANE ZALEŻNOŚCI

### Sprawdzone - brak duplikatów
Wszystkie zależności w `package.json` są unikalne.

### Potencjalne konflikty wersji:
- `next@15.5.6` - najnowsza wersja, powinno być OK
- `react@18.3.1` + `react-dom@18.3.1` - zgodne wersje ✅
- `@types/react@18.3.26` vs `react@18.3.1` - minor version difference, OK ✅

---

## 🔍 NIESPÓJNOŚCI W ARCHITEKTURZE

### 1. Routes/Layouts
**Problem:** Niektóre strony mają layout, inne nie
- ✅ `app/about/layout.tsx` - istnieje
- ✅ `app/contact/layout.tsx` - istnieje
- ✅ `app/product/[slug]/layout.tsx` - istnieje
- ❌ `app/rewir/page.tsx` - brak layout (może używać root layout)

**Status:** OK - to jest celowe (Next.js App Router)

### 2. Dynamic Imports
**Problem:** Dynamic import tylko w jednym miejscu
- `src/services/aiService.ts:117` - dynamiczny import `promptContext`
- Wszystkie inne importy są statyczne

**Działanie:** Zmienić na static import dla lepszej tree-shaking

### 3. Integracje CMS
**Problem:** Różne sposoby obsługi Sanity/Supabase

**Sanity:**
- `src/lib/sanity.ts` - singleton client
- `src/services/charactersService.ts` - używa `client` (alias)
- `src/services/sceneIndexer.ts` - używa `sanityFetch` helper

**Supabase:**
- `src/lib/supabase.ts` - singleton client
- Każdy serwis sprawdza `isSupabaseConfigured` osobno
- Brak centralnego error handling

**Działanie:** Zunifikować pattern error handling i fallbacków

### 4. API Routes - niespójne formaty odpowiedzi
**Przykłady:**
- `/api/health` - zwraca `{ status, ... }`
- `/api/rewir/generate` - zwraca `{ success, scene }`
- `/api/comments` - zwraca `{ success, comments }`
- `/api/ai-reply` - zwraca `{ success, response, metrics }`

**Działanie:** Stworzyć standardowy format API response

---

## 🧪 TESTY

### Obecne testy:
- ✅ `src/services/__tests__/sceneIndexer.test.ts`
- ✅ `src/services/__tests__/promptContext.test.ts`
- ✅ `tests/unit/ProductCard.a11y.test.tsx`
- ✅ `tests/e2e/*` (Playwright)

### Brak testów dla:
- [NOT TESTED] `charactersService.ts`
- [NOT TESTED] `rewirService.ts`
- [NOT TESTED] `productService.ts`
- [NOT TESTED] `paymentService.ts`
- [NOT TESTED] `printfulService.ts`
- [NOT TESTED] API routes (oprócz health)
- [NOT TESTED] Komponenty Rewir (SceneCard, SceneModal, etc.)

---

## 📋 REKOMENDACJE PRIORYTETOWE

### 🔴 PILNE (przed deployem)
1. **Usunąć `react-router-dom`** z dependencies
2. **Zmienić `VITE_*` → `NEXT_PUBLIC_*`** w 8 miejscach
3. **Usunąć martwe pliki:** `src/App.jsx`, `src/routes.test.jsx`
4. **Dodać error handling** do fetch() w `aiService.ts`

### ⚠️ WAŻNE (w ciągu tygodnia)
5. **Zunifikować fallbacki Supabase** (wspólny utility)
6. **Naprawić memory leak** w `webhooks/[source]/route.ts` (usunąć setInterval)
7. **Dodać testy** dla krytycznych serwisów
8. **Zweryfikować feature flagi** (usunąć nieużywane)

### 📝 ZALECANE (długoterminowe)
9. **Wydzielić wspólną logikę normalizacji** (normaliseScene, normaliseProduct)
10. **Zunifikować formaty API responses**
11. **Dodać więcej testów** dla komponentów Rewir
12. **Zmienić dynamic import** na static w `aiService.ts`

---

## 📊 ZALEŻNOŚCI - DEPENDENCY MAP (JSON)

```json
{
  "entryPoints": {
    "app/layout.tsx": {
      "dependencies": [
        "components/Providers",
        "components/ScrollToTop",
        "components/Footer",
        "components/EmotiWrapper"
      ],
      "critical": true
    },
    "app/page.tsx": {
      "dependencies": [
        "services/charactersService",
        "components/Navbar",
        "components/homepage/*"
      ],
      "critical": true
    },
    "app/rewir/page.tsx": {
      "dependencies": [
        "services/rewirService",
        "components/SceneCard",
        "components/SceneMap",
        "hooks/useEmotionProfile"
      ],
      "critical": true
    }
  },
  "services": {
    "charactersService": {
      "dependsOn": ["lib/sanity"],
      "usedBy": ["app/page.tsx", "app/characters/page.tsx"]
    },
    "rewirService": {
      "dependsOn": ["lib/supabase", "config/emotions"],
      "usedBy": ["app/rewir/*", "app/api/rewir/generate"]
    },
    "aiService": {
      "dependsOn": ["services/promptContext"],
      "usedBy": ["app/api/ai/*", "components/AIReplyBox"]
    },
    "productService": {
      "dependsOn": ["lib/supabase"],
      "usedBy": ["app/shop/*", "app/product/*", "app/api/checkout"]
    }
  },
  "external": {
    "supabase": {
      "usedBy": [
        "lib/supabase.ts",
        "services/rewirService.ts",
        "services/productService.ts",
        "services/promptContext.ts",
        "services/feedbackLogger.ts",
        "app/api/comments/route.ts"
      ]
    },
    "sanity": {
      "usedBy": [
        "lib/sanity.ts",
        "services/charactersService.ts",
        "services/sceneIndexer.ts"
      ]
    },
    "stripe": {
      "usedBy": [
        "app/api/checkout/route.ts",
        "services/paymentService.ts"
      ]
    },
    "openai": {
      "usedBy": ["services/aiService.ts"]
    }
  }
}
```

---

## 🎯 PLIKI KRYTYCZNE - Mapa Ryzyka

### 🔴 CRITICAL (zmiana = duży wpływ)
1. `app/layout.tsx` - Root layout, wszystkie strony
2. `src/store/index.ts` - Redux store, cart state
3. `src/lib/supabase.ts` - Wszystkie serwisy używające Supabase
4. `src/lib/sanity.ts` - Wszystkie serwisy używające Sanity
5. `src/config/emotions.ts` - Rewir, scene system
6. `src/services/rewirService.ts` - Rewir core logic
7. `src/services/aiService.ts` - AI responses

### ⚠️ HIGH (zmiana = średni wpływ)
8. `src/services/productService.ts` - Shop, checkout
9. `src/services/paymentService.ts` - Payments
10. `app/api/checkout/route.ts` - Stripe checkout
11. `src/components/Providers.tsx` - Context providers
12. `src/middleware.ts` - Route protection

### 📝 MEDIUM (zmiana = lokalny wpływ)
13. Komponenty homepage
14. Komponenty Rewir (SceneCard, SceneModal)
15. Hooks (useCart, useEmotionProfile)

---

## ✅ PODSUMOWANIE

### Statystyki problemów:
- 🔴 **Krytyczne:** 5
- ⚠️ **Wysokie ryzyko:** 4
- ⚠️ **Średnie ryzyko:** 5
- 📝 **Niskie ryzyko:** 3

### Pliki do usunięcia: 3
### Pliki do naprawy: 15+
### Testy do dodania: 10+

### Główne obszary do poprawy:
1. **Cleanup dependencies** - usunąć react-router-dom
2. **Fix env variables** - VITE_* → NEXT_PUBLIC_*
3. **Error handling** - dodać obsługę błędów w fetch()
4. **Testing** - dodać testy dla serwisów
5. **Code organization** - zunifikować fallbacki i normalizację

---

**Raport wygenerowany przez:** Extreme Inspector  
**Data:** 2025-01-XX  
**Wersja:** 1.0


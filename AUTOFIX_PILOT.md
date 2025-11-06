# 🤖 AUTOFIX PILOT - System Naprawczy PRO GOLD

**Rola:** Specjalista od naprawiania aplikacji  
**Cel:** Przywrócenie projektu FFDH + Rewir do stanu PRO GOLD  
**Metoda:** Systematyczne naprawianie wszystkich 17 alertów według priorytetów

---

## 🎯 DEFINICJA PRO GOLD

### Standard PRO GOLD oznacza:
✅ **Zero błędów krytycznych**  
✅ **Zero martwego kodu**  
✅ **100% zgodność z best practices Next.js 15**  
✅ **Wszystkie zmienne env poprawnie zdefiniowane**  
✅ **Kompletne error handling w krytycznych miejscach**  
✅ **Spójna architektura bez duplikacji**  
✅ **Minimalne pokrycie testami dla serwisów**  
✅ **Zero memory leaks**  
✅ **Czyste zależności (tylko używane)**

---

## 📋 PLAN NAPRAWCZY - Fazy

### 🔴 FAZA 1: CRITICAL FIXES (Pilne - przed deployem)

#### AUTO-FIX-001: Usunąć nieużywane zależności
**Cel:** Oczyścić package.json z nieużywanych pakietów

**Akcje:**
1. Sprawdź czy `react-router-dom` jest używany w kodzie
2. Jeśli NIE → usuń z dependencies:
   ```bash
   npm uninstall react-router-dom
   ```
3. Zweryfikuj że build działa: `npm run build`

**Plik dotknięty:** `package.json`

---

#### AUTO-FIX-002: Usunąć martwy kod
**Cel:** Usunąć pliki które nie są używane

**Akcje:**
1. Usuń `src/App.jsx` (pusty komponent)
2. Usuń `src/routes.test.jsx` (martwy test z react-router)
3. Zweryfikuj że TypeScript kompiluje się: `npm run type-check`

**Pliki do usunięcia:**
- `src/App.jsx`
- `src/routes.test.jsx`

---

#### AUTO-FIX-003: Naprawić błędne prefixy env (VITE_* → NEXT_PUBLIC_*)
**Cel:** Poprawić wszystkie zmienne środowiskowe zgodnie z Next.js standard

**Akcje:**
1. **Plik:** `src/services/paymentService.ts:8-9`
   - Zmień `VITE_PAYPAL_CLIENT_ID` → `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - Zmień `VITE_PAYPAL_SECRET` → `PAYPAL_SECRET` (server-only, bez prefiksu)
   
2. **Plik:** `src/config/env.ts:95-96,100,106-108`
   - Zmień wszystkie `VITE_*` na odpowiednie:
     - `VITE_PAYPAL_CLIENT_ID` → `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
     - `VITE_PAYPAL_SECRET` → `PAYPAL_SECRET`
     - `VITE_PRINTFUL_STORE_ID` → `PRINTFUL_STORE_ID` (server-only) lub `NEXT_PUBLIC_PRINTFUL_STORE_ID` (frontend)
     - `VITE_GOOGLE_ANALYTICS_ID` → `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
     - `VITE_GA4_MEASUREMENT_ID` → `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
     - `VITE_PLAUSIBLE_DOMAIN` → `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

3. Zaktualizuj dokumentację (.env.example jeśli istnieje)

**Pliki dotknięte:**
- `src/services/paymentService.ts`
- `src/config/env.ts`

---

#### AUTO-FIX-004: Dodać error handling do fetch()
**Cel:** Zapobiec crashom aplikacji przy network failures

**Akcje:**
1. **Plik:** `src/services/aiService.ts:35-57` (analyzeEmotion)
   - Opakuj `fetch()` w dodatkowy try-catch (obecny catch nie łapie network errors)
   - Dodaj timeout dla fetch
   - Zwróć sensowny fallback zamiast throw

2. **Plik:** `src/services/rewirService.ts:273` (requestGeneratedScene)
   - Dodaj try-catch dla fetch
   - Dodaj timeout
   - Zwróć null z jasnym logiem błędu

3. **Plik:** `app/api/printful/route.ts:83` (fetchWithRetry)
   - Sprawdź czy wszystkie błędy są łapane (już jest retry, ale zweryfikuj)

**Przykład poprawki:**
```typescript
// PRZED:
const response = await fetch(url, options)

// PO:
let response: Response
try {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
  
  response = await fetch(url, { ...options, signal: controller.signal })
  clearTimeout(timeoutId)
} catch (error) {
  if (error instanceof Error && error.name === 'AbortError') {
    throw new Error('Request timeout')
  }
  throw error
}
```

**Pliki dotknięte:**
- `src/services/aiService.ts`
- `src/services/rewirService.ts`

---

#### AUTO-FIX-005: Usunąć niepotrzebny <title> z layout.tsx
**Cel:** Uniknąć duplikacji title (Next.js używa metadata API)

**Akcje:**
1. **Plik:** `app/layout.tsx:83`
   - Usuń linię: `<title>Fruits From Da Hood | Premium Streetwear & Emotional AI</title>`
   - Metadata już definiuje title w linii 35

**Plik dotknięty:** `app/layout.tsx`

---

### ⚠️ FAZA 2: HIGH PRIORITY FIXES (W ciągu tygodnia)

#### AUTO-FIX-006: Zunifikować fallbacki Supabase
**Cel:** Jedna logika sprawdzania konfiguracji Supabase

**Akcje:**
1. Rozszerz `src/lib/supabase.ts` o export:
   ```typescript
   export const isSupabaseConfigured: boolean
   ```
   
2. Zaktualizuj `src/services/rewirService.ts`:
   - Import `isSupabaseConfigured` z `lib/supabase`
   - Usuń lokalną definicję `isSupabaseConfigured`
   
3. Zaktualizuj `src/services/productService.ts`:
   - Import `isSupabaseConfigured` z `lib/supabase`
   - Usuń lokalną definicję

**Pliki dotknięte:**
- `src/lib/supabase.ts`
- `src/services/rewirService.ts`
- `src/services/productService.ts`

---

#### AUTO-FIX-007: Naprawić memory leak w webhooks
**Cel:** Usunąć setInterval z API route (serverless)

**Akcje:**
1. **Plik:** `app/api/webhooks/[source]/route.ts:13`
   - Usuń `setInterval` dla cleanup
   - Użyj TTL w Map zamiast setInterval
   - ALBO: Przenieś idempotency do Supabase (tabela `processed_webhooks` z `expires_at`)

**Najlepsze rozwiązanie:** Użyć Supabase dla idempotency:
```typescript
// Usuń setInterval, użyj DB
async function checkIdempotency(eventId: string, source: string): Promise<boolean> {
  const { data } = await supabase
    .from('processed_webhooks')
    .select('id')
    .eq('event_id', `${source}:${eventId}`)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()
  
  if (data) return false // Already processed
  
  await supabase
    .from('processed_webhooks')
    .insert({
      event_id: `${source}:${eventId}`,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1h TTL
    })
  
  return true
}
```

**Plik dotknięty:** `app/api/webhooks/[source]/route.ts`

**Wymaga:** Migracji Supabase (tabela `processed_webhooks`)

---

#### AUTO-FIX-008: Optymalizacja auth.ts
**Cel:** Przenieść supabase client do funkcji authorize()

**Akcje:**
1. **Plik:** `src/lib/auth.ts:10`
   - Przenieś tworzenie `supabase` client do wewnątrz funkcji `authorize()`
   - Usuń globalny `supabase` jeśli nie używany gdzie indziej

**Plik dotknięty:** `src/lib/auth.ts`

---

### ⚠️ FAZA 3: MEDIUM PRIORITY (Refaktoring)

#### AUTO-FIX-009: Wydzielić wspólną logikę normalizacji
**Cel:** Usunąć duplikację kodu

**Akcje:**
1. Utwórz `src/utils/normalize.ts`:
   ```typescript
   export function normalizeData<T>(data: Partial<T> & { slug?: string | null; name?: string | null }, defaults: T): T | null
   ```

2. Zaktualizuj `src/services/rewirService.ts`:
   - Użyj `normalizeData` zamiast `normaliseScene`

3. Zaktualizuj `src/services/productService.ts`:
   - Użyj `normalizeData` zamiast `normaliseProduct`

**Pliki dotknięte:**
- `src/utils/normalize.ts` (nowy)
- `src/services/rewirService.ts`
- `src/services/productService.ts`

---

#### AUTO-FIX-010: Zmienić dynamic import na static
**Cel:** Lepsze tree-shaking, uniknąć race conditions

**Akcje:**
1. **Plik:** `src/services/aiService.ts:117`
   - Zmień `await import('./promptContext')` na static import na początku pliku
   - Dodaj error handling jeśli import failuje

**Plik dotknięty:** `src/services/aiService.ts`

---

#### AUTO-FIX-011: Dodać walidację zamiast placeholderów
**Cel:** Jasne błędy zamiast cichego użycia placeholderów

**Akcje:**
1. **Plik:** `src/lib/supabase.ts`
   - W produkcji: throw Error zamiast placeholder client
   - W dev: warning + placeholder

2. **Plik:** `src/lib/sanity.ts`
   - W produkcji: throw Error zamiast placeholder projectId
   - W dev: warning + placeholder

3. **Plik:** `app/api/checkout/route.ts`
   - Jeśli brak STRIPE_SECRET_KEY w produkcji: return 503, nie mock session

**Pliki dotknięte:**
- `src/lib/supabase.ts`
- `src/lib/sanity.ts`
- `app/api/checkout/route.ts`

---

#### AUTO-FIX-012: Zunifikować formaty API responses
**Cel:** Standardowy format odpowiedzi API

**Akcje:**
1. Utwórz `src/utils/api-response.ts`:
   ```typescript
   export function createApiResponse<T>(data: T, success = true) {
     return { success, data, timestamp: new Date().toISOString() }
   }
   
   export function createApiError(message: string, code?: string) {
     return { success: false, error: message, code, timestamp: new Date().toISOString() }
   }
   ```

2. Zaktualizuj wszystkie API routes aby używały tego formatu

**Pliki dotknięte:**
- `src/utils/api-response.ts` (nowy)
- `app/api/health/route.ts`
- `app/api/rewir/generate/route.ts`
- `app/api/comments/route.ts`
- `app/api/ai-reply/route.ts`

---

### 📝 FAZA 4: OPTIMIZATION (Długoterminowe)

#### AUTO-FIX-013: Dodać testy dla serwisów
**Cel:** Minimalne pokrycie testami

**Priorytet testów:**
1. `src/services/rewirService.ts` - fetchEmotionScenes, submitReaction
2. `src/services/productService.ts` - fetchProducts, fetchProductBySlug
3. `src/services/charactersService.ts` - getCharacters
4. `app/api/checkout/route.ts` - integracyjny test

**Format:** Użyć Vitest (już skonfigurowany)

---

#### AUTO-FIX-014: Zweryfikować i usunąć nieużywane feature flagi
**Cel:** Oczyścić dokumentację

**Akcje:**
1. Przeszukaj kod dla:
   - `NEXT_PUBLIC_SCENE_MAP_ENABLED`
   - `NEXT_PUBLIC_QR_SCANNER_ENABLED`
   - `NEXT_PUBLIC_EMOTION_BUBBLES_ENABLED`

2. Jeśli nie używane → usuń z dokumentacji

---

#### AUTO-FIX-015: Zunifikować export sanityClient
**Cel:** Użyć tylko sanityClient, nie alias client

**Akcje:**
1. **Plik:** `src/services/charactersService.ts:1`
   - Zmień `import { sanityClient, client }` na `import { sanityClient }`
   - Zmień wszystkie użycia `client` na `sanityClient`
   - Usuń export `client` z `src/lib/sanity.ts` (lub pozostaw dla backward compatibility)

**Pliki dotknięte:**
- `src/services/charactersService.ts`
- `src/lib/sanity.ts` (opcjonalnie)

---

#### AUTO-FIX-016: Dostosować middleware do NextAuth
**Cel:** Middleware powinien używać NextAuth session

**Akcje:**
1. **Plik:** `src/middleware.ts:30`
   - Sprawdź jak NextAuth przechowuje session (cookie `next-auth.session-token`)
   - Zaktualizuj middleware aby używał NextAuth session zamiast custom `auth_token`

**Plik dotknięty:** `src/middleware.ts`

---

## 🛠️ NARZĘDZIA WERYFIKACJI

### Po każdej fazie, uruchom:

```bash
# 1. TypeScript compilation
npm run type-check

# 2. Build
npm run build

# 3. Linting
npm run lint

# 4. Tests (jeśli dodane)
npm test

# 5. Sprawdź rozmiar bundle
npm run build:analyze
```

---

## 📊 CHECKLIST POSTĘPU

### 🔴 FAZA 1: CRITICAL (5 zadań)
- [ ] AUTO-FIX-001: Usunąć react-router-dom
- [ ] AUTO-FIX-002: Usunąć martwy kod (App.jsx, routes.test.jsx)
- [ ] AUTO-FIX-003: Naprawić VITE_* → NEXT_PUBLIC_*
- [ ] AUTO-FIX-004: Dodać error handling do fetch()
- [ ] AUTO-FIX-005: Usunąć <title> z layout.tsx

### ⚠️ FAZA 2: HIGH PRIORITY (3 zadania)
- [ ] AUTO-FIX-006: Zunifikować fallbacki Supabase
- [ ] AUTO-FIX-007: Naprawić memory leak w webhooks
- [ ] AUTO-FIX-008: Optymalizacja auth.ts

### ⚠️ FAZA 3: MEDIUM (4 zadania)
- [ ] AUTO-FIX-009: Wydzielić wspólną logikę normalizacji
- [ ] AUTO-FIX-010: Zmienić dynamic import na static
- [ ] AUTO-FIX-011: Dodać walidację zamiast placeholderów
- [ ] AUTO-FIX-012: Zunifikować formaty API responses

### 📝 FAZA 4: OPTIMIZATION (4 zadania)
- [ ] AUTO-FIX-013: Dodać testy dla serwisów
- [ ] AUTO-FIX-014: Zweryfikować feature flagi
- [ ] AUTO-FIX-015: Zunifikować export sanityClient
- [ ] AUTO-FIX-016: Dostosować middleware do NextAuth

---

## 🎯 KRYTERIA PRO GOLD

Projekt osiąga status PRO GOLD gdy:

✅ **Wszystkie zadania z FAZY 1 są ukończone**  
✅ **Wszystkie zadania z FAZY 2 są ukończone**  
✅ **TypeScript kompiluje się bez błędów**  
✅ **Build kończy się sukcesem**  
✅ **Linter przechodzi bez błędów**  
✅ **Zero nieużywanych zależności**  
✅ **Zero martwego kodu**  
✅ **Wszystkie zmienne env poprawnie zdefiniowane**  
✅ **Error handling w krytycznych miejscach**  
✅ **Memory leaks usunięte**  

**Status:** 🟡 W TRAKCIE → 🟢 PRO GOLD

---

## 📝 INSTRUKCJE DLA AUTOFIX PILOT

1. **Czytaj** ten dokument sekwencyjnie
2. **Wykonuj** zadania według faz i priorytetów
3. **Weryfikuj** każdą zmianę (type-check, build, lint)
4. **Commituj** każdą fazę osobno z jasnym komunikatem
5. **Aktualizuj** checklist postępu
6. **Raportuj** problemy jeśli coś się nie kompiluje

---

**Ostatnia aktualizacja:** 2025-01-XX  
**Wersja:** 1.0  
**Status:** 🟡 GOTOWY DO URUCHOMIENIA


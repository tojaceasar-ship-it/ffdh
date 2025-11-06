# 🚨 LISTA ALERTÓW - FFDH + Rewir

## 🔴 KRYTYCZNE

### ALERT-001: Nieużywana zależność `react-router-dom`
- **Plik:** `package.json:108`
- **Typ:** Nieużywana zależność
- **Ryzyko:** Zwiększa rozmiar bundle, może powodować konflikty
- **Działanie:** 
  ```bash
  npm uninstall react-router-dom
  ```
- **Status:** 🔴 DO NAPRAWY

---

### ALERT-002: Martwy kod - `src/App.jsx`
- **Plik:** `src/App.jsx`
- **Typ:** Martwy kod
- **Ryzyko:** Dezorientacja dla developerów
- **Działanie:** Usunąć plik
- **Status:** 🔴 DO NAPRAWY

---

### ALERT-003: Martwy test - `src/routes.test.jsx`
- **Plik:** `src/routes.test.jsx`
- **Typ:** Martwy test
- **Ryzyko:** Myślące że są testy, które faktycznie nie działają
- **Działanie:** Usunąć lub przepisać na Next.js routes
- **Status:** 🔴 DO NAPRAWY

---

### ALERT-004: Błędne prefixy env - `VITE_*` zamiast `NEXT_PUBLIC_*`
- **Pliki:**
  - `src/services/paymentService.ts:8-9`
  - `src/config/env.ts:95-96,100,106-108`
- **Typ:** Błąd konfiguracji
- **Ryzyko:** Zmienne nie będą dostępne w przeglądarce (Next.js wymaga `NEXT_PUBLIC_*`)
- **Działanie:** Zmienić wszystkie `VITE_*` na `NEXT_PUBLIC_*` (dla frontend) lub bez prefiksu (dla server-only)
- **Status:** 🔴 DO NAPRAWY

---

### ALERT-005: Brak obsługi błędów w `fetch()` - runtime errors
- **Pliki:**
  - `src/services/aiService.ts:35-57` (analyzeEmotion)
  - `src/services/rewirService.ts:273` (requestGeneratedScene)
- **Typ:** Błąd runtime
- **Ryzyko:** Aplikacja może crashować przy network failures
- **Działanie:** Dodać try-catch i fallback error handling
- **Status:** 🔴 DO NAPRAWY

---

## ⚠️ WYSOKIE RYZYKO

### ALERT-006: Niespójne fallbacki Supabase
- **Pliki:**
  - `src/lib/supabase.ts:11`
  - `src/services/rewirService.ts:8-13`
  - `src/services/productService.ts:8-12`
- **Typ:** Niespójność architektoniczna
- **Ryzyko:** Trudności w utrzymaniu, potencjalne błędy
- **Działanie:** Zunifikować logikę w jednym miejscu (np. `lib/supabase.ts`)
- **Status:** ⚠️ DO PRZEPISANIA

---

### ALERT-007: Hardcoded placeholder values
- **Pliki:**
  - `src/lib/supabase.ts:11`: `'https://placeholder.supabase.co'`
  - `src/lib/sanity.ts:10`: `projectId: 'placeholder'`
  - `app/api/checkout/route.ts:33`: `sessionId: 'mock-session'`
- **Typ:** Potencjalne błędy w produkcji
- **Ryzyko:** Placeholder values mogą być używane zamiast prawdziwych wartości
- **Działanie:** Dodać walidację i jasne błędy zamiast fallbacków w produkcji
- **Status:** ⚠️ DO NAPRAWY

---

### ALERT-008: Potencjalny phantom import
- **Plik:** `app/layout.tsx:83`
- **Typ:** Potencjalnie niepotrzebny kod
- **Problem:** `<title>` wewnątrz `<html>` gdy Next.js 13+ używa metadata API
- **Ryzyko:** Może powodować duplikację title w HTML
- **Działanie:** Usunąć `<title>` z JSX, metadata już zdefiniowane
- **Status:** ⚠️ DO WERYFIKACJI

---

### ALERT-009: Nieużywany import w `src/lib/auth.ts`
- **Plik:** `src/lib/auth.ts:10`
- **Typ:** Optymalizacja
- **Problem:** `supabase` client utworzony globalnie, używany tylko lokalnie
- **Ryzyko:** Minimalne - niewielkie zużycie pamięci
- **Działanie:** Przenieść tworzenie client do funkcji `authorize()`
- **Status:** ⚠️ OPTYMALIZACJA

---

## ⚠️ ŚREDNIE RYZYKO

### ALERT-010: Zduplikowana logika normalizacji
- **Pliki:**
  - `src/services/rewirService.ts:121` - `normaliseScene()`
  - `src/services/productService.ts:30` - `normaliseProduct()`
- **Typ:** Code duplication
- **Ryzyko:** Trudności w utrzymaniu, potencjalne niespójności
- **Działanie:** Wydzielić do wspólnego utility (`src/utils/normalize.ts`)
- **Status:** ⚠️ REFACTOR

---

### ALERT-011: Brak testów dla krytycznych funkcji
- **Pliki bez testów:**
  - `src/services/charactersService.ts`
  - `src/services/rewirService.ts`
  - `src/services/productService.ts`
  - `src/services/paymentService.ts`
  - `app/api/checkout/route.ts`
  - `app/api/rewir/generate/route.ts`
- **Typ:** Brak pokrycia testami
- **Ryzyko:** Brak weryfikacji poprawności działania
- **Działanie:** Dodać testy unit/integration dla każdego serwisu
- **Status:** ⚠️ DO DODANIA

---

### ALERT-012: Dynamic import może powodować problemy
- **Plik:** `src/services/aiService.ts:117`
- **Typ:** Potencjalny błąd runtime
- **Problem:** Dynamic import `promptContext` może failować jeśli plik nie istnieje
- **Ryzyko:** Błędy runtime, trudne do debugowania
- **Działanie:** Zmienić na static import lub dodać error handling
- **Status:** ⚠️ DO NAPRAWY

---

### ALERT-013: Memory leak w webhooks
- **Plik:** `app/api/webhooks/[source]/route.ts:13`
- **Typ:** Memory leak w serverless
- **Problem:** `setInterval` w API route może powodować memory leaks (Next.js serverless)
- **Ryzyko:** Zwiększone zużycie pamięci w produkcji
- **Działanie:** Użyć Redis/DB dla idempotency zamiast Map + setInterval
- **Status:** ⚠️ DO REFACTOR

---

### ALERT-014: Niespójne formaty odpowiedzi API
- **Przykłady:**
  - `/api/health` → `{ status, ... }`
  - `/api/rewir/generate` → `{ success, scene }`
  - `/api/comments` → `{ success, comments }`
- **Typ:** Niespójność API
- **Ryzyko:** Trudności w integracji frontend, potencjalne błędy
- **Działanie:** Stworzyć standardowy format API response (wrapper)
- **Status:** ⚠️ DO STANDARYZACJI

---

## 📝 NISKIE RYZYKO / OPTYMALIZACJA

### ALERT-015: Middleware używa custom auth token
- **Plik:** `src/middleware.ts:30`
- **Typ:** Potencjalna niespójność
- **Problem:** Sprawdza `auth_token` cookie, ale projekt używa NextAuth (session w cookies)
- **Ryzyko:** Middleware może nie działać poprawnie z NextAuth
- **Działanie:** Zweryfikować i dostosować do NextAuth session
- **Status:** 📝 DO WERYFIKACJI

---

### ALERT-016: Feature flagi nieużywane w kodzie
- **Flagi:**
  - `NEXT_PUBLIC_SCENE_MAP_ENABLED`
  - `NEXT_PUBLIC_QR_SCANNER_ENABLED`
  - `NEXT_PUBLIC_EMOTION_BUBBLES_ENABLED`
- **Typ:** Martwe flagi
- **Problem:** Wspomniane w dokumentacji, ale nie znalezione w kodzie
- **Ryzyko:** Dezorientacja, niepotrzebna dokumentacja
- **Działanie:** Zweryfikować czy używane, jeśli nie - usunąć z dokumentacji
- **Status:** 📝 DO WERYFIKACJI

---

### ALERT-017: Nieużywany export `sanityClient` alias
- **Plik:** `src/lib/sanity.ts:28`
- **Typ:** Potencjalnie nieużywany kod
- **Problem:** `client` jest aliasem dla `sanityClient` - tylko `charactersService.ts` używa `client`
- **Ryzyko:** Minimalne - ale można zunifikować
- **Działanie:** Zmienić `charactersService.ts` aby używał `sanityClient`
- **Status:** 📝 OPTYMALIZACJA

---

## 📊 PODSUMOWANIE ALERTÓW

| Priorytet | Liczba | Status |
|-----------|--------|--------|
| 🔴 Krytyczne | 5 | DO NAPRAWY |
| ⚠️ Wysokie | 4 | DO PRZEPISANIA |
| ⚠️ Średnie | 5 | DO DODANIA/REFACTOR |
| 📝 Niskie | 3 | DO WERYFIKACJI |
| **RAZEM** | **17** | |

---

## 🎯 PLAN DZIAŁANIA

### Sprint 1 (Pilne - przed deployem):
1. ALERT-001: Usunąć `react-router-dom`
2. ALERT-002: Usunąć `src/App.jsx`
3. ALERT-003: Usunąć `src/routes.test.jsx`
4. ALERT-004: Poprawić `VITE_*` → `NEXT_PUBLIC_*`
5. ALERT-005: Dodać error handling do `fetch()`

### Sprint 2 (Ważne - w ciągu tygodnia):
6. ALERT-006: Zunifikować fallbacki Supabase
7. ALERT-013: Naprawić memory leak w webhooks
8. ALERT-011: Dodać testy dla serwisów
9. ALERT-016: Zweryfikować feature flagi

### Sprint 3 (Długoterminowe):
10. ALERT-010: Wydzielić wspólną logikę normalizacji
11. ALERT-014: Zunifikować formaty API responses
12. ALERT-012: Zmienić dynamic import na static
13. ALERT-007: Dodać walidację zamiast placeholderów

---

**Ostatnia aktualizacja:** 2025-01-XX  
**Status:** 🟡 W TRAKCIE NAPRAWY


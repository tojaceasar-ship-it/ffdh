<!-- dc9ccbca-fc8a-486f-ab96-28d42b13c805 291a55c4-be08-4204-ae0d-16c40bfe1b6f -->
# FFDH Bot Army - PRO Gold Final System

## Architektura systemu

### Główny orchestrator

**Lokalizacja:** `bots/orchestrator/`

- Koordynuje pracę wszystkich botów
- Zarządza kolejką zadań i zależnościami
- Monitoruje postęp i raportuje status
- Obsługuje CLI i Web Dashboard API
- Integruje się z Knowledge Base dla dostępu do danych

### Knowledge Base (Centralne Repozytorium Wiedzy)

**Lokalizacja:** `bots/knowledge-base/`

- Centralne repozytorium wiedzy dla wszystkich botów
- Przechowuje: koncept projektu, design system, API config, content specs, requirements
- Bezpieczne przechowywanie secrets (gitignored)
- Walidacja i weryfikacja kompletności danych
- Ładowanie i cache dla wydajności

### Wyspecjalizowane boty

1. **CodeBot** (`bots/code-bot/`)

                                                - Generuje brakujące strony (Lookbook, Manifest)
                                                - Tworzy API routes (Printful proxy)
                                                - Implementuje funkcjonalności (Auth system, sitemap)
                                                - Naprawia błędy i optymalizuje kod

2. **ConfigBot** (`bots/config-bot/`)

                                                - Konfiguruje zmienne środowiskowe
                                                - Ustawia webhook security
                                                - Konfiguruje Printful/Stripe
                                                - Weryfikuje konfigurację

3. **ContentBot** (`bots/content-bot/`)

                                                - Populuje Sanity CMS (produkty, sceny, manifest)
                                                - Generuje treści z AI (opisy, narracje)
                                                - Optymalizuje obrazy
                                                - Tworzy structured data (JSON-LD)

4. **TestBot** (`bots/test-bot/`)

                                                - Tworzy E2E testy dla critical paths
                                                - Rozszerza unit testy
                                                - Uruchamia Lighthouse audits
                                                - Weryfikuje accessibility

5. **DeployBot** (`bots/deploy-bot/`)

                                                - Konfiguruje CI/CD pipeline
                                                - Weryfikuje deployment readiness
                                                - Wykonuje deployment do staging/production
                                                - Monitoruje post-deployment health

## Struktura projektu

````
bots/
├── knowledge-base/                    # Knowledge Base System
│   ├── src/
│   │   ├── knowledge-loader.ts        # Ładowanie i walidacja danych
│   │   ├── knowledge-validator.ts     # Weryfikacja kompletności
│   │   └── knowledge-api.ts          # API dla botów
│   ├── data/
│   │   ├── project-concept.json       # Koncept projektu (README, architektura)
│   │   ├── design-system.json         # Design system (kolory, fonty, style)
│   │   ├── api-config.json            # Konfiguracja API (bez secrets)
│   │   ├── content-specs.json         # Specyfikacje treści (min words, fields)
│   │   ├── requirements.json          # Definition of Done, tasks, priorities
│   │   └── schemas/                   # Schematy danych
│   │       ├── sanity-schemas.json
│   │       ├── supabase-schemas.json
│   │       └── api-schemas.json
│   ├── secrets/                       # Gitignored - secrets
│   │   ├── api-keys.json              # Wszystkie klucze API
│   │   └── webhook-secrets.json       # Webhook secrets
│   ├── templates/                     # Szablony dla botów
│   │   ├── page-templates/
│   │   ├── component-templates/
│   │   └── content-templates/
│   └── package.json
│
├── orchestrator/
│   ├── src/
│   │   ├── orchestrator.ts          # Główna logika orchestracji
│   │   ├── task-queue.ts            # Kolejka zadań z zależnościami
│   │   ├── bot-manager.ts           # Zarządzanie botami
│   │   ├── progress-tracker.ts      # Śledzenie postępu
│   │   ├── knowledge-integration.ts # Integracja z Knowledge Base
│   │   └── api/
│   │       ├── cli.ts               # CLI interface
│   │       └── dashboard-api.ts     # REST API dla dashboardu
│   ├── templates/                   # Szablony zadań
│   └── package.json
│
├── code-bot/
│   ├── src/
│   │   ├── page-generator.ts        # Generowanie stron Next.js
│   │   ├── api-generator.ts         # Generowanie API routes
│   │   ├── auth-implementer.ts      # Implementacja auth
│   │   ├── sitemap-generator.ts     # Generowanie sitemap.xml
│   │   └── code-optimizer.ts       # Optymalizacja kodu
│   ├── templates/                   # Szablony kodu
│   └── package.json
│
├── config-bot/
│   ├── src/
│   │   ├── env-configurator.ts      # Konfiguracja env vars
│   │   ├── webhook-setup.ts         # Konfiguracja webhooks
│   │   ├── service-config.ts        # Konfiguracja serwisów
│   │   └── config-verifier.ts       # Weryfikacja konfiguracji
│   └── package.json
│
├── content-bot/
│   ├── src/
│   │   ├── sanity-populator.ts      # Populacja Sanity CMS
│   │   ├── content-generator.ts     # Generowanie treści AI
│   │   ├── image-optimizer.ts       # Optymalizacja obrazów
│   │   └── structured-data.ts       # JSON-LD schema
│   ├── templates/                   # Szablony treści
│   └── package.json
│
├── test-bot/
│   ├── src/
│   │   ├── e2e-generator.ts         # Generowanie E2E testów
│   │   ├── test-runner.ts           # Uruchamianie testów
│   │   ├── lighthouse-runner.ts     # Lighthouse audits
│   │   └── a11y-checker.ts          # Accessibility checks
│   └── package.json
│
├── deploy-bot/
│   ├── src/
│   │   ├── cicd-setup.ts            # Konfiguracja CI/CD
│   │   ├── deployment-verifier.ts   # Weryfikacja gotowości
│   │   ├── deployer.ts              # Wykonanie deploymentu
│   │   └── health-monitor.ts        # Monitoring post-deploy
│   └── package.json
│
├── dashboard/                          # Web Dashboard
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Dashboard główny
│   │   ├── api/
│   │   │   └── status/route.ts       # API status
│   │   └── components/
│   │       ├── TaskList.tsx
│   │       ├── ProgressChart.tsx
│   │       └── BotStatus.tsx
│   └── package.json
│
├── shared/
│   ├── types/                        # Wspólne typy TypeScript
│   ├── utils/                        # Wspólne utilities
│   │   └── knowledge-loader.ts        # Wspólny loader dla botów
│   └── constants/                    # Stałe i konfiguracja
│
└── package.json                      # Root package.json (workspace)

## Implementacja - Faza 0: Knowledge Base (1-2 dni)

### 0.1 Knowledge Base Infrastructure
**Pliki:**
- `bots/knowledge-base/src/knowledge-loader.ts`
- `bots/knowledge-base/src/knowledge-validator.ts`
- `bots/knowledge-base/src/knowledge-api.ts`

**Zadania:**
- Utworzyć strukturę Knowledge Base
- Zaimplementować loader z walidacją
- Zaimplementować API dla botów
- Dodać error handling i cache

### 0.2 Extract Project Concept
**Pliki:**
- `bots/knowledge-base/data/project-concept.json`

**Zadania:**
- Wyekstrahować koncept z `README.md`
- Wyekstrahować architekturę z dokumentacji
- Dodać informacje o routes i strukturze projektu
- Zintegrować z `MiroEXPORT.md` (struktura plików)

### 0.3 Extract Design System
**Pliki:**
- `bots/knowledge-base/data/design-system.json`

**Zadania:**
- Wyekstrahować kolory z `tailwind.config.ts`
- Wyekstrahować fonty (Orbitron, Inter, Rajdhani, Bungee)
- Wyekstrahować emotional agents z `src/config/emotionalAgents.ts`
- Dodać animacje i style z `src/styles/globals.css`

### 0.4 Extract API Configuration
**Pliki:**
- `bots/knowledge-base/data/api-config.json`
- `bots/knowledge-base/secrets/api-keys.json` (gitignored)

**Zadania:**
- Wyekstrahować konfigurację z `docs/ENV_CHECKLIST.md`
- Utworzyć template dla API config (bez secrets)
- Utworzyć strukturę dla secrets (gitignored)
- Dodać walidację wymaganych kluczy

### 0.5 Extract Content Specifications
**Pliki:**
- `bots/knowledge-base/data/content-specs.json`

**Zadania:**
- Wyekstrahować wymagania z `TODO_FOR_HUMAN.md`
- Dodać specyfikacje produktów (min 10, 150 słów opis)
- Dodać specyfikacje scen (min 15, 200 słów narracja)
- Dodać specyfikacje manifest (min 800 słów)
- Zintegrować z `content/auto_products.json` i `content/auto_scenes.json`

### 0.6 Extract Requirements
**Pliki:**
- `bots/knowledge-base/data/requirements.json`

**Zadania:**
- Wyekstrahować Definition of Done z `docs/FFDH_DEFINITION_OF_DONE.md`
- Dodać listę zadań z priorytetami z `reports/CRITICAL_PATH.md`
- Dodać quality gates (Lighthouse ≥95, tests ≥70%)
- Dodać acceptance criteria

### 0.7 Extract Schemas
**Pliki:**
- `bots/knowledge-base/data/schemas/sanity-schemas.json`
- `bots/knowledge-base/data/schemas/supabase-schemas.json`
- `bots/knowledge-base/data/schemas/api-schemas.json`

**Zadania:**
- Wyekstrahować Sanity schemas z `src/lib/sanity-schemas.md`
- Wyekstrahować Supabase schemas z migrations
- Wyekstrahować API schemas z route files
- Dodać walidację zgodności schematów

### 0.8 Integration with Orchestrator
**Pliki:**
- `bots/orchestrator/src/knowledge-integration.ts`
- `bots/shared/utils/knowledge-loader.ts`

**Zadania:**
- Zintegrować Knowledge Base z orchestratorem
- Dodać dostęp do Knowledge Base dla wszystkich botów
- Zaimplementować cache dla wydajności
- Dodać weryfikację kompletności przed startem

## Implementacja - Faza 1: Infrastructure (2-3 dni)

### 1.1 Setup workspace i orchestrator
**Pliki:**
- `bots/package.json` - Root workspace config
- `bots/orchestrator/src/orchestrator.ts` - Główna logika
- `bots/orchestrator/src/task-queue.ts` - System kolejki zadań
- `bots/orchestrator/src/knowledge-integration.ts` - Integracja z KB

**Zadania:**
- Utworzyć monorepo workspace (npm workspaces)
- Zaimplementować orchestrator z systemem kolejki
- Dodać zarządzanie zależnościami między zadaniami
- Zaimplementować CLI interface podstawowy
- Zintegrować z Knowledge Base (wczytać dane przed startem)

### 1.2 Bot framework
**Pliki:**
- `bots/shared/types/bot.types.ts` - Interfejsy botów
- `bots/shared/utils/bot-communicator.ts` - Komunikacja bot-orchestrator
- `bots/orchestrator/src/bot-manager.ts` - Zarządzanie botami

**Zadania:**
- Zdefiniować interfejsy dla wszystkich botów
- Zaimplementować system komunikacji (event-based)
- Dodać error handling i retry logic
- Utworzyć system logowania

## Implementacja - Faza 2: CodeBot (3-4 dni)

### 2.1 Page Generator
**Pliki:**
- `bots/code-bot/src/page-generator.ts`
- `bots/code-bot/templates/lookbook-page.ts`
- `bots/code-bot/templates/manifest-page.ts`

**Zadania:**
- Generować `app/lookbook/page.tsx` z Sanity CMS integration
- Generować `app/manifest/page.tsx` z Sanity CMS integration
- Dodać layout files z SEO metadata
- Zintegrować z istniejącym routing system

### 2.2 API Generator
**Pliki:**
- `bots/code-bot/src/api-generator.ts`
- `bots/code-bot/templates/printful-proxy.ts`

**Zadania:**
- Generować `app/api/printful/route.ts` z retry/cache logic
- Dodać error handling i rate limiting
- Zintegrować z istniejącym `printfulService.ts`

### 2.3 Auth Implementer
**Pliki:**
- `bots/code-bot/src/auth-implementer.ts`
- `bots/code-bot/templates/auth-components.ts`

**Zadania:**
- Rozszerzyć `app/auth/login/page.tsx` z pełną funkcjonalnością
- Rozszerzyć `app/auth/register/page.tsx`
- Dodać protected routes middleware
- Zintegrować z NextAuth + Supabase

### 2.4 Sitemap Generator
**Pliki:**
- `bots/code-bot/src/sitemap-generator.ts`

**Zadania:**
- Generować `app/sitemap.ts` (Next.js dynamic sitemap)
- Uwzględnić wszystkie routes (static + dynamic)
- Dodać priority i changefreq

## Implementacja - Faza 3: ConfigBot (1-2 dni)

### 3.1 Environment Configurator
**Pliki:**
- `bots/config-bot/src/env-configurator.ts`

**Zadania:**
- Wykrywać brakujące env vars z Knowledge Base (`api-config.json`)
- Interaktywnie zbierać wartości (z możliwością auto-detect)
- Aktualizować `.env.local` i `.env.production.local`
- Weryfikować poprawność wartości
- Zapisywać secrets do `knowledge-base/secrets/api-keys.json`

### 3.2 Webhook Setup
**Pliki:**
- `bots/config-bot/src/webhook-setup.ts`

**Zadania:**
- Ustawić `ENABLE_SIGNATURE_CHECK=true` w production
- Zweryfikować konfigurację webhooków Stripe/Printful
- Wygenerować instrukcje dla webhook URLs

### 3.3 Service Config
**Pliki:**
- `bots/config-bot/src/service-config.ts`

**Zadania:**
- Skonfigurować Printful API credentials
- Skonfigurować Stripe credentials
- Zweryfikować połączenia z serwisami

## Implementacja - Faza 4: ContentBot (4-5 dni)

### 4.1 Sanity Populator
**Pliki:**
- `bots/content-bot/src/sanity-populator.ts`
- `bots/content-bot/templates/product-template.ts`
- `bots/content-bot/templates/scene-template.ts`
- `bots/content-bot/templates/manifest-template.ts`

**Zadania:**
- Populować produkty w Sanity (min. 10) z `content/auto_products.json`
- Populować sceny emocjonalne (min. 15) z `content/auto_scenes.json`
- Utworzyć manifest content w Sanity
- Dodać kategorie i tagi
- Używać `content-specs.json` z Knowledge Base dla wymagań

### 4.2 Content Generator (AI-powered)
**Pliki:**
- `bots/content-bot/src/content-generator.ts`

**Zadania:**
- Generować opisy produktów (PL + EN, min. 150 słów) - używa `content-specs.json`
- Generować narracje scen (min. 200 słów) - używa `content-specs.json`
- Generować manifest FFDH (min. 800 słów) - używa `content-specs.json`
- Używać OpenAI API z istniejącym `aiService.ts`
- Używać `design-system.json` dla brand voice i stylu

### 4.3 Image Optimizer
**Pliki:**
- `bots/content-bot/src/image-optimizer.ts`

**Zadania:**
- Optymalizować obrazy produktów (WebP conversion)
- Generować placeholder images jeśli brakuje
- Dodać lazy loading attributes

### 4.4 Structured Data
**Pliki:**
- `bots/content-bot/src/structured-data.ts`

**Zadania:**
- Generować JSON-LD schema dla produktów
- Generować JSON-LD dla organizacji
- Dodać breadcrumbs schema

## Implementacja - Faza 5: TestBot (3-4 dni)

### 5.1 E2E Test Generator
**Pliki:**
- `bots/test-bot/src/e2e-generator.ts`
- `bots/test-bot/templates/e2e-critical-paths.ts`

**Zadania:**
- Generować E2E testy dla critical paths (Playwright)
- Testy: homepage → shop → product → checkout → success
- Testy: rewir → scene detail → comment → AI reply
- Testy: auth flow (login/register)
- Używać `requirements.json` i `project-concept.json` z Knowledge Base

### 5.2 Test Runner
**Pliki:**
- `bots/test-bot/src/test-runner.ts`

**Zadania:**
- Uruchamiać pełną suitę testów (unit + E2E)
- Raportować coverage
- Weryfikować thresholdy (≥70% coverage)

### 5.3 Lighthouse Runner
**Pliki:**
- `bots/test-bot/src/lighthouse-runner.ts`

**Zadania:**
- Uruchamiać Lighthouse audits (mobile + desktop)
- Weryfikować score ≥95 (z `requirements.json`)
- Optymalizować Core Web Vitals jeśli potrzeba

### 5.4 A11y Checker
**Pliki:**
- `bots/test-bot/src/a11y-checker.ts`

**Zadania:**
- Uruchamiać pa11y-ci checks
- Weryfikować WCAG 2.1 AA compliance
- Raportować violations

## Implementacja - Faza 6: DeployBot (2-3 dni)

### 6.1 CI/CD Setup
**Pliki:**
- `bots/deploy-bot/src/cicd-setup.ts`
- `.github/workflows/deploy.yml` (jeśli GitHub)

**Zadania:**
- Konfigurować GitHub Actions workflow
- Dodać quality gates (build, test, lint)
- Skonfigurować auto-deploy do Vercel

### 6.2 Deployment Verifier
**Pliki:**
- `bots/deploy-bot/src/deployment-verifier.ts`

**Zadania:**
- Weryfikować wszystkie wymagania przed deploy (z `requirements.json`)
- Sprawdzać env vars w Vercel (z `api-config.json`)
- Weryfikować build success
- Sprawdzać test coverage (z `requirements.json`)

### 6.3 Deployer
**Pliki:**
- `bots/deploy-bot/src/deployer.ts`

**Zadania:**
- Wykonywać deployment do staging
- Wykonywać deployment do production
- Używać Vercel CLI API

### 6.4 Health Monitor
**Pliki:**
- `bots/deploy-bot/src/health-monitor.ts`

**Zadania:**
- Monitorować `/api/health` endpoint
- Weryfikować wszystkie routes (200 OK)
- Sprawdzać external API connections
- Raportować post-deployment status

## Implementacja - Faza 7: Dashboard (2-3 dni)

### 7.1 Dashboard API
**Pliki:**
- `bots/dashboard/app/api/status/route.ts`
- `bots/dashboard/app/api/tasks/route.ts`
- `bots/dashboard/app/api/bots/route.ts`

**Zadania:**
- REST API dla statusu orchestratora
- Endpoint dla listy zadań
- Endpoint dla statusu botów
- WebSocket dla real-time updates (opcjonalnie)

### 7.2 Dashboard UI
**Pliki:**
- `bots/dashboard/app/page.tsx` - Main dashboard
- `bots/dashboard/app/components/TaskList.tsx`
- `bots/dashboard/app/components/ProgressChart.tsx`
- `bots/dashboard/app/components/BotStatus.tsx`

**Zadania:**
- UI pokazujący postęp wszystkich zadań
- Wizualizacja zależności między zadaniami
- Status każdego bota (idle/running/completed/error)
- Logi w czasie rzeczywistym

## Integracja Knowledge Base z botami

### CodeBot używa Knowledge Base dla:
- Design system (kolory, fonty) przy generowaniu komponentów
- Project concept (routes, struktura) przy generowaniu stron
- API schemas przy generowaniu API routes

### ConfigBot używa Knowledge Base dla:
- API config template (wymagane env vars)
- Secrets structure (walidacja kluczy)
- Service configurations

### ContentBot używa Knowledge Base dla:
- Content specs (min words, required fields)
- Design system (brand colors, fonts) w generowanych treściach
- Sanity schemas (struktura danych)

### TestBot używa Knowledge Base dla:
- Requirements (quality gates, thresholds)
- API schemas (testowanie endpointów)
- Routes (testowanie critical paths)

### DeployBot używa Knowledge Base dla:
- Requirements (deployment readiness criteria)
- API config (weryfikacja env vars)
- Project concept (weryfikacja struktury)

## Integracja z istniejącym projektem

### Wykorzystanie istniejących skryptów
- `scripts/check-env.mjs` - ConfigBot użyje do weryfikacji
- `scripts/populate-cms.mjs` - ContentBot rozszerzy
- `scripts/import-scenes.mjs` - ContentBot użyje jako źródło
- `scripts/import-products.mjs` - ContentBot użyje jako źródło

### Integracja z serwisami
- `src/services/aiService.ts` - ContentBot użyje do generowania treści
- `src/services/printfulService.ts` - CodeBot zintegruje z nowym proxy
- `src/lib/supabase.ts` - Wszystkie boty używają do DB operations
- `src/lib/sanity.ts` - ContentBot użyje do populacji CMS

## Workflow wykonania

1. **Inicjalizacja:** `ffdh-bots start`
                           - Knowledge Base loader weryfikuje kompletność danych
                           - Ładuje wszystkie konfiguracje do pamięci
                           - Orchestrator analizuje projekt
                           - Generuje listę zadań z zależnościami
                           - Tworzy execution plan
                           - Boty otrzymują dostęp do odpowiednich sekcji Knowledge Base

2. **Wykonanie:** Automatyczne
                           - Orchestrator przydziela zadania botom
                           - Boty wykonują zadania równolegle (gdy możliwe)
                           - Postęp jest śledzony i raportowany

3. **Weryfikacja:** Po każdym zadaniu
                           - Build verification
                           - Test verification
                           - Code quality checks

4. **Deployment:** Po ukończeniu wszystkich zadań
                           - DeployBot weryfikuje gotowość
                           - Deployment do staging
                           - Smoke tests
                           - Deployment do production

5. **Raportowanie:** Końcowy raport
                           - Lista wykonanych zadań
                           - Metryki (czas, coverage, performance)
                           - Instrukcje post-deployment

## Pliki konfiguracyjne

### `bots/config/tasks.json`
Definicja wszystkich zadań z priorytetami i zależnościami:
```json
{
  "tasks": [
    {
      "id": "TASK-LOOKBOOK-PAGE",
      "bot": "code-bot",
      "priority": "P1",
      "estimatedTime": 60,
      "dependencies": [],
      "autoComplete": true
    }
  ]
}
````

### `bots/config/bots.json`

Konfiguracja botów:

```json
{
  "code-bot": {
    "enabled": true,
    "parallelTasks": 2,
    "retryAttempts": 3
  }
}
```

## Bezpieczeństwo Knowledge Base

- Secrets w `secrets/` są gitignored (dodane do `.gitignore`)
- Pre-commit hook weryfikuje brak secrets w tracked files
- Environment-based loading (dev vs production)
- Opcjonalne szyfrowanie dla production secrets
- Walidacja przed użyciem (wszystkie wymagane dane obecne)

## Bezpieczeństwo i rollback

- Każde zadanie tworzy commit przed wykonaniem
- Możliwość rollback do poprzedniego stanu
- Feature flags dla nowych funkcjonalności
- Staging deployment przed production

## Metryki sukcesu

- 100% completion wszystkich zadań z Definition of Done
- Wszystkie testy passing (unit + E2E)
- Lighthouse score ≥95
- Zero critical security issues
- Successful production deployment

### To-dos

- [ ] Utworzyć strukturę Knowledge Base (knowledge-base/ z data/, secrets/, templates/)
- [ ] Zaimplementować Knowledge Base loader i validator (knowledge-loader.ts, knowledge-validator.ts)
- [ ] Wyekstrahować project concept z README.md i dokumentacji do project-concept.json
- [ ] Wyekstrahować design system z tailwind.config.ts i styles/ do design-system.json
- [ ] Wyekstrahować API configuration z ENV_CHECKLIST.md do api-config.json (bez secrets)
- [ ] Utworzyć strukturę secrets (secrets/api-keys.json gitignored)
- [ ] Wyekstrahować content specifications z TODO_FOR_HUMAN.md do content-specs.json
- [ ] Wyekstrahować requirements z FFDH_DEFINITION_OF_DONE.md i CRITICAL_PATH.md do requirements.json
- [ ] Wyekstrahować schemas (Sanity, Supabase, API) do schemas/*.json
- [ ] Zintegrować Knowledge Base z orchestratorem (knowledge-integration.ts)
- [ ] Dodać dostęp do Knowledge Base dla wszystkich botów (shared/utils/knowledge-loader.ts)
- [ ] Utworzyć monorepo workspace dla botów (bots/package.json z workspaces), skonfigurować TypeScript, ESLint, Prettier dla całego workspace
- [ ] Zaimplementować główny orchestrator (orchestrator.ts, task-queue.ts, bot-manager.ts) z systemem kolejki zadań i zarządzaniem zależnościami
- [ ] Zaimplementować CLI interface dla orchestratora (cli.ts) z komendami: start, status, stop, resume
- [ ] Zaimplementować CodeBot page generator - generowanie app/lookbook/page.tsx i app/manifest/page.tsx z Sanity CMS integration (używa design-system.json)
- [ ] Zaimplementować CodeBot API generator - generowanie app/api/printful/route.ts z retry/cache/error handling (używa api-config.json)
- [ ] Zaimplementować CodeBot auth implementer - rozszerzenie app/auth/login i register z pełną funkcjonalnością NextAuth + Supabase (używa project-concept.json)
- [ ] Zaimplementować CodeBot sitemap generator - generowanie app/sitemap.ts z dynamic routes (używa project-concept.json)
- [ ] Zaimplementować ConfigBot env configurator - wykrywanie brakujących env vars z api-config.json, interaktywne zbieranie wartości, aktualizacja .env files
- [ ] Zaimplementować ConfigBot webhook setup - konfiguracja ENABLE_SIGNATURE_CHECK, weryfikacja Stripe/Printful webhooks (używa api-config.json)
- [ ] Zaimplementować ContentBot Sanity populator - populacja produktów (10+), scen (15+), manifest z content/auto_*.json zgodnie z content-specs.json
- [ ] Zaimplementować ContentBot AI content generator - generowanie opisów produktów, narracji scen, manifest używając OpenAI API (używa content-specs.json)
- [ ] Zaimplementować ContentBot image optimizer - optymalizacja obrazów (WebP), placeholder generation, lazy loading (używa design-system.json)
- [ ] Zaimplementować TestBot E2E generator - generowanie Playwright testów dla critical paths (używa requirements.json i project-concept.json)
- [ ] Zaimplementować TestBot Lighthouse runner - uruchamianie audits, weryfikacja score ≥95 z requirements.json, optymalizacja Core Web Vitals
- [ ] Zaimplementować DeployBot CI/CD setup - konfiguracja GitHub Actions workflow z quality gates (używa requirements.json)
- [ ] Zaimplementować DeployBot deployment verifier - weryfikacja wymagań przed deploy z requirements.json (env vars, build, tests)
- [ ] Zaimplementować DeployBot deployer - wykonanie deploymentu do staging i production używając Vercel CLI
- [ ] Zaimplementować Dashboard API - REST endpoints dla statusu, zadań, botów (app/api/status, /tasks, /bots)
- [ ] Zaimplementować Dashboard UI - Next.js dashboard z TaskList, ProgressChart, BotStatus components, real-time updates
- [ ] Utworzyć testy integracyjne dla całego systemu botów - weryfikacja end-to-end workflow od start do deployment
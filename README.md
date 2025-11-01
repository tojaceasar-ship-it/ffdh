# Fruits From Da Hood · Rewir 2.0

Premium Next.js portal for the FFDH × Rewir collaboration. The app blends AI-generated street narratives with a commerce flow ready for production.

---

## ⚡ Quick Start

```bash
npm install
cp .env.example .env.local  # Fill in the keys listed below
npm run dev
# Visit http://localhost:3000
```

---

## 🔌 Environment Variables

| Category | Keys |
|----------|------|
| **Sanity** | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_AUTH_TOKEN` |
| **Supabase** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| **Stripe** | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| **Printful** | `PRINTFUL_API_KEY`, `PRINTFUL_WEBHOOK_SECRET` |
| **Monitoring (optional)** | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN` |
| **App** | `NEXT_PUBLIC_APP_URL`, `NODE_ENV` |

Store secrets in `.env.local` and replicate them in Vercel for production deployments.

---

## 🧭 Core Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/rewir` | Emotion-driven scene grid |
| `/rewir/[slug]` | Scene detail with AI feedback |
| `/shop` | Product catalogue |
| `/product/[slug]` | Product details |
| `/shop/cart` | Cart overview |
| `/checkout` | Checkout funnel |
| `/success` / `/cancel` | Post-payment states |
| `/about`, `/contact`, `/terms`, `/privacy` | Company & legal info |

Legacy Polish paths such as `/sklep` and `/o-nas` redirect to their English equivalents.

---

## 🎭 Rewir 2.0 Highlights

- `/api/rewir/generate` produces narratives via OpenAI or a local emotion-map fallback.
- `useEmotionProfile` stores nickname, preferred mood, and last scene to tint the interface.
- Supabase-powered reactions with a local event bus fallback keep the grid live.
- AI feedback box writes comments to Supabase, logs replies to `feedback_logs`, and shows a typing indicator.
- Scenes merge Supabase data, Sanity CMS entries, and `content/auto_scenes.json` when offline.

Read the full architecture in [`docs/AI_SCENE_SYSTEM.md`](docs/AI_SCENE_SYSTEM.md).

---

## 🛒 Shop & Checkout Flow

1. `/shop` lists products via Supabase or falls back to `content/auto_products.json`.
2. `/product/[slug]` exposes product info and add-to-cart.
3. `/shop/cart` displays Redux cart state.
4. `/checkout` posts to `/api/checkout`; if Stripe keys are missing a mock session is returned.
5. `/success` clears the cart, `/cancel` invites the user to resume.

`supabase/migrations/004_scene_reactions_feedback.sql` provisions reactions and feedback tables.

---

## 🧰 Commands

```bash
# Development
npm run dev

# Build & preview
npm run build
npm run preview

# Quality
npm run lint
npm run type-check
npm run test          # Vitest
npm run test:e2e      # Playwright
npm run lhci          # Lighthouse
npm run a11y          # pa11y

# Data / CMS
npm run sanity:dev
npm run seed
npm run import:products
```

---

## ✅ Quality Gates

| Gate | Command |
|------|---------|
| Lint | `npm run lint` |
| Build | `npm run build` |
| Unit tests | `npm run test` |
| E2E tests | `npm run test:e2e` |
| Accessibility | `npm run a11y` |
| Performance | `npm run lhci` |

Lint and build must pass before shipping. Run tests and audits as needed.

---

## 🚀 Deployment (Vercel)

1. Push the repository to GitHub.
2. Create a Vercel project and link the repo.
3. Add production environment variables.
4. Configure webhooks:
   - Stripe → `/api/stripe/webhook`
   - Printful → `/api/printful/webhook`
5. Deploy (`npm run build` already validated the bundle).

Operational recovery steps are documented in [`RUNBOOK.md`](RUNBOOK.md).

---

## 📚 Additional Docs

- [`docs/AI_SCENE_SYSTEM.md`](docs/AI_SCENE_SYSTEM.md)
- [`RUNBOOK.md`](RUNBOOK.md)
- [`TODO_FOR_HUMAN.md`](TODO_FOR_HUMAN.md)
- [`AUTOMATION_REPORT.md`](AUTOMATION_REPORT.md)

Glow bright. 🧃


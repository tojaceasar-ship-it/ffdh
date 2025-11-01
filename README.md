# 🍉 Fruits From Da Hood – Next.js Premium Streetwear Portal

**Built for urban culture. Zero GMO, 100% ulicy.**

---

## 📋 Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local (copy from .env.example)
cp .env.example .env.local

# 3. Fill in your API keys
# - Sanity CMS
# - Supabase
# - Stripe
# - Printful

# 4. Start development server
npm run dev

# 5. Open http://localhost:3000
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS 3.4 + CSS Variables |
| **Animations** | Framer Motion 11 |
| **State** | Redux Toolkit 1.9 + React Query |
| **CMS** | Sanity (Headless) |
| **Database** | Supabase (PostgreSQL) |
| **E-commerce** | Printful API + Stripe |
| **Auth** | Supabase Auth |
| **Testing** | Vitest + Playwright + Lighthouse CI + pa11y |
| **Security** | Sentry + Zod validation + Webhook verification |
| **Deployment** | Vercel (Main + Admin Panel) |

---

## 📂 Project Structure

```
ffdh-next/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout + providers
│   ├── page.tsx                 # Homepage
│   ├── (auth)/                  # Auth group: login, register, profile
│   ├── (shop)/                  # Shop group: products, checkout
│   ├── (community)/             # Community: rewir, scenes, forum
│   ├── admin/                   # Admin dashboard
│   ├── api/                     # API routes
│   │   ├── checkout/route.ts
│   │   ├── stripe/webhook/route.ts
│   │   ├── comments/route.ts
│   │   └── ai-reply/route.ts
│   └── globals.css              # Global Tailwind directives
│
├── src/
│   ├── components/
│   │   ├── ui/                  # Button, Input, Header, Footer, etc.
│   │   ├── layout/              # Nav, Sidebar, Layout wrapper
│   │   ├── sections/            # Hero, DropGrid, Manifest
│   │   └── forms/               # Checkout, Comment forms
│   │
│   ├── lib/
│   │   ├── sanity/              # Sanity client + image builder
│   │   ├── supabase.ts          # Supabase client
│   │   ├── stripe.ts            # Stripe initialization
│   │   ├── printful.ts          # Printful API wrapper
│   │   └── api-client.ts        # Fetch wrapper
│   │
│   ├── services/                # Business logic
│   │   ├── auth.service.ts
│   │   ├── shop.service.ts
│   │   ├── ai.service.ts
│   │   └── comment.service.ts
│   │
│   ├── store/                   # Redux store
│   │   ├── index.ts
│   │   ├── slices/
│   │   │   ├── cart.slice.ts
│   │   │   ├── auth.slice.ts
│   │   │   └── ui.slice.ts
│   │   └── hooks.ts
│   │
│   ├── contexts/                # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── hooks/                   # React hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useFetch.ts
│   │
│   ├── types/                   # TypeScript types
│   │   ├── index.ts
│   │   ├── sanity.ts
│   │   └── api.ts
│   │
│   ├── middleware.ts            # Edge middleware
│   └── env.ts                   # Environment validation
│
├── sanity/                      # Sanity CMS Studio
│   ├── sanity.config.ts
│   ├── schemas/
│   │   ├── character.ts
│   │   ├── scene.ts
│   │   ├── drop.ts
│   │   ├── product.ts
│   │   └── navigation.ts
│   └── lib/
│       └── image.ts
│
├── public/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   └── manifest.json
│
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind theme + colors
├── tsconfig.json                # TypeScript config
├── package.json
├── .env.example                 # Environment template
├── README.md                    # This file
└── DEPLOYMENT.md                # Vercel deployment guide
```

---

## 🎨 Design System

### Neon Colors (CSS Variables)

```css
:root {
  /* Brand Neon */
  --color-primary: #FFD700;       /* Yellow */
  --color-secondary: #00CED1;     /* Cyan */
  --color-accent: #FF4500;        /* Orange */
  --color-success: #32CD32;       /* Green */
  --color-error: #FF6B6B;         /* Red */

  /* Shadows */
  --shadow-neon: 0 0 20px rgba(255, 215, 0, 0.3);
  --shadow-neon-secondary: 0 0 20px rgba(0, 206, 209, 0.3);
}
```

### Fonts

- **Headline:** Orbitron (sci-fi/tech)
- **Body:** Inter (readability)
- **CTA:** Rajdhani (bold)
- **Accent:** Bungee (graffiti)

### Animations

- `neon-pulse` – 2s infinite pulsing glow
- `glitch` – 0.1s text distortion
- `fade-in` – opacity transition
- `slide-up` / `slide-down` – direction transitions

---

## 🔧 Development

### Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)

# Build & Deploy
npm run build            # Production build
npm run start            # Start production server

# Quality
npm run lint             # ESLint check
npm run format           # Prettier formatting
npm run type-check       # TypeScript type check

# Quality Assurance
npm run lint             # ESLint check
npm run lint:fix         # Auto-fix ESLint issues
npm run type-check       # TypeScript type check
npm run test             # Vitest unit tests
npm run test:coverage    # Unit tests with coverage
npm run test:unit        # Run unit tests only
npm run test:e2e         # Playwright E2E tests
npm run test:e2e:ui      # E2E tests with UI
npm run test:e2e:debug   # Debug E2E tests
npm run test:ci          # Full test suite (unit + e2e)
npm run lhci             # Lighthouse performance tests
npm run a11y             # Accessibility tests (pa11y)
npm run a11y:ci          # Accessibility tests for CI

# Development
npm run build            # Production build
npm run preview          # Preview production build
npm run build:analyze    # Bundle analyzer

# CMS & Data
npm run sanity:dev       # Start Sanity Studio
npm run seed             # Seed Sanity with initial data
npm run import:products  # Sync Printful products to Sanity
```

---

## 🔌 Environment Variables

Copy `.env.example` → `.env.local` and fill in:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_AUTH_TOKEN=sk_xxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Printful
PRINTFUL_API_KEY=your_api_key
PRINTFUL_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Monitoring (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://xxxx@sentry.io/project_id
SENTRY_AUTH_TOKEN=your_sentry_auth_token

# Environment
NODE_ENV=development
```

---

## 📡 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/checkout` | POST | Create Stripe session |
| `/api/stripe/webhook` | POST | Stripe webhook handler |
| `/api/comments` | GET/POST | Fetch/add comments |
| `/api/ai-reply` | POST | Generate AI response |
| `/api/auth/login` | POST | Supabase login |
| `/api/auth/register` | POST | Supabase signup |

---

## 🛒 E-commerce Flow

1. **Showcase** → `/sklep` (drop listing from Sanity)
2. **Product** → `/sklep/product/[slug]` (Printful mockup + details)
3. **Cart** → Redux state (add/remove items)
4. **Checkout** → `/checkout` (collect shipping)
5. **Payment** → `POST /api/checkout` → Stripe session
6. **Webhook** → Stripe event → Printful order → Supabase record

---

## 🔐 Security & Moderation

- ✅ Age verification (16+) on auth
- ✅ GDPR disclaimer on forms
- ✅ Anonimization of user data
- ✅ AI sentiment analysis (toxic threshold)
- ✅ Panic button for users
- ✅ Admin review queue (Sanity)

---

## 🚀 Deployment (Vercel)

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial FFDH commit"
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select GitHub repo
   - Add environment variables
   - Deploy!

3. **Configure Webhooks**
   - Stripe: `https://your-domain.vercel.app/api/stripe/webhook`
   - Sanity: `https://your-domain.vercel.app/api/sanity/webhook`

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for detailed guide.

---

## 📝 Configuration Files

### tailwind.config.ts
Extends base Tailwind with neon colors, custom fonts, animations.

### next.config.js
- Image optimization (Sanity CDN, Printful)
- Package imports optimization
- Experimental features

### tsconfig.json
- Strict mode enabled
- `@/*` path alias for `src/` and `app/`

### package.json
All dependencies pinned to specific versions for reproducibility.

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Lint & format: `npm run lint && npm run format`
3. Type check: `npm run type-check`
4. Test: `npm test`
5. Commit: `git commit -m "feat: description"`
6. Push: `git push origin feature/name`
7. PR → review → merge

---

## 📊 Performance

- **Core Web Vitals:** Optimized for LCP, CLS, FID
- **Image:** Next.js automatic optimization + Sanity CDN
- **Bundle:** Tree-shaken, code-split per route
- **Caching:** Static + ISR where possible
- **Monitoring:** Vercel Analytics + Sentry

---

## 🆘 Troubleshooting

### Port 3000 already in use?
```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Sanity not loading?
```bash
# Rebuild Sanity studio
npm run sanity:dev
```

### Build fails?
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 📚 Documentation

- [`DEPLOYMENT.md`](./DEPLOYMENT.md) – Vercel deployment guide
- [`API.md`](./API.md) – API routes documentation (create as needed)
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) – Dev guidelines (create as needed)

---

## 📄 License

ISC – See LICENSE file.

---

## 🎉 Ready to Launch!

Your premium streetwear portal is ready. Deploy to Vercel and start selling! 🚀🍉

**Questions?** Check the docs or open an issue on GitHub.

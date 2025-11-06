# FFDH Bot Army - Speed & Reliability Upgrade

## 🚀 Quick Start

### Prerequisites

- Node.js 20.11+
- pnpm 9+ (`npm install -g pnpm@9`)

### Installation

```bash
# Install dependencies
pnpm install

# Install Turbo (if not already installed)
pnpm add -D turbo
```

### Build

```bash
# Build all workspaces (with Turborepo cache)
pnpm build

# Build only changed packages
pnpm ci:only-changed
```

### Testing

```bash
# Run smoke tests (≤180s target)
pnpm qa:smoke

# Run Lighthouse performance tests
pnpm qa:lh

# Run all tests
pnpm test
```

## 📁 Workspace Structure

```
.
├── apps/
│   └── web/              # Next.js web application
├── bots/
│   ├── orchestrator/     # Task orchestration
│   ├── content-bot/      # Content generation with LLM cache
│   └── knowledge-base/   # Central knowledge repository
├── shared/               # Shared utilities (types, utils)
│   ├── types/           # Task contracts (Zod schemas)
│   └── utils/           # Idempotency, locks, artifacts, metrics
└── packages/
    └── design-system.json  # LLM configuration
```

## 🔧 Configuration

### Environment Variables

```bash
# Optional: Redis for distributed locks
REDIS_URL=redis://localhost:6379

# Optional: Remote artifact storage
ARTIFACTS_REMOTE=s3://bucket-name
# or
ARTIFACTS_REMOTE=supabase://project-id

# On-demand revalidation secret
REVALIDATE_SECRET=your-secret-key
```

### Turborepo Cache

Turborepo automatically caches build outputs in `.turbo/`. To clear cache:

```bash
rm -rf .turbo
```

## 📊 Metrics & Observability

### Metrics API

```bash
# Get metrics summary
curl http://localhost:3000/api/status/metrics
```

Response:
```json
{
  "total": 100,
  "success": 95,
  "fail": 5,
  "errorRate": 0.05,
  "avgDuration": 1234,
  "p50": 1000,
  "p95": 2500,
  "cacheHitRate": 0.65
}
```

### Metrics File

Metrics are written to `.ffdh/metrics.jsonl` (JSON Lines format):

```json
{"ts":"2025-01-XXT12:00:00Z","task":"generate-content","status":"success","durMs":1234,"cacheHit":true}
```

## 🔒 Security

See `SECURITY.md` for:
- Key rotation schedule
- Webhook security policy
- Secret management guidelines

## 🧪 Quality Gates

### Smoke Tests

- **Target:** ≤180 seconds
- **Blocks:** Deployment if fails
- **Tests:** Homepage, health endpoint, product page

### Lighthouse

- **Desktop:** ≥95 (warning if <95, blocks in prod)
- **Mobile:** ≥92 (warning if <92, blocks in prod)
- **Output:** `.reports/lh/` directory

## 🔄 CI/CD

### Only-Changed Detection

The `scripts/only-changed.js` script detects changes in:
- `app/`
- `src/`
- `public/`
- `next.config.js`
- `tailwind.config.ts`
- `tsconfig.json`
- `package.json`

If no web app changes detected, sets `SKIP_WEB_BUILD=1`.

### Workflow Jobs

1. **preflight** - Detects changes
2. **build** - Builds if changes detected
3. **qa:smoke** - Smoke tests (blocks deploy)
4. **qa:lh** - Lighthouse (warns/blocks based on scores)
5. **deploy** - Vercel deployment + production smoke test

## 💾 Caching

### LLM Cache

LLM responses are cached based on normalized prompts:
- Removes random fields, timestamps
- Hash-based storage in `.ffdh/cache/llm/`
- 30-day TTL
- Target: ≥60% cache hit rate

### Artifact Cache

Build artifacts cached in `.ffdh/cache/artifacts/`:
- 100MB limit (LRU eviction)
- 7-day TTL
- Hash-based storage

## 🛠️ Development

### Adding a New Workspace

1. Create directory: `apps/my-app/` or `bots/my-bot/`
2. Add `package.json` with workspace name
3. Add to root `package.json` workspaces array
4. Add build script to `turbo.json` pipeline

### Task Queue Usage

```typescript
import { taskQueue } from '@ffdh/orchestrator';
import { TaskDefinition } from '@ffdh/shared/types/task';

const task: TaskDefinition = {
  id: 'task-1',
  version: '1.0.0',
  name: 'generate-content',
  priority: 'normal',
  concurrencyClass: 'llm',
  idempotencyKey: '', // Auto-generated
  timeoutMs: 900000,
};

const result = await taskQueue.enqueue(task);
```

### Metrics Writing

```typescript
import { writeMetric } from '@ffdh/shared/utils/metrics';

writeMetric({
  ts: new Date().toISOString(),
  task: 'generate-content',
  status: 'success',
  durMs: 1234,
  cacheHit: true,
  tokensIn: 100,
  tokensOut: 200,
});
```

## 📚 Documentation

- **AUTOPILOT_COMPLETION_SUMMARY.md** - Full implementation summary
- **SECURITY.md** - Security policy
- **.github/workflows/ci.yml** - CI/CD workflow

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear Turborepo cache
rm -rf .turbo

# Clear node_modules
rm -rf node_modules
pnpm install
```

### Redis Connection Error

If `REDIS_URL` is not set, the system falls back to file-based locks in `.ffdh/locks/`. This is fine for local development.

### Metrics Not Appearing

Ensure `.ffdh/metrics.jsonl` directory exists:
```bash
mkdir -p .ffdh
```

## ✅ Validation Checklist

- [ ] `pnpm build` succeeds
- [ ] `pnpm qa:smoke` passes (≤180s)
- [ ] `pnpm qa:lh` shows scores ≥95 desktop, ≥92 mobile
- [ ] Metrics API returns data: `/api/status/metrics`
- [ ] Turborepo cache working (second build faster)

---

**Status:** ✅ Ready for production use


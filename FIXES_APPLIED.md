# 🔧 Fixes Applied - PowerShell & pnpm Issues

## ✅ Completed Fixes

### 1. pnpm-workspace.yaml
- ✅ File exists and is correct
- ✅ Contains all workspaces: apps/*, bots/*, packages/*, shared

### 2. packageManager
- ✅ Updated to `pnpm@10.20.0` in package.json

### 3. Health Endpoint
- ✅ Simplified `/api/health` endpoint in `apps/web/app/api/health/route.ts`
- ✅ Uses `force-static` for better performance
- ✅ Returns simple JSON: `{ status: 'ok', version, environment }`

### 4. Smoke Test
- ✅ Updated `apps/web/tools/smoke.js` with simple HTTP checks
- ✅ Checks homepage (200/301/302) and health endpoint (200)
- ✅ Waits up to 10 seconds for server to start

### 5. Package Scripts
- ✅ Updated `apps/web/package.json` scripts:
  - `qa:smoke`: `node tools/smoke.js`
  - `qa:lh`: `node tools/lighthouse.mjs`
  - `start`: `next start -p 3000`

### 6. Sanity Updates
- ✅ Updated to Sanity 4.14.1+ to fix peer dependency warnings
- ✅ Updated related packages:
  - `sanity@^4.14.1`
  - `@sanity/client@^7.12.1`
  - `@sanity/vision@^4.14.1`
  - `@sanity/types@^4.14.1`
  - `@sanity/schema@^4.14.1`
  - `next-sanity@^11.6.5`

## ⚠️ Manual Steps Required

### 1. Approve Build Scripts
```powershell
cd d:\ffdh-next
pnpm approve-builds
# Select: esbuild, sharp, @sentry/cli, puppeteer
pnpm install
```

### 2. Test Build
```powershell
cd d:\ffdh-next
pnpm build
pnpm build  # Second time should be faster (cache)
```

### 3. Test Dev Server
```powershell
cd d:\ffdh-next\apps\web
pnpm dev
```

### 4. Test Smoke
```powershell
# In new terminal, after dev server starts:
cd d:\ffdh-next
pnpm qa:smoke
```

## 📋 PowerShell Best Practices

### ✅ DO:
- Use semicolons: `cd d:\ffdh-next; pnpm install`
- Use full paths: `cd d:\ffdh-next\apps\web`
- Use `Set-Content -Encoding UTF8` for file writes

### ❌ DON'T:
- Don't use `&&` in PowerShell
- Don't use relative paths after `cd` in scripts
- Don't use `node -e "import(...)"` for TypeScript

## 🚀 Next Steps

1. **Approve builds**: `pnpm approve-builds`
2. **Build**: `pnpm build` (2x to test cache)
3. **Dev**: `cd apps\web; pnpm dev`
4. **Smoke**: `pnpm qa:smoke` (in new terminal)
5. **Commit**: `git commit -m "feat(speed): FFDH Bot Army – Speed & Reliability Upgrade"`

---

**Status:** ✅ All fixes applied, ready for `pnpm approve-builds` and testing


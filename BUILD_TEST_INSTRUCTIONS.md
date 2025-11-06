# 🔨 Build Test Instructions

## ✅ Completed Steps

1. ✅ `pnpm approve-builds` - No packages awaiting approval
2. ✅ `.env.local` - Created with test values
3. ✅ `NEXT_PUBLIC_APP_URL` - Added to .env.local
4. ✅ Build started in background

## 🚀 Next Steps

### 1. Wait for Build to Complete

The build is running in the background. Wait ~30-60 seconds, then check:

```powershell
# Check if build completed
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*next*" }
```

### 2. Test Build Cache (Second Run)

```powershell
cd d:\ffdh-next
pnpm build
# Should be faster (Turborepo cache)
```

### 3. Start Dev Server

```powershell
cd d:\ffdh-next\apps\web
pnpm dev
```

### 4. Test Smoke (in new terminal)

Wait ~10 seconds after dev server starts, then:

```powershell
cd d:\ffdh-next
pnpm qa:smoke
```

Expected output:
```json
{
  "home": 200,
  "health": 200,
  "ok": true
}
✅ Smoke tests PASSED
```

## 📋 Environment Variables

Current `.env.local` contains:
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- Test values for Sanity, Supabase, Stripe, Printful

For production, replace with real values.

## ✅ Success Criteria

- [ ] First build completes successfully
- [ ] Second build is faster (cache hit)
- [ ] Dev server starts on port 3000
- [ ] Health endpoint returns 200: `/api/health`
- [ ] Smoke tests pass: `pnpm qa:smoke`

---

**Status:** Build running, ready for testing


# Yarn Migration Plan (Emergency Fallback)

## Problem
npm on Windows with Next.js 15 + heavy dependencies is unreliable due to TAR extraction errors and file locks.

## Solution: Switch to Yarn

### Why Yarn?
- Better Windows compatibility
- Faster installations with parallel package downloads
- More robust cache handling
- PnP support for production environments
- Already tested with Next.js 15

### Migration Steps

```powershell
# 1. Install Yarn globally
npm install -g yarn

# 2. Clean install
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue

# 3. Install with Yarn
yarn install

# 4. Build
yarn build

# 5. Update scripts in package.json to use yarn
```

### Alternative: pnpm (Even Better for Windows)

```powershell
# 1. Install pnpm
npm install -g pnpm

# 2. Enable strict peer deps
echo "strict-peer-dependencies=false" > .npmrc

# 3. Clean install
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue

# 4. Install
pnpm install

# 5. Build
pnpm build
```

## Recommendation

**Use pnpm** for this project:
- Fastest package manager
- Best disk space optimization
- Excellent Windows support
- Built-in workspace support

## Commands After Migration

Replace `npm` with `yarn` or `pnpm` in all commands:

```bash
# Development
yarn dev          # or pnpm dev
yarn build        # or pnpm build

# Testing
yarn test         # or pnpm test
yarn test:e2e     # or pnpm test:e2e

# Linting
yarn lint         # or pnpm lint
```

## Update CI/CD

Update `.github/workflows/ci.yml`:
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'yarn'  # or 'pnpm'
    
- run: yarn install  # or pnpm install
```


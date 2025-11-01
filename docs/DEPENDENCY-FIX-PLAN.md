# FFDH Dependency Fix Plan

## 🔍 PROBLEM ANALYSIS

### Identified Issues

1. **Corrupted npm cache**: TAR_ENTRY_ERROR warnings during install
2. **File system locks**: Node processes holding file handles
3. **Incomplete node_modules**: Partial installation due to errors
4. **Windows-specific issues**: Path length limitations, symbolic links
5. **Dependency conflicts**: Multiple versions of same packages in nested deps

### Root Causes

- **Node.js v22.16.0**: Latest version may have issues with older packages
- **npm 10.9.2**: Default Turbo version causing timing issues
- **Long paths**: Windows 260-character limit affecting deep dependencies
- **Antivirus/real-time scanning**: Locking files during extraction
- **Concurrent installations**: Multiple npm installs running simultaneously

## 🛠️ REMEDIATION PLAN

### Phase 1: Immediate Cleanup

**Status**: ✅ Created fix script  
**File**: `scripts/fix-dependencies.ps1`

```powershell
# Run this locally
.\scripts\fix-dependencies.ps1
```

**Actions**:
1. Kill all Node processes
2. Clear npm cache (`npm cache clean --force`)
3. Remove `node_modules`, `.next`, temp directories
4. Clean npm temporary files
5. Preserve `package.json` and `package-lock.json`
6. Fresh `npm install` with `--legacy-peer-deps`

### Phase 2: Alternative Package Managers

If npm continues to fail:

#### Option A: Yarn
```powershell
# Install Yarn
npm install -g yarn

# Clean install
Remove-Item -Recurse -Force node_modules, yarn.lock, .yarn
yarn install
```

#### Option B: pnpm
```powershell
# Install pnpm
npm install -g pnpm

# Clean install
Remove-Item -Recurse -Force node_modules, pnpm-lock.yaml
pnpm install
```

### Phase 3: Windows-Specific Fixes

```powershell
# Enable long paths in Windows (requires admin)
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
  -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force

# Restart required after this change
```

## 📝 MANUAL COMMANDS

If you prefer manual execution:

```powershell
# 1. Kill processes
taskkill /F /IM node.exe /T

# 2. Clear cache
npm cache clean --force

# 3. Remove directories
Remove-Item -Recurse -Force node_modules, .next, node_modules/.cache

# 4. Clean temp files
Get-ChildItem "$env:TEMP" -Filter "*npm-*" | Remove-Item -Recurse -Force
Get-ChildItem "$env:TEMP" -Filter "*resolve-*" | Remove-Item -Recurse -Force

# 5. Fresh install
npm install --legacy-peer-deps

# 6. Test build
npm run build
```

## 🚨 FALLBACK OPTIONS

### If npm completely fails:

#### Using Yarn
```bash
# Install Yarn globally
npm install -g yarn

# Migration
rm -rf node_modules package-lock.json
yarn install

# Update package.json scripts if needed
# Add in scripts: "postinstall": "yarn setup" if needed
```

#### Using pnpm
```bash
# Install pnpm globally
npm install -g pnpm

# Enable strict peer deps if needed
echo "strict-peer-dependencies=false" > .npmrc

# Migration
rm -rf node_modules package-lock.json
pnpm install
```

## 🎯 VALIDATION STEPS

After remediation, verify:

```powershell
# 1. Check installation
npm list --depth=0

# 2. Verify critical packages
npm list next react react-dom typescript tailwindcss

# 3. Test TypeScript
npm run type-check

# 4. Test build
npm run build

# 5. Test linting
npm run lint
```

## 🔧 KNOWN PROBLEMATIC PACKAGES

These packages frequently cause issues on Windows:

| Package | Issue | Solution |
|---------|-------|----------|
| `@opentelemetry/instrumentation-http` | Path length | Update to latest |
| `eslint` | Peer dep conflicts | Use `--legacy-peer-deps` |
| `postcss` | Multiple versions | Dedupe |
| `webpack` | Slow install | Increase timeout |
| `typescript` | Cache issues | Clear TS cache |

## 📊 SUCCESS CRITERIA

✅ **Installation**:
- No TAR_ENTRY_ERROR warnings
- node_modules/ created successfully
- All packages in package.json installed

✅ **Build**:
- `npm run build` completes without errors
- `.next/` directory created
- No TypeScript errors

✅ **Runtime**:
- `npm run dev` starts without errors
- Application loads in browser
- API routes respond

## 🆘 ESCALATION

If all options fail:

1. **Check disk space**: Ensure 5GB+ free
2. **Disable antivirus**: Temporarily during install
3. **Use WSL**: Install in Windows Subsystem for Linux
4. **Clean Windows**: Clear Windows temp files
5. **Docker**: Use containerized environment

## 📞 SUPPORT

- npm docs: https://docs.npmjs.com/cli/v10/commands/npm-install
- Next.js troubleshooting: https://nextjs.org/docs/architecture/nextjs-compiler
- Windows path issues: https://learn.microsoft.com/en-us/windows/win32/fileio/maximum-file-path-limitation


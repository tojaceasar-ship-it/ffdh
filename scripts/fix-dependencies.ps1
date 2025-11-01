# FFDH Dependency Fix Script
# Fixes corrupted node_modules, npm cache, and file lock issues

Write-Host "Starting FFDH dependency cleanup..." -ForegroundColor Cyan

# Step 1: Kill all Node processes
Write-Host ""
Write-Host "1. Killing all Node.js processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Step 2: Clear npm cache
Write-Host ""
Write-Host "2. Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force 2>&1 | Out-Null

# Step 3: Remove corrupted directories
Write-Host ""
Write-Host "3. Removing corrupted directories..." -ForegroundColor Yellow
$dirsToRemove = @(
    "node_modules",
    ".next",
    "node_modules/.cache"
)

foreach ($dir in $dirsToRemove) {
    if (Test-Path $dir) {
        Write-Host "   Removing: $dir" -ForegroundColor Gray
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Step 4: Clean npm temp files
Write-Host ""
Write-Host "4. Cleaning npm temporary files..." -ForegroundColor Yellow
$tempPatterns = @(
    "$env:TEMP\*npm-*",
    "$env:TEMP\*resolve-*",
    "$env:TEMP\*.staging",
    "$env:TEMP\*.store"
)

foreach ($pattern in $tempPatterns) {
    Get-Item $pattern -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
}

# Step 5: Remove lock files if needed
Write-Host ""
Write-Host "5. Handling lock files..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Write-Host "   Found package-lock.json (keeping)" -ForegroundColor Gray
}
if (Test-Path "yarn.lock") {
    Write-Host "   Found yarn.lock (will be regenerated)" -ForegroundColor Gray
    Remove-Item -Path "yarn.lock" -Force -ErrorAction SilentlyContinue
}
if (Test-Path "pnpm-lock.yaml") {
    Write-Host "   Found pnpm-lock.yaml (will be regenerated)" -ForegroundColor Gray
    Remove-Item -Path "pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue
}

# Step 6: Verify package.json exists and is valid
Write-Host ""
Write-Host "6. Verifying package.json..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "   ERROR: package.json not found!" -ForegroundColor Red
    exit 1
}

try {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    Write-Host "   SUCCESS: package.json is valid" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: package.json is corrupted!" -ForegroundColor Red
    exit 1
}

# Step 7: Fresh install with verbose output
Write-Host ""
Write-Host "7. Installing dependencies fresh..." -ForegroundColor Yellow
Write-Host "   This may take several minutes..." -ForegroundColor Gray

$installStart = Get-Date

# Use npm ci if package-lock.json exists, otherwise npm install
if (Test-Path "package-lock.json") {
    npm install --legacy-peer-deps --verbose
} else {
    npm install --legacy-peer-deps --verbose
}

$installEnd = Get-Date
$installDuration = ($installEnd - $installStart).TotalSeconds

# Step 8: Verify installation
Write-Host ""
Write-Host "8. Verifying installation..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    $moduleCount = (Get-ChildItem -Path "node_modules" -Directory).Count
    Write-Host "   SUCCESS: Installed $moduleCount packages" -ForegroundColor Green
} else {
    Write-Host "   ERROR: node_modules not found!" -ForegroundColor Red
    exit 1
}

# Step 9: Test Next.js
Write-Host ""
Write-Host "9. Testing Next.js installation..." -ForegroundColor Yellow
try {
    $nextVersion = npm list next --depth=0 2>&1 | Select-String -Pattern "next@" | ForEach-Object { $_ -replace ".*next@", "" -replace " .*", "" }
    Write-Host "   SUCCESS: Next.js $nextVersion installed" -ForegroundColor Green
} catch {
    Write-Host "   WARNING: Could not verify Next.js version" -ForegroundColor Yellow
}

# Final summary
Write-Host ""
Write-Host "Cleanup complete!" -ForegroundColor Green
Write-Host "   Time taken: $installDuration seconds" -ForegroundColor Gray

# Check for common problematic packages
Write-Host ""
Write-Host "Checking for known problematic packages..." -ForegroundColor Cyan
$problematicPackages = @("postcss", "tailwindcss", "webpack", "next")

foreach ($pkg in $problematicPackages) {
    if (Test-Path "node_modules\$pkg") {
        Write-Host "   SUCCESS: $pkg installed" -ForegroundColor Green
    } else {
        Write-Host "   WARNING: $pkg missing" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "   1. Run: npm run dev" -ForegroundColor White
Write-Host "   2. If issues persist, try: npm run build --webpack" -ForegroundColor White
Write-Host "   3. Check errors in the output above" -ForegroundColor White
Write-Host ""

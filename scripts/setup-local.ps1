# 🍉 FFDH Local Development Setup Script (PowerShell)

Write-Host "🍉 FFDH Local Development Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm v$npmVersion found" -ForegroundColor Green
}
catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Create .env.local if it doesn't exist
if (-not (Test-Path ".env.local")) {
    Write-Host ""
    Write-Host "📝 Creating .env.local from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ .env.local created" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Important: Edit .env.local with your actual API keys:" -ForegroundColor Yellow
    Write-Host "   - NEXT_PUBLIC_SANITY_PROJECT_ID"
    Write-Host "   - NEXT_PUBLIC_SUPABASE_URL"
    Write-Host "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    Write-Host "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    Write-Host "   - STRIPE_SECRET_KEY"
    Write-Host "   - STRIPE_WEBHOOK_SECRET"
}
else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
}

# Run type check
Write-Host ""
Write-Host "🔍 Running TypeScript type check..." -ForegroundColor Yellow
npm run type-check

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  TypeScript errors found (non-critical)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 To start development server, run:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Magenta
Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Cyan
Write-Host "   - README.md"
Write-Host "   - docs/API.md"
Write-Host "   - docs/DEPLOYMENT.md"
Write-Host "   - CONTRIBUTING.md"
Write-Host ""

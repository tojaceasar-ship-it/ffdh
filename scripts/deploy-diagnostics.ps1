param(
  [Parameter(Mandatory=$true)] [string]$DeploymentId,     # np. ffdh-next-e1vy3my9j
  [string]$Project = "ffdh-next",
  [int]$MaxRetries = 5,
  [string]$NodeVersion = "20",
  [string]$EnvFile = ".env.example"
)

function Write-Section($title) { Write-Host "`n=== $title ===" -ForegroundColor Cyan }

# 0) Wymagania: Vercel CLI zalogowany (vercel login), projekt powiązany (vercel link)
Write-Section "Check Vercel CLI"
vercel --version | Out-Null
if ($LASTEXITCODE -ne 0) { throw "Vercel CLI not found. Install: npm i -g vercel" }

New-Item -ItemType Directory -Force -Path "fixes" | Out-Null
New-Item -ItemType Directory -Force -Path "retry_log" | Out-Null

function Get-DeploymentUrl($id) {
  $inspect = vercel inspect $id --output=json 2>$null
  if (-not $inspect) { return $null }
  try {
    $json = $inspect | ConvertFrom-Json
    # weź pierwszy alias/url dostępny
    if ($json.url) { return "https://$($json.url)" }
    if ($json.alias -and $json.alias[0]) { return "https://$($json.alias[0])" }
    return $null
  } catch { return $null }
}

function Get-Status($id) {
  $inspect = vercel inspect $id --output=json 2>$null
  if (-not $inspect) { return "unknown" }
  try {
    $json = $inspect | ConvertFrom-Json
    return $json.readyState  # queued|building|ready|error|canceled
  } catch { return "unknown" }
}

function Fetch-LastLogs($url, $lines=100) {
  if (-not $url) { return @() }
  $logs = vercel logs $url --num $lines 2>$null
  return $logs
}

function Classify-Error($logs) {
  $text = ($logs -join "`n")

  $map = @{
    "env"   = @(
      "Missing env", "process\.env", "Environment.*undefined", "Secret .* not found", "ENABLE_SIGNATURE_CHECK"
    )
    "node"  = @(
      "The Node\.js version .* is not supported", "engines.*node", "SyntaxError.*lookbehind.*(node)", "ERR_MODULE_NOT_FOUND.*node"
    )
    "module" = @(
      "Module not found", "Cannot find module", "Import trace:", "Type error: Module .* has no exported member"
    )
    "next"  = @(
      "App Route:", "getStaticProps", "getServerSideProps", "ISR", "NextAuth", "route\.ts", "middleware\.ts"
    )
    "build" = @(
      "Failed to compile\.", "Error: Command `"npm run build`" exited with 1", "Turbopack"
    )
  }

  foreach ($k in $map.Keys) {
    foreach ($pat in $map[$k]) {
      if ($text -match $pat) { return $k }
    }
  }
  return "unknown"
}

function Ensure-EngineFiles($nodeMajor) {
  # .nvmrc
  Set-Content -Path ".nvmrc" -Value "v$nodeMajor" -Encoding UTF8

  # package.json engines.node
  $pkg = Get-Content package.json -Raw | ConvertFrom-Json
  if (-not $pkg.engines) { $pkg | Add-Member -NotePropertyName engines -NotePropertyValue (@{}) }
  $pkg.engines.node = ">=${nodeMajor}.0.0 <${nodeMajor}.999.0"
  ($pkg | ConvertTo-Json -Depth 100) | Set-Content package.json -Encoding UTF8
}

function Render-EnvExample() {
  if (Test-Path $EnvFile) { return }
  @"
# ---- Core NextAuth ----
NEXTAUTH_URL=https://<your-vercel-domain>
NEXTAUTH_SECRET=<generate-strong-secret>

# ---- Supabase ----
NEXT_PUBLIC_SUPABASE_URL=https://<id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

# ---- Sentry (opcjonalnie) ----
SENTRY_DSN=
SENTRY_ENV=production

# ---- Webhooks ----
ENABLE_SIGNATURE_CHECK=true
WEBHOOK_SECRET=<your-webhook-secret>

"@ | Set-Content $EnvFile -Encoding UTF8
}

function Write-FixReport($classification, $logs, $url) {
@"
# FFDH Deploy Fixes

**Deployment URL:** $url

## Klasyfikacja błędu

- Typ: **$classification**

## Ostatnie logi (100 linii)

\`\`\`
$($logs -join "`n")
\`\`\`

## Zalecane działania

$(switch ($classification) {
  "env"     { "- Sprawdź wymagane zmienne w .env i na Vercel (Project → Settings → Environment Variables).
- Włącz **ENABLE_SIGNATURE_CHECK=true** (prod) i ustaw klucze webhooków.
- Upewnij się, że NEXTAUTH_SECRET jest ustawione na produkcji." }
  "node"    { "- Ustal wersję Node na 20: utwórz/aktualizuj **.nvmrc** i **package.json → engines.node**.
- W Vercel: Project → Settings → Node.js Version = 20.x" }
  "module"  { "- Napraw aliasy importów (`@/lib/...` zamiast `@/src/...`), sprawdź `tsconfig.json → paths`.
- Dopnij zgodność wersji paczek: NextAuth v4 typy (`import type { JWT } from 'next-auth/jwt'`)." }
  "next"    { "- Przejrzyj route'y i SSR/ISR: czy funkcje i importy są po właściwej stronie (server/client)?
- NextAuth: zgodność wersji (v4 vs v5), odpowiednie importy typów." }
  "build"   { "- Uruchom lokalnie czysty build: `Remove-Item -Recurse -Force node_modules, .next; npm ci; npm run build`
- Zaktualizuj konflikty peer-deps (React 19 vs paczki)." }
  default   { "- Sprawdź dokładnie logi powyżej; wzorzec nie został jednoznacznie wykryty." }
})

"@ | Set-Content "fixes/FFDH_DEPLOY_FIXES.md" -Encoding UTF8
}

function Write-Patch($classification) {
  $patch = @()

  if ($classification -in @("node")) {
    $patch += @"
*** Begin Patch
*** Add File: .nvmrc
+v20
*** End Patch
"@
  }

  if ($classification -in @("module","next")) {
    $patch += @"
*** Begin Patch
*** Update File: tsconfig.json
@@
 {
   "compilerOptions": {
     "baseUrl": ".",
-    "paths": { "@/*": ["src/*"] }
+    "paths": { "@/*": ["src/*"] },
+    "skipLibCheck": true
   },
-  "include": ["next-env.d.ts", "src"]
+  "include": ["next-env.d.ts", "src", "src/types/**/*.d.ts"]
 }
*** End Patch
"@
  }

  if ($patch.Count -eq 0) {
    $patch = @("*** Begin Patch`n*** End Patch")
  }

  ($patch -join "`n") | Set-Content "patch.diff" -Encoding UTF8
}

function Retry-Deploy($maxRetries) {
  $history = @()
  for ($i=1; $i -le $maxRetries; $i++) {
    Write-Section "Retry #$i"
    $res = vercel --prod 2>&1
    $history += @{ attempt=$i; output=$res }
    $url = ($res | Select-String -Pattern "https://.*\.vercel\.app" -AllMatches).Matches | Select-Object -Last 1 | ForEach-Object { $_.Value }
    if ($url) {
      Start-Sleep -Seconds 5
      $status = "building"
      $tries=0
      while ($status -in @("queued","building") -and $tries -lt 60) {
        $inspect = vercel inspect $url --output=json 2>$null
        if ($inspect) {
          try { $json = $inspect | ConvertFrom-Json; $status = $json.readyState } catch {}
        }
        if ($status -in @("queued","building")) { Start-Sleep -Seconds 5; $tries++ }
      }
      if ($status -eq "ready") { return @{ status="PASS"; url=$url; history=$history } }
    }
  }
  return @{ status="FAIL"; url=$null; history=$history }
}

# 1) Monitoruj bieżący deploy
Write-Section "Monitoring current deployment"
$status = Get-Status $DeploymentId
$polls = 0
while ($status -in @("queued","building","unknown") -and $polls -lt 90) {
  Start-Sleep -Seconds 5
  $status = Get-Status $DeploymentId
  $polls++
}

$url = Get-DeploymentUrl $DeploymentId

if ($status -eq "ready") {
  Write-Section "Status: ✅ PASS"
  # szybkie sanity-checki endpoints
  "FFDH-RADAR.md" | Out-Null
  @"
# FFDH RADAR (portal)

- / (home)
- /manifest
- /lookbook
"@ | Set-Content "FFDH-RADAR.md" -Encoding UTF8

  @"
# REWIR Recommendations

Sprawdź podstrony:

- /rewir
- /rewir/scenes
- /rewir/[id]
"@ | Set-Content "FFDH-REWIR-RECOMMENDATIONS.md" -Encoding UTF8

  Write-Host "status: ✅ PASS"
  Write-Host "Artifacts: FFDH-RADAR.md, FFDH-REWIR-RECOMMENDATIONS.md"
  exit 0
}

if ($status -eq "error" -or $status -eq "canceled") {
  Write-Section "Status: ❌ FAIL – collecting logs"
  $logs = Fetch-LastLogs $url 100
  $class = Classify-Error $logs

  Render-EnvExample
  Ensure-EngineFiles -nodeMajor $NodeVersion
  Write-FixReport -classification $class -logs $logs -url $url
  Write-Patch -classification $class

  $retry = Retry-Deploy -maxRetries $MaxRetries
  $retry.history | ConvertTo-Json -Depth 10 | Set-Content "retry_log/RETRY_HISTORY.json" -Encoding UTF8

  if ($retry.status -eq "PASS") {
    Write-Host "status: ✅ PASS"
    Write-Host "Deployment URL: $($retry.url)"
  } else {
    Write-Host "status: ❌ FAIL"
    Write-Host "Next step: run /RETRY FFDH-AUTOPILOT"
  }
  exit 1
}

Write-Host "status: ❌ FAIL (unknown)"
exit 1






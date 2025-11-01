import { NextResponse } from 'next/server'

/**
 * GET /api/health
 * Health check endpoint with dependency status
 */
export async function GET() {
  const buildTime = process.env.BUILD_TIME || new Date().toISOString()
  const version = process.env.npm_package_version || '1.0.0'
  
  // Check ENV presence (never reveal values)
  const allConfigured = !!(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.STRIPE_SECRET_KEY &&
    process.env.OPENAI_API_KEY &&
    process.env.SENTRY_DSN
  )
  
  return NextResponse.json({
    status: allConfigured ? 'healthy' : 'degraded',
    version,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    buildTime,
    environment: process.env.NODE_ENV || 'unknown',
  })
}

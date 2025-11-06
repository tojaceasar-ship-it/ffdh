/**
 * Environment Variables Configuration for FFDH
 * Validates and exports all env vars with defaults
 */

interface EnvConfig {
  // App
  nodeEnv: 'development' | 'production' | 'test'
  appUrl: string
  appName: string
  isDev: boolean
  isProd: boolean

  // Sanity CMS
  sanityProjectId: string
  sanityDataset: string
  sanityToken?: string

  // Supabase
  supabaseUrl: string
  supabaseAnonKey: string
  supabaseServiceRoleKey?: string

  // Stripe
  stripePublishableKey: string
  stripeSecretKey?: string
  stripeWebhookSecret?: string

  // PayPal
  paypalClientId?: string
  paypalSecret?: string

  // Printful
  printfulApiKey?: string
  printfulStoreId?: string

  // OpenAI
  openaiApiKey?: string

  // Analytics
  googleAnalyticsId?: string
  ga4MeasurementId?: string
  plausibleDomain?: string
}

/**
 * Validate required env vars
 */
function validateEnv(): void {
  const required = [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    console.warn(`⚠️  Missing required environment variables: ${missing.join(', ')}`)
    console.warn('   These are needed for full functionality.')
    console.warn('   Check your .env.local file.')
  }
}

/**
 * Get environment configuration
 */
export function getEnvConfig(): EnvConfig {
  validateEnv()

  return {
    // App
    nodeEnv: (process.env.NODE_ENV as any) || 'development',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'FFDH',
    isDev: process.env.NODE_ENV !== 'production',
    isProd: process.env.NODE_ENV === 'production',

    // Sanity CMS
    sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    sanityToken: process.env.SANITY_AUTH_TOKEN,

    // Supabase
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

    // Stripe
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,

    // PayPal
    paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    paypalSecret: process.env.PAYPAL_SECRET,

    // Printful
    printfulApiKey: process.env.PRINTFUL_API_KEY,
    printfulStoreId: process.env.PRINTFUL_STORE_ID,

    // OpenAI
    openaiApiKey: process.env.OPENAI_API_KEY,

    // Analytics
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  }
}

// Export singleton instance
export const env = getEnvConfig()

export default env

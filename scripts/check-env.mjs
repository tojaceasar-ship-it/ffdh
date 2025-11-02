#!/usr/bin/env node
/**
 * Environment Variables Preflight Check
 * Validates required ENV vars without exposing secrets
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Load .env.local if it exists
try {
  const envLocalPath = join(rootDir, '.env.local');
  const envContent = readFileSync(envLocalPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').trim();
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch (error) {
  // .env.local doesn't exist or can't be read - that's ok
  // Variables might be set via system env or Vercel
}

const requiredVars = {
  public: [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_APP_URL',
  ],
  server: [
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'OPENAI_API_KEY',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ],
  optional: [
    'SANITY_AUTH_TOKEN',
    'PRINTFUL_API_KEY',
    'SENTRY_DSN',
    'VITE_PLAUSIBLE_DOMAIN',
    'ENABLE_SIGNATURE_CHECK',
  ],
}

function checkEnv() {
  const missing = []
  const warnings = []
  
  // Check required public vars
  for (const varName of requiredVars.public) {
    if (!process.env[varName]) {
      missing.push({ name: varName, category: 'PUBLIC', priority: 'CRITICAL' })
    } else if (process.env[varName].includes('YOUR_') || process.env[varName].includes('PLACEHOLDER')) {
      warnings.push({ name: varName, message: 'Placeholder value detected' })
    }
  }
  
  // Check required server vars
  for (const varName of requiredVars.server) {
    if (!process.env[varName]) {
      missing.push({ name: varName, category: 'SERVER', priority: 'HIGH' })
    } else if (process.env[varName].includes('YOUR_') || process.env[varName].includes('PLACEHOLDER')) {
      warnings.push({ name: varName, message: 'Placeholder value detected' })
    }
  }
  
  // Check webhook signature flag
  const signatureCheck = process.env.ENABLE_SIGNATURE_CHECK === 'true'
  if (!signatureCheck) {
    warnings.push({
      name: 'ENABLE_SIGNATURE_CHECK',
      message: 'Webhook signature validation DISABLED (unsafe for production)',
    })
  }
  
  // Print results
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    console.table(missing)
    console.error('\n👉 Add missing variables to your .env.local file')
    console.error('   Reference: .env.template\n')
    process.exit(1)
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️  Environment warnings:')
    console.table(warnings)
  }
  
  // Never print actual values
  const hasSecrets = requiredVars.public.concat(requiredVars.server).concat(requiredVars.optional)
  console.log('✅ Environment check passed')
  console.log(`   Found ${hasSecrets.length} environment variables`)
  console.log('   Values hidden for security\n')
  process.exit(0)
}

// Run check
checkEnv()


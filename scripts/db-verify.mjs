#!/usr/bin/env node
/**
 * Database Schema Verification
 * Verifies all expected tables exist without exposing data
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE credentials')
  console.error('   Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const expectedTables = {
  core: ['users', 'products', 'orders', 'order_items'],
  rewir: ['scenes', 'comments', 'characters'],
  monitoring: ['webhook_logs', 'decision_logs'],
}

const expectedColumns = {
  scenes: ['id', 'slug', 'title', 'narrative', 'emotion_tags', 'view_count', 'comment_count', 'sanity_id'],
  comments: ['id', 'scene_id', 'content', 'emotion', 'is_approved', 'ai_response'],
  products: ['id', 'name', 'slug', 'price_eur', 'image_url', 'stock'],
}

async function verifyTables() {
  console.log('🔍 Verifying database schema...\n')
  
  let allPassed = true
  
  for (const [category, tables] of Object.entries(expectedTables)) {
    console.log(`${category.toUpperCase()}:`)
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1)
        
        if (error) {
          console.log(`  ❌ ${table}: ${error.message}`)
          allPassed = false
        } else {
          console.log(`  ✅ ${table}`)
        }
      } catch (err) {
        console.log(`  ❌ ${table}: ${err.message}`)
        allPassed = false
      }
    }
    
    console.log()
  }
  
  // Verify key columns
  console.log('KEY COLUMNS:')
  for (const [table, columns] of Object.entries(expectedColumns)) {
    const { error, data } = await supabase.from(table).select('*').limit(1)
    
    if (!error && data) {
      const actualColumns = Object.keys(data[0] || {})
      const missing = columns.filter(col => !actualColumns.includes(col))
      
      if (missing.length > 0) {
        console.log(`  ⚠️  ${table}: Missing columns ${missing.join(', ')}`)
        allPassed = false
      } else {
        console.log(`  ✅ ${table}: All expected columns present`)
      }
    }
  }
  
  console.log()
  
  if (allPassed) {
    console.log('✅ Database schema verification PASSED')
    process.exit(0)
  } else {
    console.log('❌ Database schema verification FAILED')
    console.log('   Run migrations: supabase db push')
    process.exit(1)
  }
}

verifyTables().catch(err => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})


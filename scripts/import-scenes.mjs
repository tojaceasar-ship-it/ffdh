#!/usr/bin/env node
/**
 * Import Scenes to Sanity CMS
 * Reads content/auto_scenes.json and posts to Sanity (or prints payloads)
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Sanity config (with fallback)
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_AUTH_TOKEN

function loadScenes() {
  const scenesPath = path.join(__dirname, '../content/auto_scenes.json')
  const data = fs.readFileSync(scenesPath, 'utf-8')
  return JSON.parse(data)
}

function createSanityPayload(scenes) {
  return scenes.map((scene) => ({
    _type: 'scene',
    _id: `scene-${scene.slug}`,
    slug: {
      _type: 'slug',
      current: scene.slug,
    },
    title: scene.title,
    name: scene.title,
    description: scene.description,
    narrative: scene.narrative,
    emotionTags: scene.emotionTags,
    tags: ['ai-generated', 'rewir', ...scene.emotionTags],
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-placeholder', // Will need actual image asset ID
      },
      alt: scene.title,
    },
    publishedAt: new Date().toISOString(),
  }))
}

async function importToSanity(payloads) {
  if (!projectId || !token) {
    console.warn('⚠️  Missing Sanity credentials')
    console.warn('   Will print payloads for manual import\n')
    return printPayloads(payloads)
  }

  const client = createClient({
    projectId,
    dataset,
    useCdn: false,
    token,
    apiVersion: '2024-01-01',
  })

  console.log(`📤 Importing ${payloads.length} scenes to Sanity...\n`)

  try {
    // Use transaction for atomicity
    const transaction = client.transaction()

    for (const payload of payloads) {
      transaction.createOrReplace(payload)
    }

    await transaction.commit()
    console.log('✅ Scenes imported successfully')
    console.log(`   URL: https://${projectId}.sanity.studio/\n`)
  } catch (error) {
    console.error('❌ Import failed:', error.message)
    console.error('\n📋 Fallback: Use these payloads for manual import:\n')
    printPayloads(payloads)
  }
}

function printPayloads(payloads) {
  console.log('COPY-PASTE READY: Sanity GROQ transaction\n')
  console.log(JSON.stringify(payloads, null, 2))
  console.log('\nTo import manually:')
  console.log('1. Go to: Sanity Studio')
  console.log('2. Use Vision tab with GROQ')
  console.log('3. Paste transaction payload above')
  console.log('4. Or import via Content Lake API\n')
}

function printValidationErrors(scenes) {
  const errors = []
  
  for (const scene of scenes) {
    if (!scene.slug) errors.push(`${scene.title}: Missing slug`)
    if (!scene.title) errors.push(`${scene.slug}: Missing title`)
    if (!scene.narrative || scene.narrative.length < 50) {
      errors.push(`${scene.slug}: Narrative too short (< 50 chars)`)
    }
    if (!scene.emotionTags || scene.emotionTags.length < 2) {
      errors.push(`${scene.slug}: Insufficient emotion tags (< 2)`)
    }
  }
  
  if (errors.length > 0) {
    console.error('❌ Validation errors:')
    errors.forEach(err => console.error(`   - ${err}`))
    console.error()
    process.exit(1)
  }
}

async function main() {
  console.log('🎬 Scene Import Script\n')
  
  const scenes = loadScenes()
  console.log(`📄 Loaded ${scenes.length} scenes from content/auto_scenes.json`)
  
  printValidationErrors(scenes)
  
  const payloads = createSanityPayload(scenes)
  console.log('✅ Payloads created\n')
  
  await importToSanity(payloads)
  
  console.log('📝 Next steps:')
  console.log('1. Sync to Supabase: POST /api/scenes/index {"syncAll": true}')
  console.log('2. Verify in database: node scripts/db-verify.mjs')
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})


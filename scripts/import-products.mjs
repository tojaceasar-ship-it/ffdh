#!/usr/bin/env node
/**
 * Import Products to Sanity CMS
 * Reads content/auto_products.json and posts to Sanity
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_AUTH_TOKEN

function loadProducts() {
  const productsPath = path.join(__dirname, '../content/auto_products.json')
  const data = fs.readFileSync(productsPath, 'utf-8')
  return JSON.parse(data)
}

function createSanityPayload(products) {
  return products.map((product) => ({
    _type: 'product',
    _id: `product-${product.slug}`,
    slug: {
      _type: 'slug',
      current: product.slug,
    },
    name: product.name,
    description: product.description,
    price: product.price_eur,
    printfulVariantId: product.printfulVariantId,
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-placeholder',
      },
      alt: product.name,
    },
    stock: product.stock || 0,
    isLimited: product.is_limited || false,
    isSoldOut: false,
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

  console.log(`📤 Importing ${payloads.length} products to Sanity...\n`)

  try {
    const transaction = client.transaction()

    for (const payload of payloads) {
      transaction.createOrReplace(payload)
    }

    await transaction.commit()
    console.log('✅ Products imported successfully\n')
  } catch (error) {
    console.error('❌ Import failed:', error.message)
    printPayloads(payloads)
  }
}

function printPayloads(payloads) {
  console.log('COPY-PASTE READY: Sanity GROQ transaction\n')
  console.log(JSON.stringify(payloads, null, 2))
  console.log()
}

function printValidationErrors(products) {
  const errors = []
  
  for (const product of products) {
    if (!product.slug) errors.push(`${product.name}: Missing slug`)
    if (!product.name) errors.push(`${product.slug}: Missing name`)
    if (!product.price_eur || product.price_eur <= 0) {
      errors.push(`${product.slug}: Invalid price`)
    }
    if (!product.description || product.description.length < 20) {
      errors.push(`${product.slug}: Description too short`)
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
  console.log('🛍️  Product Import Script\n')
  
  const products = loadProducts()
  console.log(`📄 Loaded ${products.length} products from content/auto_products.json`)
  
  printValidationErrors(products)
  
  const payloads = createSanityPayload(products)
  console.log('✅ Payloads created\n')
  
  await importToSanity(payloads)
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})


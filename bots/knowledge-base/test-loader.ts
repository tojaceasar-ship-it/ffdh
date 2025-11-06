#!/usr/bin/env node
/**
 * Test script for Knowledge Base loader
 * Run: npx tsx test-loader.ts
 */

import { loadKnowledgeBase } from './src/knowledge-loader';
import { resolve } from 'path';

async function test() {
  console.log('🧪 Testing Knowledge Base Loader...\n');
  
  // Get project root (go up from bots/knowledge-base)
  const projectRoot = resolve(__dirname, '../..');
  
  try {
    const kb = await loadKnowledgeBase(projectRoot);
    
    console.log('✅ Knowledge Base loaded successfully!\n');
    console.log('📊 Loaded sections:');
    console.log(`  - Project Concept: ${kb.projectConcept?.name || '❌ Missing'}`);
    console.log(`  - Design System: ${kb.designSystem ? '✅' : '❌ Missing'}`);
    console.log(`  - API Config: ${kb.apiConfig ? '✅' : '❌ Missing'}`);
    console.log(`  - Content Specs: ${kb.contentSpecs ? '✅' : '❌ Missing'}`);
    console.log(`  - Requirements: ${kb.requirements ? '✅' : '❌ Missing'}`);
    console.log(`  - Schemas: ${Object.keys(kb.schemas).filter(k => kb.schemas[k]).length}/3`);
    
    if (kb.projectConcept?.name) {
      console.log(`\n📝 Project: ${kb.projectConcept.name}`);
      console.log(`   Description: ${kb.projectConcept.description}`);
      console.log(`   Framework: ${kb.projectConcept.architecture?.framework}`);
    }
    
    console.log('\n✨ Knowledge Base is ready to use!');
  } catch (error) {
    console.error('❌ Error loading Knowledge Base:', error);
    process.exit(1);
  }
}

test();


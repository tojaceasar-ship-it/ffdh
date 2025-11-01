#!/usr/bin/env node
/**
 * Prepare Vercel Environment Variables Helper
 * Reads .secrets/vercel.env.json and generates human-friendly instructions
 * WITHOUT exposing secret values
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const secretsFile = join(rootDir, '.secrets', 'vercel.env.json');

function main() {
  try {
    const secrets = JSON.parse(readFileSync(secretsFile, 'utf-8'));

    console.log('📋 Vercel Environment Variables Checklist\n');
    console.log('=' .repeat(70));
    console.log('');

    // Group by scope
    const publicVars = [];
    const serverVars = [];

    Object.entries(secrets).forEach(([name, config]) => {
      const entry = {
        name,
        description: config.description || 'No description',
        scope: config.scope || 'unknown',
        env: config.env || ['all'],
      };
      if (config.scope === 'public') {
        publicVars.push(entry);
      } else {
        serverVars.push(entry);
      }
    });

    console.log('🌐 PUBLIC Variables (exposed to client-side):');
    console.log('─'.repeat(70));
    console.log('');
    console.log('| Variable Name | Scope | Environments | Description |');
    console.log('|---------------|-------|---------------|-------------|');
    publicVars.forEach(({ name, scope, env, description }) => {
      const envList = Array.isArray(env) ? env.join(', ') : env;
      console.log(`| \`${name}\` | ${scope} | ${envList} | ${description} |`);
    });

    console.log('');
    console.log('🔐 SERVER Variables (server-side only):');
    console.log('─'.repeat(70));
    console.log('');
    console.log('| Variable Name | Scope | Environments | Description |');
    console.log('|---------------|-------|---------------|-------------|');
    serverVars.forEach(({ name, scope, env, description }) => {
      const envList = Array.isArray(env) ? env.join(', ') : env;
      console.log(`| \`${name}\` | ${scope} | ${envList} | ${description} |`);
    });

    console.log('');
    console.log('📝 Next Steps:');
    console.log('');
    console.log('1. Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables');
    console.log('2. For each variable above:');
    console.log('   - Click "Add New"');
    console.log('   - Paste the variable name');
    console.log('   - Get the actual value from .secrets/vercel.env.json or your secure manager');
    console.log('   - Paste the value');
    console.log('   - Select environments: Production, Preview, Development (as indicated)');
    console.log('   - Save');
    console.log('');
    console.log('3. After adding all variables, redeploy your project.');
    console.log('');

    // Generate a template file for easy copy-paste
    const templateLines = [];
    templateLines.push('# Vercel Environment Variables Template');
    templateLines.push('# Copy each line to Vercel Dashboard');
    templateLines.push('# Replace <REDACTED> with actual value from .secrets/vercel.env.json\n');
    Object.keys(secrets).forEach((name) => {
      templateLines.push(`${name}=<REDACTED>`);
    });

    const templateFile = join(rootDir, '.secrets', 'vercel.env.add.txt');
    writeFileSync(templateFile, templateLines.join('\n') + '\n', 'utf-8');
    console.log(`✅ Template file created: .secrets/vercel.env.add.txt`);
    console.log('   Use this file as a reference when adding variables to Vercel.');
    console.log('');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ Error: .secrets/vercel.env.json not found');
      console.error('   Run the secret ingestor first to create this file.');
      process.exit(1);
    } else {
      console.error('❌ Error reading secrets file:', error.message);
      process.exit(1);
    }
  }
}

main();


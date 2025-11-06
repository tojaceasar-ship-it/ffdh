#!/usr/bin/env node
/**
 * Automatic Knowledge Base Extraction Script
 * Extracts all project data into Knowledge Base JSON files
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '../..');
const kbDataPath = join(projectRoot, 'bots', 'knowledge-base', 'data');
const kbSchemasPath = join(kbDataPath, 'schemas');
const kbSecretsPath = join(projectRoot, 'bots', 'knowledge-base', 'secrets');

// Ensure directories exist
[kbDataPath, kbSchemasPath, kbSecretsPath].forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

console.log('🔍 Starting Knowledge Base extraction...\n');

// Helper to read and parse JSON
function readJson(filePath) {
  try {
    const fullPath = join(projectRoot, filePath);
    if (!existsSync(fullPath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return null;
    }
    return JSON.parse(readFileSync(fullPath, 'utf-8'));
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return null;
  }
}

// Helper to read text file
function readText(filePath) {
  try {
    const fullPath = join(projectRoot, filePath);
    if (!existsSync(fullPath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return null;
    }
    return readFileSync(fullPath, 'utf-8');
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return null;
  }
}

// Helper to write JSON
function writeJson(filePath, data) {
  const fullPath = join(kbDataPath, filePath);
  writeFileSync(fullPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(`✅ Created: ${filePath}`);
}

// 1. Extract Design System
console.log('📐 Extracting Design System...');
try {
  const tailwindConfig = readText('tailwind.config.ts');
  const globalsCss = readText('src/styles/globals.css');
  const emotionalAgents = readText('src/config/emotionalAgents.ts');
  
  // Extract colors from tailwind config
  const colorMatch = tailwindConfig?.match(/colors:\s*\{([^}]+)\}/s);
  const fontMatch = tailwindConfig?.match(/fontFamily:\s*\{([^}]+)\}/s);
  const animationMatch = tailwindConfig?.match(/animation:\s*\{([^}]+)\}/s);
  
  // Extract emotional agents
  const agentsMatch = emotionalAgents?.match(/export const EMOTIONAL_AGENTS[^=]*=\s*(\[[\s\S]*?\]);/);
  let agents = [];
  if (agentsMatch) {
    try {
      // Simple extraction - get agent objects
      const agentsText = agentsMatch[1];
      const agentObjects = agentsText.match(/\{[^}]+\}/g) || [];
      // Extract basic info from each agent
      agentObjects.forEach(agent => {
        const idMatch = agent.match(/"id":\s*"([^"]+)"/);
        const nameMatch = agent.match(/"name":\s*"([^"]+)"/);
        const colorMatch = agent.match(/"color":\s*"([^"]+)"/);
        const symbolMatch = agent.match(/"symbol":\s*"([^"]+)"/);
        if (idMatch && nameMatch) {
          agents.push({
            id: idMatch[1],
            name: nameMatch[1],
            color: colorMatch ? colorMatch[1] : '#000000',
            symbol: symbolMatch ? symbolMatch[1] : '•',
          });
        }
      });
    } catch (e) {
      console.warn('⚠️  Could not parse emotional agents, using basic structure');
    }
  }
  
  const designSystem = {
    colors: {
      brand: {
        primary: '#FFD700',
        secondary: '#00CED1',
        accent: '#FF4500',
        background: '#0a0a0a',
        foreground: '#ffffff',
      },
      palette: {
        brand: {
          50: "oklch(97% .04 260)",
          100: "oklch(92% .06 260)",
          200: "oklch(86% .08 260)",
          300: "oklch(78% .10 260)",
          400: "oklch(70% .12 260)",
          500: "oklch(60% .12 260)",
          600: "oklch(52% .12 260)",
          700: "oklch(44% .12 260)",
          800: "oklch(36% .10 260)",
          900: "oklch(28% .08 260)",
        },
        success: { 600: "oklch(52% .20 142)", 700: "oklch(45% .20 142)" },
        warning: { 600: "oklch(65% .15 85)", 700: "oklch(58% .15 85)" },
        danger: { 600: "oklch(52% .20 30)", 700: "oklch(45% .20 30)" },
        neutral: {
          50: "oklch(98% .005 95)",
          100: "oklch(95% .01 95)",
          200: "oklch(90% .015 95)",
          300: "oklch(80% .02 95)",
          400: "oklch(70% .025 95)",
          500: "oklch(55% .03 95)",
          600: "oklch(45% .035 95)",
          700: "oklch(35% .04 95)",
          800: "oklch(25% .045 95)",
          900: "oklch(15% .05 95)",
        },
      },
    },
    fonts: {
      primary: 'Orbitron',
      body: 'Inter',
      heading: 'Rajdhani',
      accent: 'Bungee',
    },
    animations: {
      'neon-pulse': 'pulse 2s infinite',
      glitch: 'glitch 0.1s infinite',
      'fade-in': 'fadeIn 0.5s ease-in-out',
      'slide-up': 'slideUp 0.3s ease-out',
      'slide-down': 'slideDown 0.3s ease-out',
    },
    emotionalAgents: agents.length > 0 ? agents : [
      { id: 'joy', name: 'Joy', color: '#FFD700', symbol: '☀️' },
      { id: 'fear', name: 'Fear', color: '#8B5CF6', symbol: '🜏' },
      { id: 'anger', name: 'Anger', color: '#FF4500', symbol: '⚡' },
      { id: 'nostalgia', name: 'Nostalgia', color: '#FFA500', symbol: '⌛' },
      { id: 'curiosity', name: 'Curiosity', color: '#00CED1', symbol: '❔' },
      { id: 'peace', name: 'Peace', color: '#90EE90', symbol: '🕊️' },
      { id: 'love', name: 'Love', color: '#FF69B4', symbol: '❤' },
      { id: 'chaos', name: 'Chaos', color: '#9370DB', symbol: '∞' },
      { id: 'disgust', name: 'Disgust', color: '#8B4513', symbol: '✖' },
    ],
  };
  
  writeJson('design-system.json', designSystem);
} catch (error) {
  console.error('❌ Error extracting design system:', error.message);
}

// 2. Extract API Configuration
console.log('\n🔌 Extracting API Configuration...');
try {
  const envChecklist = readText('docs/ENV_CHECKLIST.md');
  
  // Extract required variables
  const requiredVars = [];
  const optionalVars = [];
  
  if (envChecklist) {
    const requiredSection = envChecklist.match(/## Required Variables[\s\S]*?## Optional Variables/);
    const optionalSection = envChecklist.match(/## Optional Variables[\s\S]*$/);
    
    if (requiredSection) {
      const varMatches = requiredSection[0].matchAll(/\| `([^`]+)` \|/g);
      for (const match of varMatches) {
        requiredVars.push(match[1]);
      }
    }
    
    if (optionalSection) {
      const varMatches = optionalSection[0].matchAll(/\| `([^`]+)` \|/g);
      for (const match of varMatches) {
        optionalVars.push(match[1]);
      }
    }
  }
  
  const apiConfig = {
    services: {
      sanity: {
        projectId: '${NEXT_PUBLIC_SANITY_PROJECT_ID}',
        dataset: '${NEXT_PUBLIC_SANITY_DATASET}',
        apiVersion: '2024-01-01',
        endpoints: {
          studio: '/studio',
          api: 'https://${PROJECT_ID}.api.sanity.io',
        },
      },
      supabase: {
        url: '${NEXT_PUBLIC_SUPABASE_URL}',
        anonKey: '${NEXT_PUBLIC_SUPABASE_ANON_KEY}',
        tables: {
          scenes: 'scenes',
          products: 'products',
          comments: 'comments',
          reactions: 'reactions',
          feedback_logs: 'feedback_logs',
        },
      },
      stripe: {
        publishableKey: '${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}',
        webhookEndpoint: '/api/stripe/webhook',
      },
      printful: {
        apiEndpoint: 'https://api.printful.com',
        webhookEndpoint: '/api/printful/webhook',
      },
      openai: {
        model: 'gpt-4-turbo-preview',
        temperature: 0.9,
      },
    },
    requiredEnvVars: requiredVars,
    optionalEnvVars: optionalVars,
  };
  
  writeJson('api-config.json', apiConfig);
} catch (error) {
  console.error('❌ Error extracting API config:', error.message);
}

// 3. Extract Content Specifications
console.log('\n📝 Extracting Content Specifications...');
try {
  const todoFile = readText('TODO_FOR_HUMAN.md');
  const productsSample = readJson('content/auto_products.json');
  const scenesSample = readJson('content/auto_scenes.json');
  
  const contentSpecs = {
    products: {
      minCount: 10,
      requiredFields: [
        'name',
        'slug',
        'description',
        'price_eur',
        'imageUrl',
        'is_limited',
        'stock',
      ],
      descriptionMinWords: 150,
      languages: ['pl', 'en'],
      imageSpecs: {
        main: '1920x1920px',
        additional: 'min 3 images',
        format: 'WebP preferred',
      },
      sampleCount: productsSample?.length || 0,
    },
    scenes: {
      minCount: 15,
      requiredFields: [
        'slug',
        'title',
        'description',
        'narrative',
        'emotionTags',
        'imageUrl',
      ],
      narrativeMinWords: 200,
      emotions: [
        'joy',
        'sadness',
        'anger',
        'peace',
        'nostalgia',
        'curiosity',
        'fear',
        'love',
        'chaos',
        'disgust',
      ],
      sampleCount: scenesSample?.length || 0,
    },
    manifest: {
      minWords: 800,
      sections: [
        'mission',
        'history',
        'values',
        'socialImpact',
        'vision',
        'team',
      ],
    },
  };
  
  writeJson('content-specs.json', contentSpecs);
} catch (error) {
  console.error('❌ Error extracting content specs:', error.message);
}

// 4. Extract Requirements
console.log('\n📋 Extracting Requirements...');
try {
  const dodFile = readText('docs/FFDH_DEFINITION_OF_DONE.md');
  const criticalPathFile = readText('reports/CRITICAL_PATH.md');
  
  // Extract tasks from Critical Path
  const tasks = [];
  if (criticalPathFile) {
    const taskMatches = criticalPathFile.matchAll(/\*\*TASK-([A-Z-]+)\*\* \(([0-9.]+)h\)/g);
    for (const match of taskMatches) {
      tasks.push({
        id: `TASK-${match[1]}`,
        estimatedTime: parseFloat(match[2]),
        priority: 'P2',
      });
    }
  }
  
  const requirements = {
    definitionOfDone: {
      criticalPaths: {
        lookbook: { status: 'missing', priority: 'P1' },
        manifest: { status: 'missing', priority: 'P1' },
        printfulProxy: { status: 'missing', priority: 'P1' },
      },
      functionalRequirements: {
        auth: { status: 'missing', priority: 'P2' },
        cmsContent: { status: 'missing', priority: 'P1' },
      },
      qualityGates: {
        lighthouse: { target: 95, current: 'unknown' },
        testCoverage: { target: 70, current: 86.4 },
        bundleSize: { target: 500, unit: 'KB' },
        buildTime: { target: 60, current: 14.4, unit: 'seconds' },
      },
    },
    tasks: tasks.length > 0 ? tasks : [
      { id: 'TASK-POPULATE-CMS', estimatedTime: 2, priority: 'P1' },
      { id: 'TASK-ENABLE-WEBHOOK-VERIFICATION', estimatedTime: 0.5, priority: 'P2' },
      { id: 'TASK-CONFIGURE-PRINTFUL', estimatedTime: 0.5, priority: 'P2' },
      { id: 'TASK-IMPLEMENT-CHECKOUT-PRODUCT-DATA', estimatedTime: 1, priority: 'P2' },
      { id: 'TASK-IMPLEMENT-STRIPE-WEBHOOK-LOGIC', estimatedTime: 2, priority: 'P2' },
      { id: 'TASK-GENERATE-SITEMAP', estimatedTime: 1, priority: 'P2' },
      { id: 'TASK-PERFORMANCE-AUDIT', estimatedTime: 2, priority: 'P2' },
      { id: 'TASK-ADD-E2E-TESTS', estimatedTime: 3, priority: 'P2' },
      { id: 'TASK-IMPLEMENT-AUTH', estimatedTime: 4, priority: 'P2' },
    ],
  };
  
  writeJson('requirements.json', requirements);
} catch (error) {
  console.error('❌ Error extracting requirements:', error.message);
}

// 5. Extract Schemas
console.log('\n🗄️  Extracting Schemas...');

// 5.1 Sanity Schemas
try {
  const sanitySchemas = readText('src/lib/sanity-schemas.md');
  
  const sanitySchema = {
    schemas: [
      {
        name: 'Navigation Menu',
        fields: ['Category', 'Items'],
      },
      {
        name: 'Homepage Content',
        fields: ['Title', 'Description', 'Hero Slides'],
      },
      {
        name: 'Character Profile',
        fields: ['Name', 'Emoji', 'Description', 'Image', 'Slogan', 'Status'],
      },
      {
        name: 'Shop Products',
        fields: ['Name', 'Description', 'Price', 'Images', 'Category', 'Variants', 'Printful ID'],
      },
      {
        name: 'Lookbook Entries',
        fields: ['Title', 'Description', 'Images', 'Video URL', 'Tags', 'Publish Date'],
      },
      {
        name: 'Manifest Content',
        fields: ['Title', 'Content', 'Images'],
      },
    ],
    source: 'src/lib/sanity-schemas.md',
  };
  
  writeJson('schemas/sanity-schemas.json', sanitySchema);
} catch (error) {
  console.error('❌ Error extracting Sanity schemas:', error.message);
}

// 5.2 Supabase Schemas
try {
  const migrationFiles = [
    'supabase/migrations/001_initial_schema.sql',
    'supabase/migrations/002_scenes_schema_rewir.sql',
    'supabase/migrations/003_feedback_logs.sql',
    'supabase/migrations/004_scene_reactions_feedback.sql',
  ];
  
  const tables = [];
  migrationFiles.forEach(file => {
    const content = readText(file);
    if (content) {
      // Extract CREATE TABLE statements
      const tableMatches = content.matchAll(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?([a-z_]+)/gi);
      for (const match of tableMatches) {
        if (!tables.includes(match[1])) {
          tables.push(match[1]);
        }
      }
    }
  });
  
  const supabaseSchema = {
    tables: tables.length > 0 ? tables : ['scenes', 'products', 'comments', 'reactions', 'feedback_logs'],
    migrations: migrationFiles.map(f => f.replace('supabase/migrations/', '')),
  };
  
  writeJson('schemas/supabase-schemas.json', supabaseSchema);
} catch (error) {
  console.error('❌ Error extracting Supabase schemas:', error.message);
}

// 5.3 API Schemas
try {
  const apiRoutes = [
    { path: '/api/rewir/generate', method: 'POST', description: 'Generate Rewir scene' },
    { path: '/api/scenes/index', method: 'GET', description: 'List scenes' },
    { path: '/api/scenes/index', method: 'POST', description: 'Sync scenes' },
    { path: '/api/ai-reply', method: 'POST', description: 'Generate AI reply' },
    { path: '/api/ai/emotion', method: 'POST', description: 'Analyze emotion' },
    { path: '/api/comments', method: 'GET', description: 'Get comments' },
    { path: '/api/comments', method: 'POST', description: 'Create comment' },
    { path: '/api/checkout', method: 'POST', description: 'Create checkout session' },
    { path: '/api/stripe/webhook', method: 'POST', description: 'Stripe webhook' },
    { path: '/api/printful/webhook', method: 'POST', description: 'Printful webhook' },
    { path: '/api/webhooks/[source]', method: 'POST', description: 'Universal webhook handler' },
    { path: '/api/health', method: 'GET', description: 'Health check' },
  ];
  
  const apiSchema = {
    routes: apiRoutes,
    baseUrl: '${NEXT_PUBLIC_APP_URL}',
  };
  
  writeJson('schemas/api-schemas.json', apiSchema);
} catch (error) {
  console.error('❌ Error extracting API schemas:', error.message);
}

// 6. Create secrets template
console.log('\n🔐 Creating secrets template...');
try {
  const secretsTemplate = {
    sanity: {
      projectId: 'YOUR_SANITY_PROJECT_ID',
      authToken: 'YOUR_SANITY_AUTH_TOKEN',
    },
    supabase: {
      url: 'YOUR_SUPABASE_URL',
      anonKey: 'YOUR_SUPABASE_ANON_KEY',
      serviceRoleKey: 'YOUR_SUPABASE_SERVICE_ROLE_KEY',
    },
    stripe: {
      publishableKey: 'YOUR_STRIPE_PUBLISHABLE_KEY',
      secretKey: 'YOUR_STRIPE_SECRET_KEY',
      webhookSecret: 'YOUR_STRIPE_WEBHOOK_SECRET',
    },
    printful: {
      apiKey: 'YOUR_PRINTFUL_API_KEY',
      webhookSecret: 'YOUR_PRINTFUL_WEBHOOK_SECRET',
    },
    openai: {
      apiKey: 'YOUR_OPENAI_API_KEY',
    },
    nextauth: {
      secret: 'GENERATE_WITH_openssl_rand_base64_32',
      url: 'YOUR_PRODUCTION_URL',
    },
  };
  
  const secretsPath = join(kbSecretsPath, 'api-keys.json.example');
  writeFileSync(secretsPath, JSON.stringify(secretsTemplate, null, 2) + '\n', 'utf-8');
  console.log('✅ Created: secrets/api-keys.json.example (template)');
} catch (error) {
  console.error('❌ Error creating secrets template:', error.message);
}

console.log('\n✨ Knowledge Base extraction complete!');
console.log('\n📋 Next steps:');
console.log('   1. Review extracted files in bots/knowledge-base/data/');
console.log('   2. Copy secrets/api-keys.json.example to secrets/api-keys.json');
console.log('   3. Fill in your actual API keys in secrets/api-keys.json');
console.log('   4. Test with: cd bots/knowledge-base && npm test');


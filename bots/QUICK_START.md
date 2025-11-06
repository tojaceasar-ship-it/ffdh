# 🚀 FFDH Bot Army - Quick Start Guide

## Jak rozpocząć implementację

### Krok 1: Przygotowanie środowiska

```bash
# 1. Utwórz folder bots w głównym katalogu projektu
mkdir bots
cd bots

# 2. Zainicjalizuj npm workspace
npm init -y

# 3. Zainstaluj podstawowe zależności
npm install -D typescript @types/node tsx
npm install zod  # dla walidacji danych
```

### Krok 2: Utworzenie struktury Knowledge Base

```bash
# W katalogu bots/
mkdir -p knowledge-base/src
mkdir -p knowledge-base/data/schemas
mkdir -p knowledge-base/secrets
mkdir -p knowledge-base/templates/{page-templates,component-templates,content-templates}
```

### Krok 3: Konfiguracja TypeScript

Utwórz `bots/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Krok 4: Rozpocznij od Knowledge Base (Faza 0)

#### 4.1 Utwórz podstawowy loader

Plik: `bots/knowledge-base/src/knowledge-loader.ts`

```typescript
import { readFileSync } from 'fs';
import { join } from 'path';

interface KnowledgeBase {
  projectConcept: any;
  designSystem: any;
  apiConfig: any;
  contentSpecs: any;
  requirements: any;
  schemas: {
    sanity: any;
    supabase: any;
    api: any;
  };
}

export async function loadKnowledgeBase(basePath: string = process.cwd()): Promise<KnowledgeBase> {
  const kbPath = join(basePath, 'bots', 'knowledge-base', 'data');
  
  return {
    projectConcept: JSON.parse(readFileSync(join(kbPath, 'project-concept.json'), 'utf-8')),
    designSystem: JSON.parse(readFileSync(join(kbPath, 'design-system.json'), 'utf-8')),
    apiConfig: JSON.parse(readFileSync(join(kbPath, 'api-config.json'), 'utf-8')),
    contentSpecs: JSON.parse(readFileSync(join(kbPath, 'content-specs.json'), 'utf-8')),
    requirements: JSON.parse(readFileSync(join(kbPath, 'requirements.json'), 'utf-8')),
    schemas: {
      sanity: JSON.parse(readFileSync(join(kbPath, 'schemas', 'sanity-schemas.json'), 'utf-8')),
      supabase: JSON.parse(readFileSync(join(kbPath, 'schemas', 'supabase-schemas.json'), 'utf-8')),
      api: JSON.parse(readFileSync(join(kbPath, 'schemas', 'api-schemas.json'), 'utf-8')),
    },
  };
}
```

#### 4.2 Utwórz pierwszy plik danych - Project Concept

Plik: `bots/knowledge-base/data/project-concept.json`

```json
{
  "name": "FFDH + Rewir 2.0",
  "description": "Premium Next.js portal for FFDH × Rewir collaboration",
  "concept": "AI-generated street narratives with commerce flow",
  "brand": {
    "name": "Fruits From Da Hood",
    "tagline": "Glow bright",
    "mission": "Blending AI-generated street narratives with premium streetwear"
  },
  "architecture": {
    "framework": "Next.js 15",
    "routing": "App Router",
    "stateManagement": ["Redux Toolkit", "Zustand", "React Query"],
    "styling": "Tailwind CSS",
    "cms": "Sanity CMS",
    "database": "Supabase",
    "payments": "Stripe",
    "fulfillment": "Printful",
    "ai": "OpenAI GPT-4"
  },
  "routes": {
    "home": "/",
    "shop": "/shop",
    "rewir": "/rewir",
    "characters": "/characters",
    "lookbook": "/lookbook",
    "manifest": "/manifest"
  }
}
```

### Krok 5: Test Knowledge Base

Utwórz `bots/knowledge-base/test-loader.ts`:

```typescript
import { loadKnowledgeBase } from './src/knowledge-loader';

async function test() {
  try {
    const kb = await loadKnowledgeBase();
    console.log('✅ Knowledge Base loaded successfully!');
    console.log('Project:', kb.projectConcept.name);
  } catch (error) {
    console.error('❌ Error loading Knowledge Base:', error);
  }
}

test();
```

Uruchom:
```bash
cd bots/knowledge-base
npx tsx test-loader.ts
```

## Następne kroki

1. ✅ **Knowledge Base Infrastructure** - Utworzona podstawowa struktura
2. ⏭️ **Extract Project Concept** - Wyekstrahuj dane z README.md
3. ⏭️ **Extract Design System** - Wyekstrahuj z tailwind.config.ts
4. ⏭️ **Extract API Config** - Wyekstrahuj z docs/ENV_CHECKLIST.md
5. ⏭️ **Extract Content Specs** - Wyekstrahuj z TODO_FOR_HUMAN.md
6. ⏭️ **Extract Requirements** - Wyekstrahuj z Definition of Done
7. ⏭️ **Extract Schemas** - Wyekstrahuj schematy z różnych źródeł

## Przydatne komendy

```bash
# Test Knowledge Base
cd bots/knowledge-base && npx tsx test-loader.ts

# Walidacja struktury
cd bots && npm run validate-kb

# Build TypeScript
cd bots && npx tsc
```

## Wsparcie

Zobacz pełny plan: `.cursor/plans/ffdh-bot-army-pro-gold-final-dc9ccbca.plan.md`


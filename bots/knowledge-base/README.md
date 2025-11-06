# Knowledge Base - FFDH Bot Army

Centralne repozytorium wiedzy dla wszystkich botów.

## Struktura

```
knowledge-base/
├── src/
│   ├── knowledge-loader.ts      # Ładowanie danych
│   ├── knowledge-validator.ts   # Walidacja kompletności
│   └── knowledge-api.ts         # API dla botów
├── data/                        # Dane projektu (tracked in git)
│   ├── project-concept.json
│   ├── design-system.json
│   ├── api-config.json
│   ├── content-specs.json
│   ├── requirements.json
│   └── schemas/
├── secrets/                     # Secrets (gitignored!)
│   ├── api-keys.json
│   └── webhook-secrets.json
└── templates/                   # Szablony dla botów
```

## Użycie

```typescript
import { getKnowledgeAPI } from './src/knowledge-loader';

const kb = getKnowledgeAPI();
await kb.load();

const project = kb.getProjectConcept();
const design = kb.getDesignSystem();
```

## Test

```bash
npm test
# lub
npx tsx test-loader.ts
```

## Bezpieczeństwo

⚠️ **NIGDY nie commituj plików z `secrets/`!**

Secrets są automatycznie gitignored.


import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface KnowledgeBase {
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

/**
 * Load Knowledge Base from data files
 * @param basePath - Base path to project root (default: process.cwd())
 * @returns KnowledgeBase object with all loaded data
 */
export async function loadKnowledgeBase(
  basePath: string = process.cwd()
): Promise<KnowledgeBase> {
  const kbPath = join(basePath, 'bots', 'knowledge-base', 'data');
  
  const loadJson = (filePath: string): any => {
    const fullPath = join(kbPath, filePath);
    if (!existsSync(fullPath)) {
      console.warn(`⚠️  Knowledge Base file not found: ${filePath}`);
      return {};
    }
    try {
      return JSON.parse(readFileSync(fullPath, 'utf-8'));
    } catch (error) {
      console.error(`❌ Error loading ${filePath}:`, error);
      return {};
    }
  };

  return {
    projectConcept: loadJson('project-concept.json'),
    designSystem: loadJson('design-system.json'),
    apiConfig: loadJson('api-config.json'),
    contentSpecs: loadJson('content-specs.json'),
    requirements: loadJson('requirements.json'),
    schemas: {
      sanity: loadJson('schemas/sanity-schemas.json'),
      supabase: loadJson('schemas/supabase-schemas.json'),
      api: loadJson('schemas/api-schemas.json'),
    },
  };
}

/**
 * Get Knowledge Base API for bots
 */
export function getKnowledgeAPI(basePath?: string) {
  let cached: KnowledgeBase | null = null;

  return {
    async load(): Promise<KnowledgeBase> {
      if (!cached) {
        cached = await loadKnowledgeBase(basePath);
      }
      return cached;
    },
    async reload(): Promise<KnowledgeBase> {
      cached = null;
      return this.load();
    },
    getProjectConcept() {
      return cached?.projectConcept;
    },
    getDesignSystem() {
      return cached?.designSystem;
    },
    getApiConfig() {
      return cached?.apiConfig;
    },
    getContentSpecs() {
      return cached?.contentSpecs;
    },
    getRequirements() {
      return cached?.requirements;
    },
    getSchemas() {
      return cached?.schemas;
    },
  };
}


import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';

interface ValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Validate Knowledge Base completeness
 */
export function validateKnowledgeBase(basePath?: string): ValidationResult {
  // If no basePath provided, try to find project root
  let projectRoot = basePath;
  if (!projectRoot) {
    // Try to find project root by looking for bots/ directory
    let current = process.cwd();
    while (current !== dirname(current)) {
      if (existsSync(join(current, 'bots', 'knowledge-base'))) {
        projectRoot = current;
        break;
      }
      current = dirname(current);
    }
    if (!projectRoot) {
      projectRoot = process.cwd();
    }
  }
  const kbPath = join(projectRoot, 'bots', 'knowledge-base', 'data');
  const requiredFiles = [
    'project-concept.json',
    'design-system.json',
    'api-config.json',
    'content-specs.json',
    'requirements.json',
    'schemas/sanity-schemas.json',
    'schemas/supabase-schemas.json',
    'schemas/api-schemas.json',
  ];

  const missing: string[] = [];
  const warnings: string[] = [];

  requiredFiles.forEach(file => {
    const fullPath = join(kbPath, file);
    if (!existsSync(fullPath)) {
      missing.push(file);
    } else {
      // Basic validation - check if file is valid JSON
      try {
        const content = readFileSync(fullPath, 'utf-8');
        JSON.parse(content);
      } catch (error) {
        warnings.push(`${file} is not valid JSON`);
      }
    }
  });

  // Check secrets template
  const secretsTemplate = join(projectRoot, 'bots', 'knowledge-base', 'secrets', 'api-keys.json.example');
  if (!existsSync(secretsTemplate)) {
    warnings.push('Secrets template not found');
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Print validation report
 */
export function printValidationReport(result: ValidationResult): void {
  console.log('\n📋 Knowledge Base Validation Report\n');

  if (result.isValid) {
    console.log('✅ All required files present!');
  } else {
    console.log('❌ Missing files:');
    result.missing.forEach(file => {
      console.log(`   - ${file}`);
    });
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.warnings.forEach(warning => {
      console.log(`   - ${warning}`);
    });
  }

  console.log('\n');
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = validateKnowledgeBase();
  printValidationReport(result);
  process.exit(result.isValid ? 0 : 1);
}


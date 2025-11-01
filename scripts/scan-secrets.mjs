#!/usr/bin/env node
/**
 * Secret Scanner for Pre-commit Hook
 * Scans tracked files for potential secret patterns
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Patterns that indicate secrets (do not match placeholder values)
const SECRET_PATTERNS = [
  {
    name: 'Stripe Live Secret Key',
    pattern: /sk_live_[a-zA-Z0-9]{32,}/,
    exclude: /sk_live_YOUR_|sk_live_PLACEHOLDER/i,
  },
  {
    name: 'Stripe Webhook Secret',
    pattern: /whsec_[a-zA-Z0-9]{20,}/,
    exclude: /whsec_YOUR_|whsec_PLACEHOLDER/i,
  },
  {
    name: 'Service Role Key',
    pattern: /service_role["\s:=]+[a-zA-Z0-9_-]{50,}/,
    exclude: /YOUR_|PLACEHOLDER/i,
  },
  {
    name: 'OpenAI API Key',
    pattern: /sk-proj-[a-zA-Z0-9_-]{50,}/,
    exclude: /sk-proj-YOUR_|sk-proj-PLACEHOLDER/i,
  },
  {
    name: 'Sanity Auth Token',
    pattern: /SANITY_AUTH_TOKEN["\s:=]+sk[a-zA-Z0-9]{50,}/,
    exclude: /SANITY_AUTH_TOKEN["\s:=]+.*YOUR_|PLACEHOLDER/i,
  },
  {
    name: 'Resend API Key',
    pattern: /RESEND_API_KEY["\s:=]+re_[a-zA-Z0-9_-]{30,}/,
    exclude: /RESEND_API_KEY["\s:=]+.*YOUR_|PLACEHOLDER/i,
  },
  {
    name: 'Printful API Key',
    pattern: /PRINTFUL_API_KEY["\s:=]+[a-zA-Z0-9_-]{30,}/,
    exclude: /PRINTFUL_API_KEY["\s:=]+.*YOUR_|PLACEHOLDER/i,
  },
];

function getTrackedFiles() {
  try {
    const output = execSync('git ls-files', { cwd: rootDir, encoding: 'utf-8' });
    return output
      .split('\n')
      .filter(Boolean)
      .filter((file) => {
        // Skip binary files and common non-secret locations
        const skipPatterns = [
          /\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|pdf|zip)$/i,
          /node_modules/,
          /\.git/,
          /yarn\.lock|package-lock\.json/,
          /\.tsbuildinfo$/,
          /coverage/,
          /\.env\.example$/,
        ];
        return !skipPatterns.some((pattern) => pattern.test(file));
      });
  } catch (error) {
    console.error('Error getting tracked files:', error.message);
    return [];
  }
}

function scanFile(filePath) {
  const fullPath = join(rootDir, filePath);
  let content;
  try {
    content = readFileSync(fullPath, 'utf-8');
  } catch (error) {
    // Skip files that can't be read (binary, etc.)
    return [];
  }

  const findings = [];

  SECRET_PATTERNS.forEach(({ name, pattern, exclude }) => {
    const matches = content.matchAll(new RegExp(pattern, 'g'));
    for (const match of matches) {
      const matchText = match[0];
      // Check if it's a placeholder
      if (exclude && exclude.test(matchText)) {
        continue;
      }
      // Redact the secret in output
      const redacted = matchText.substring(0, 10) + '...' + matchText.substring(matchText.length - 4);
      findings.push({
        file: filePath,
        line: content.substring(0, match.index).split('\n').length,
        pattern: name,
        redacted,
      });
    }
  });

  return findings;
}

function main() {
  console.log('🔍 Scanning for secrets in tracked files...\n');

  const trackedFiles = getTrackedFiles();
  const allFindings = [];

  trackedFiles.forEach((file) => {
    const findings = scanFile(file);
    allFindings.push(...findings);
  });

  if (allFindings.length > 0) {
    console.error('❌ SECRETS DETECTED IN TRACKED FILES!\n');
    console.error('Found potential secrets:\n');
    allFindings.forEach(({ file, line, pattern, redacted }) => {
      console.error(`  ${file}:${line} - ${pattern}`);
      console.error(`    Found: ${redacted}`);
    });
    console.error(
      '\n⚠️  Commit blocked. Remove secrets from tracked files.\n   Secrets should only exist in .env.local, .env.production.local, or .secrets/ (gitignored)\n'
    );
    process.exit(1);
  }

  console.log('✅ No secrets detected in tracked files');
  process.exit(0);
}

main();


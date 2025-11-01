#!/usr/bin/env tsx
/**
 * Snapshot Exporter
 * Creates build artifacts snapshots for CI/CD rollback and debugging
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

interface SnapshotMetadata {
  timestamp: string
  gitCommit: string
  gitBranch: string
  buildStage: string
  checksums: {
    packageJson: string
    lockfile?: string
    buildManifest?: string
  }
  environment: {
    nodeVersion: string
    platform: string
    ci?: string
  }
}

/**
 * Generate checksum for a file
 */
function generateChecksum(filePath: string): string {
  try {
    const crypto = require('crypto')
    const fs = require('fs')
    const content = fs.readFileSync(filePath)
    return crypto.createHash('sha256').update(content).digest('hex')
  } catch (error) {
    console.warn(`Failed to generate checksum for ${filePath}:`, error)
    return 'unknown'
  }
}

/**
 * Get git information
 */
function getGitInfo(): { commit: string; branch: string } {
  try {
    const commit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim()
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim()
    return { commit, branch }
  } catch (error) {
    console.warn('Failed to get git info:', error)
    return { commit: 'unknown', branch: 'unknown' }
  }
}

/**
 * Export snapshot for a build stage
 */
export function exportSnapshot(buildStage: string): SnapshotMetadata {
  const snapshotDir = join(process.cwd(), 'snapshots')
  if (!existsSync(snapshotDir)) {
    mkdirSync(snapshotDir, { recursive: true })
  }

  const gitInfo = getGitInfo()
  const timestamp = new Date().toISOString()
  const snapshotId = `${buildStage}-${timestamp.replace(/[:.]/g, '-')}`

  // Generate checksums
  const packageJsonPath = join(process.cwd(), 'package.json')
  const lockfilePath = join(process.cwd(), 'yarn.lock')
  const buildManifestPath = join(process.cwd(), '.next', 'build-manifest.json')

  const checksums = {
    packageJson: generateChecksum(packageJsonPath),
    lockfile: existsSync(lockfilePath) ? generateChecksum(lockfilePath) : undefined,
    buildManifest: existsSync(buildManifestPath)
      ? generateChecksum(buildManifestPath)
      : undefined,
  }

  const metadata: SnapshotMetadata = {
    timestamp,
    gitCommit: gitInfo.commit,
    gitBranch: gitInfo.branch,
    buildStage,
    checksums,
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      ci: process.env.CI || undefined,
    },
  }

  // Write metadata file
  const metadataPath = join(snapshotDir, `${snapshotId}.json`)
  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))

  console.log(`✅ Snapshot exported: ${snapshotId}`)
  console.log(`   Location: ${metadataPath}`)
  console.log(`   Commit: ${gitInfo.commit.substring(0, 7)}`)
  console.log(`   Branch: ${gitInfo.branch}`)

  return metadata
}

/**
 * CLI entry point
 */
if (require.main === module) {
  const buildStage = process.argv[2] || 'unknown'
  exportSnapshot(buildStage)
}

export const snapshotExporter = { exportSnapshot }
export default snapshotExporter


import fs from "fs";
import path from "path";
import crypto from "crypto";

const CACHE_DIR = path.join(".ffdh", "cache", "artifacts");
const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry {
  hash: string;
  path: string;
  size: number;
  createdAt: number;
}

// Simple LRU cache
const cacheIndex: Map<string, CacheEntry> = new Map();

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function hashContent(content: string | Buffer): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function cleanupOldEntries() {
  const now = Date.now();
  let totalSize = 0;

  for (const [key, entry] of cacheIndex.entries()) {
    if (now - entry.createdAt > MAX_AGE_MS) {
      try {
        fs.unlinkSync(entry.path);
        cacheIndex.delete(key);
      } catch {}
    } else {
      totalSize += entry.size;
    }
  }

  // If still too large, remove oldest
  if (totalSize > MAX_CACHE_SIZE) {
    const sorted = Array.from(cacheIndex.entries()).sort(
      (a, b) => a[1].createdAt - b[1].createdAt
    );
    for (const [key, entry] of sorted) {
      if (totalSize <= MAX_CACHE_SIZE) break;
      try {
        fs.unlinkSync(entry.path);
        cacheIndex.delete(key);
        totalSize -= entry.size;
      } catch {}
    }
  }
}

export async function storeArtifact(
  content: string | Buffer,
  metadata?: Record<string, unknown>
): Promise<string> {
  ensureCacheDir();
  cleanupOldEntries();

  const hash = hashContent(content);
  const filePath = path.join(CACHE_DIR, `${hash}.json`);

  if (fs.existsSync(filePath)) {
    return hash; // Already cached
  }

  const artifact = {
    content: content.toString(),
    metadata: metadata || {},
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(filePath, JSON.stringify(artifact, null, 2));

  const stats = fs.statSync(filePath);
  cacheIndex.set(hash, {
    hash,
    path: filePath,
    size: stats.size,
    createdAt: Date.now(),
  });

  // Remote storage (if configured)
  if (process.env.ARTIFACTS_REMOTE) {
    // TODO: Implement S3/Supabase upload
    console.warn("ARTIFACTS_REMOTE configured but not implemented");
  }

  return hash;
}

export async function retrieveArtifact(
  hash: string
): Promise<{ content: string; metadata: Record<string, unknown> } | null> {
  ensureCacheDir();

  const filePath = path.join(CACHE_DIR, `${hash}.json`);

  if (!fs.existsSync(filePath)) {
    // Try remote
    if (process.env.ARTIFACTS_REMOTE) {
      // TODO: Implement remote fetch
      return null;
    }
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return {
      content: data.content,
      metadata: data.metadata || {},
    };
  } catch {
    return null;
  }
}


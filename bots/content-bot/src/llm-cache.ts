import fs from "fs";
import path from "path";
import crypto from "crypto";

const CACHE_DIR = path.join(".ffdh", "cache", "llm");

interface CachedResponse {
  prompt: string;
  response: string;
  model: string;
  temperature: number;
  top_p: number;
  createdAt: string;
}

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function normalizePrompt(prompt: string): string {
  // Remove random fields, timestamps, etc.
  return prompt
    .replace(/timestamp["\s:]+[0-9]+/gi, "")
    .replace(/random["\s:]+[0-9.]+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hashPrompt(prompt: string, model: string, temperature: number, top_p: number): string {
  const normalized = normalizePrompt(prompt);
  const key = `${model}:${temperature}:${top_p}:${normalized}`;
  return crypto.createHash("sha256").update(key).digest("hex");
}

export function getCachedResponse(
  prompt: string,
  model: string = "gpt-4-turbo-preview",
  temperature: number = 0.3,
  top_p: number = 0.9
): string | null {
  ensureCacheDir();

  const hash = hashPrompt(prompt, model, temperature, top_p);
  const filePath = path.join(CACHE_DIR, `${hash}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const cached: CachedResponse = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    
    // Check age (max 30 days)
    const age = Date.now() - new Date(cached.createdAt).getTime();
    if (age > 30 * 24 * 60 * 60 * 1000) {
      fs.unlinkSync(filePath);
      return null;
    }

    return cached.response;
  } catch {
    return null;
  }
}

export function cacheResponse(
  prompt: string,
  response: string,
  model: string = "gpt-4-turbo-preview",
  temperature: number = 0.3,
  top_p: number = 0.9
): void {
  ensureCacheDir();

  const hash = hashPrompt(prompt, model, temperature, top_p);
  const filePath = path.join(CACHE_DIR, `${hash}.json`);

  const cached: CachedResponse = {
    prompt: normalizePrompt(prompt),
    response,
    model,
    temperature,
    top_p,
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(filePath, JSON.stringify(cached, null, 2));
}

export function batchPrompts(prompts: string[], batchSize: number = 12): string[][] {
  const batches: string[][] = [];
  for (let i = 0; i < prompts.length; i += batchSize) {
    batches.push(prompts.slice(i, i + batchSize));
  }
  return batches;
}


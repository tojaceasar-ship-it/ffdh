import fs from "fs";
import path from "path";

const METRICS_FILE = path.join(".ffdh", "metrics.jsonl");

interface MetricRecord {
  ts: string;
  task: string;
  status: "success" | "fail";
  durMs: number;
  retries?: number;
  tokensIn?: number;
  tokensOut?: number;
  cacheHit?: boolean;
}

export function writeMetric(record: MetricRecord) {
  const dir = path.dirname(METRICS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const line = JSON.stringify(record) + "\n";
  fs.appendFileSync(METRICS_FILE, line, "utf-8");
}

export function readMetrics(limit = 1000): MetricRecord[] {
  if (!fs.existsSync(METRICS_FILE)) {
    return [];
  }

  const lines = fs.readFileSync(METRICS_FILE, "utf-8").split("\n").filter(Boolean);
  const records = lines
    .slice(-limit)
    .map((line) => {
      try {
        return JSON.parse(line) as MetricRecord;
      } catch {
        return null;
      }
    })
    .filter((r): r is MetricRecord => r !== null);

  return records;
}

export function getMetricsSummary() {
  const records = readMetrics(10000);
  
  if (records.length === 0) {
    return {
      total: 0,
      success: 0,
      fail: 0,
      errorRate: 0,
      avgDuration: 0,
      p50: 0,
      p95: 0,
      cacheHitRate: 0,
    };
  }

  const success = records.filter((r) => r.status === "success").length;
  const fail = records.filter((r) => r.status === "fail").length;
  const durations = records.map((r) => r.durMs).sort((a, b) => a - b);
  const cacheHits = records.filter((r) => r.cacheHit === true).length;

  const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
  const p50 = durations[Math.floor(durations.length * 0.5)] || 0;
  const p95 = durations[Math.floor(durations.length * 0.95)] || 0;

  return {
    total: records.length,
    success,
    fail,
    errorRate: fail / records.length,
    avgDuration: Math.round(avgDuration),
    p50: Math.round(p50),
    p95: Math.round(p95),
    cacheHitRate: cacheHits / records.length,
  };
}


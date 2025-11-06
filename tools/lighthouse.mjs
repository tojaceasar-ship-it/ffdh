#!/usr/bin/env node
/**
 * Lighthouse runner for performance testing
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUTPUT_DIR = path.join(process.cwd(), ".reports", "lh");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const pages = [
  { name: "homepage", url: "/" },
  { name: "product", url: "/product/banana-man-tee" }, // Example product
];

async function runLighthouse(url, name) {
  const outputPath = path.join(OUTPUT_DIR, `${name}.json`);
  const htmlPath = path.join(OUTPUT_DIR, `${name}.html`);

  try {
    console.log(`Running Lighthouse for ${name}...`);
    
    const command = `npx lighthouse "${BASE_URL}${url}" --output=json,html --output-path="${outputPath}" --chrome-flags="--headless --no-sandbox" --quiet`;
    
    execSync(command, { stdio: "inherit" });
    
    // Read and parse results
    const results = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
    const scores = results.categories;
    
    console.log(`\n📊 ${name} scores:`);
    console.log(`  Performance: ${Math.round(scores.performance?.score * 100 || 0)}`);
    console.log(`  Accessibility: ${Math.round(scores.accessibility?.score * 100 || 0)}`);
    console.log(`  Best Practices: ${Math.round(scores["best-practices"]?.score * 100 || 0)}`);
    console.log(`  SEO: ${Math.round(scores.seo?.score * 100 || 0)}`);
    
    return {
      name,
      url,
      performance: Math.round(scores.performance?.score * 100 || 0),
      accessibility: Math.round(scores.accessibility?.score * 100 || 0),
      bestPractices: Math.round(scores["best-practices"]?.score * 100 || 0),
      seo: Math.round(scores.seo?.score * 100 || 0),
    };
  } catch (error) {
    console.error(`Error running Lighthouse for ${name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log("🔍 Starting Lighthouse performance tests...\n");
  console.log(`Base URL: ${BASE_URL}\n`);

  const results = [];

  for (const page of pages) {
    const result = await runLighthouse(page.url, page.name);
    if (result) {
      results.push(result);
    }
  }

  // Summary
  console.log("\n📋 Summary:");
  console.log("=".repeat(50));
  
  const avgPerformance = results.reduce((sum, r) => sum + r.performance, 0) / results.length;
  const avgAccessibility = results.reduce((sum, r) => sum + r.accessibility, 0) / results.length;
  
  console.log(`Average Performance: ${Math.round(avgPerformance)}`);
  console.log(`Average Accessibility: ${Math.round(avgAccessibility)}`);
  
  // Quality gates
  const desktopTarget = 95;
  const mobileTarget = 92;
  
  if (avgPerformance < desktopTarget) {
    console.warn(`\n⚠️  Performance below target (${desktopTarget})`);
  } else {
    console.log(`\n✅ Performance meets target (${desktopTarget})`);
  }
  
  // Write summary JSON
  const summaryPath = path.join(OUTPUT_DIR, "summary.json");
  fs.writeFileSync(
    summaryPath,
    JSON.stringify({ results, averages: { performance: avgPerformance, accessibility: avgAccessibility } }, null, 2)
  );
  
  console.log(`\n📁 Reports saved to: ${OUTPUT_DIR}`);
}

main().catch(console.error);


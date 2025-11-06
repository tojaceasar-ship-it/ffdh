#!/usr/bin/env node
/**
 * Only-changed detection for CI/CD
 * Detects changes in apps/web/** and sets SKIP_WEB_BUILD if no changes
 */

const { execSync } = require("child_process");
const path = require("path");

function getChangedFiles() {
  try {
    // In CI, use GITHUB_BASE_REF or main branch
    const baseRef = process.env.GITHUB_BASE_REF || "main";
    const command = `git diff --name-only origin/${baseRef}...HEAD`;
    const output = execSync(command, { encoding: "utf-8" });
    return output
      .split("\n")
      .filter(Boolean)
      .map((f) => f.trim());
  } catch (error) {
    // If no git or not in CI, assume all changed
    console.warn("Could not detect changed files, assuming all changed");
    return [];
  }
}

function hasWebChanges(changedFiles) {
  const webPaths = [
    "app/",
    "src/",
    "public/",
    "next.config.js",
    "tailwind.config.ts",
    "tsconfig.json",
    "package.json",
  ];

  return changedFiles.some((file) =>
    webPaths.some((path) => file.startsWith(path))
  );
}

function main() {
  const changedFiles = getChangedFiles();

  if (changedFiles.length === 0) {
    console.log("No changed files detected");
    process.exit(0);
  }

  const hasWeb = hasWebChanges(changedFiles);

  if (!hasWeb) {
    console.log("No web app changes detected, setting SKIP_WEB_BUILD=1");
    process.env.SKIP_WEB_BUILD = "1";
    // Export for shell
    if (process.platform !== "win32") {
      console.log('export SKIP_WEB_BUILD="1"');
    }
  } else {
    console.log("Web app changes detected, building web");
    process.env.SKIP_WEB_BUILD = "0";
  }

  // Write to file for CI
  const fs = require("fs");
  const envFile = path.join(process.cwd(), ".env.ci");
  fs.writeFileSync(
    envFile,
    `SKIP_WEB_BUILD=${hasWeb ? "0" : "1"}\n`,
    "utf-8"
  );
}

main();


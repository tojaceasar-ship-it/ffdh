#!/usr/bin/env tsx
import { Command } from "commander";
import { readFileSync } from "fs";

const program = new Command();
program.name("ffdh-autopilot").description("CLI for FFDH-AUTOPILOT PRIME").version("2.3");

program
  .command("run")
  .argument("<module>", "Module name (e.g. env-doctor)")
  .description("Print the prompt for a given module")
  .action((module: string) => {
    try {
      const text = readFileSync(`modules/${module}.md`, "utf-8");
      console.log("=== PROMPT START ===\n");
      console.log(text);
      console.log("\n=== PROMPT END ===");
    } catch {
      console.error("Module not found:", module);
    }
  });

program.parse();

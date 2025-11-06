import fs from "fs-extra";
import path from "path";
import { TaskDefinition, TaskResult } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";
import { generateNavbarRule } from "../rules/navbar.js";
import { generateHeroRule } from "../rules/hero.js";

const rules = {
  [generateNavbarRule.name]: generateNavbarRule,
  [generateHeroRule.name]: generateHeroRule,
};

export class FallbackEngine {
  hasRule(taskName: string): boolean {
    return Object.keys(rules).some(ruleName => ruleName === taskName);
  }

  async executeRule(taskName: string, inputs: any): Promise<TaskResult> {
    const rule = rules[taskName as keyof typeof rules];
    if (!rule) {
      throw new Error(`Rule not found: ${taskName}`);
    }

    console.log(`🔧 Executing fallback rule: ${rule.description}`);

    const result = rule.execute(inputs);

    // Save the generated component
    const repoRoot = this.findRepoRoot();
    const outputPath = path.join(repoRoot, "apps", "web", result.file);

    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, result.component.trim(), "utf8");

    return {
      id: `fallback-${Date.now()}`,
      status: "success",
      attempts: 1,
      artifacts: [outputPath],
      metrics: {
        fallbackUsed: true,
        ruleApplied: taskName,
        durationMs: 10 // Rules are fast
      }
    };
  }

  private findRepoRoot(): string {
    let current = process.cwd();
    while (current && !fs.existsSync(path.join(current, 'pnpm-workspace.yaml'))) {
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
    return current;
  }
}

export const FallbackEngineBot: BotRegistration = {
  name: "FallbackEngine",
  accepts: Object.keys(rules),
  concurrency: 2,
  async handler(task: TaskDefinition) {
    const engine = new FallbackEngine();

    if (!engine.hasRule(task.name)) {
      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: `No fallback rule for: ${task.name}`,
        artifacts: [],
        metrics: {}
      };
    }

    try {
      const result = await engine.executeRule(task.name, task.inputsRef);
      return {
        ...result,
        id: task.id
      };
    } catch (error) {
      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: error instanceof Error ? error.message : String(error),
        artifacts: [],
        metrics: { fallbackUsed: true }
      };
    }
  }
};

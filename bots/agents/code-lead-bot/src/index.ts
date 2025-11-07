import { TaskDefinition, TaskResult } from "../../../../shared/types/task.js";
import { BotRegistration } from "../../../../shared/types/bot.js";
import { getAgentBridge } from "../../agent-bridge/src/index.js";
import fs from "fs-extra";
import path from "path";

/**
 * CodeLeadBot - Specialized bot for code architecture and best practices
 */
export class CodeLeadBot {
  private bridge = getAgentBridge();

  constructor() {
    // Register bridge methods
    this.bridge.registerMethod("code.review-architecture", async (params: any) => {
      return this.reviewArchitecture(params);
    });

    this.bridge.registerMethod("code.suggest-patterns", async (params: any) => {
      return this.suggestPatterns(params);
    });
  }

  /**
   * Review code architecture
   */
  async reviewArchitecture(architecture: {
    structure: any;
    patterns: string[];
  }): Promise<any> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for common issues
    if (!architecture.structure.components || architecture.structure.components.length === 0) {
      issues.push("No components defined");
    }

    if (!architecture.structure.pages || architecture.structure.pages.length === 0) {
      issues.push("No pages defined");
    }

    // Suggest patterns
    if (!architecture.patterns.includes("component-composition")) {
      recommendations.push("Consider using component composition pattern");
    }

    if (!architecture.patterns.includes("separation-of-concerns")) {
      recommendations.push("Implement separation of concerns");
    }

    return {
      score: issues.length === 0 ? 90 : 70,
      issues,
      recommendations,
      patterns: architecture.patterns
    };
  }

  /**
   * Suggest code patterns
   */
  async suggestPatterns(context: {
    framework: string;
    requirements: string[];
  }): Promise<string[]> {
    const patterns: string[] = [];

    if (context.framework === "nextjs") {
      patterns.push("app-router", "server-components", "client-components");
    }

    if (context.requirements.includes("state-management")) {
      patterns.push("react-context", "zustand");
    }

    if (context.requirements.includes("data-fetching")) {
      patterns.push("swr", "react-query");
    }

    return patterns;
  }

  /**
   * Generate code structure
   */
  async generateStructure(requirements: {
    pages: string[];
    components: string[];
    framework: string;
  }): Promise<any> {
    const structure = {
      pages: requirements.pages.map(page => ({
        path: `/${page.toLowerCase()}`,
        component: `${page}Page`,
        layout: "DefaultLayout"
      })),
      components: requirements.components.map(comp => ({
        name: comp,
        path: `components/${comp}.tsx`,
        type: "component"
      })),
      framework: requirements.framework
    };

    return structure;
  }
}

export const CodeLeadBotRegistration: BotRegistration = {
  name: "CodeLeadBot",
  accepts: ["code.review-architecture", "code.suggest-patterns", "code.generate-structure"],
  concurrency: 2,
  async handler(task: TaskDefinition): Promise<TaskResult> {
    const bot = new CodeLeadBot();

    try {
      if (task.name === "code.review-architecture") {
        const params = task.inputsRef ? JSON.parse(task.inputsRef as string) : {};
        const review = await bot.reviewArchitecture(params);

        return {
          id: task.id,
          status: "success",
          attempts: 1,
          artifacts: [JSON.stringify(review)],
          metrics: {}
        };
      }

      if (task.name === "code.suggest-patterns") {
        const params = task.inputsRef ? JSON.parse(task.inputsRef as string) : {};
        const patterns = await bot.suggestPatterns(params);

        return {
          id: task.id,
          status: "success",
          attempts: 1,
          artifacts: [JSON.stringify(patterns)],
          metrics: {}
        };
      }

      if (task.name === "code.generate-structure") {
        const params = task.inputsRef ? JSON.parse(task.inputsRef as string) : {};
        const structure = await bot.generateStructure(params);

        return {
          id: task.id,
          status: "success",
          attempts: 1,
          artifacts: [JSON.stringify(structure)],
          metrics: {}
        };
      }

      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: `Unknown code task: ${task.name}`,
        artifacts: [],
        metrics: {}
      };
    } catch (error) {
      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: error instanceof Error ? error.message : String(error),
        artifacts: [],
        metrics: {}
      };
    }
  }
};


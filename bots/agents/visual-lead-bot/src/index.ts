import { TaskDefinition, TaskResult } from "../../../../shared/types/task.js";
import { BotRegistration } from "../../../../shared/types/bot.js";
import { getAgentBridge } from "../../agent-bridge/src/index.js";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * VisualLeadBot - Specialized bot for visual design and UI/UX decisions
 */
export class VisualLeadBot {
  private bridge = getAgentBridge();

  constructor() {
    // Register bridge methods
    this.bridge.registerMethod("visual.generate-design-tokens", async (params: any) => {
      return this.generateDesignTokens(params);
    });

    this.bridge.registerMethod("visual.analyze-layout", async (params: any) => {
      return this.analyzeLayout(params);
    });
  }

  /**
   * Generate design tokens based on requirements
   */
  async generateDesignTokens(requirements: {
    style: string;
    brandColors?: string[];
    targetAudience?: string;
  }): Promise<any> {
    const prompt = `Generate design tokens (colors, typography, spacing) for a ${requirements.style} style website. 
    ${requirements.brandColors ? `Brand colors: ${requirements.brandColors.join(", ")}` : ""}
    ${requirements.targetAudience ? `Target audience: ${requirements.targetAudience}` : ""}
    
    Return JSON with: colors (primary, secondary, accent, background, foreground), typography (fontFamily, fontSize), spacing (scale).`;

    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          { role: "system", content: "Return ONLY valid JSON, no markdown, no explanations." },
          { role: "user", content: prompt }
        ],
      });

      const content = response.choices[0]?.message?.content || "{}";
      return JSON.parse(content);
    } catch (error) {
      console.error("VisualLeadBot: Error generating design tokens:", error);
      // Fallback to default tokens
      return this.getDefaultDesignTokens(requirements.style);
    }
  }

  /**
   * Analyze layout and provide recommendations
   */
  async analyzeLayout(layout: {
    components: string[];
    structure: any;
  }): Promise<any> {
    // Simple analysis for now
    return {
      score: 85,
      recommendations: [
        "Consider adding more whitespace",
        "Ensure mobile responsiveness",
        "Check color contrast ratios"
      ],
      issues: []
    };
  }

  /**
   * Get default design tokens
   */
  private getDefaultDesignTokens(style: string): any {
    if (style.includes("neon") || style.includes("cyberpunk")) {
      return {
        colors: {
          primary: "#FFD700",
          secondary: "#00CED1",
          accent: "#FF4500",
          background: "#0a0a0a",
          foreground: "#ffffff"
        },
        typography: {
          fontFamily: "Orbitron, sans-serif",
          fontSize: { base: "1rem", lg: "1.25rem", xl: "1.5rem" }
        },
        spacing: { xs: "0.5rem", sm: "1rem", md: "1.5rem", lg: "2rem", xl: "3rem" }
      };
    }

    return {
      colors: {
        primary: "#007bff",
        secondary: "#6c757d",
        accent: "#28a745",
        background: "#ffffff",
        foreground: "#000000"
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        fontSize: { base: "1rem", lg: "1.125rem", xl: "1.25rem" }
      },
      spacing: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem" }
    };
  }
}

export const VisualLeadBotRegistration: BotRegistration = {
  name: "VisualLeadBot",
  accepts: ["visual.generate-design-tokens", "visual.analyze-layout", "visual.review-ui"],
  concurrency: 2,
  async handler(task: TaskDefinition): Promise<TaskResult> {
    const bot = new VisualLeadBot();

    try {
      if (task.name === "visual.generate-design-tokens") {
        const params = task.inputsRef ? JSON.parse(task.inputsRef as string) : {};
        const tokens = await bot.generateDesignTokens(params);

        return {
          id: task.id,
          status: "success",
          attempts: 1,
          artifacts: [JSON.stringify(tokens)],
          metrics: { tokensOut: 200 }
        };
      }

      if (task.name === "visual.analyze-layout") {
        const params = task.inputsRef ? JSON.parse(task.inputsRef as string) : {};
        const analysis = await bot.analyzeLayout(params);

        return {
          id: task.id,
          status: "success",
          attempts: 1,
          artifacts: [JSON.stringify(analysis)],
          metrics: {}
        };
      }

      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: `Unknown visual task: ${task.name}`,
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


import { TaskDefinition, TaskResult } from "../../../../shared/types/task.js";
import { BotRegistration } from "../../../../shared/types/bot.js";
import { getAgentBridge } from "../../agent-bridge/src/index.js";
import OpenAI from "openai";
import crypto from "crypto";
import fs from "fs-extra";
import path from "path";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const CACHE_DIR = path.join(".ffdh", "cache", "llm");

/**
 * CopywriterBot - Specialized bot for content generation and copywriting
 */
export class CopywriterBot {
  private bridge = getAgentBridge();

  constructor() {
    // Register bridge methods
    this.bridge.registerMethod("copy.generate-content", async (params: any) => {
      return this.generateContent(params);
    });

    this.bridge.registerMethod("copy.optimize-seo", async (params: any) => {
      return this.optimizeSEO(params);
    });
  }

  /**
   * Generate content with caching
   */
  async generateContent(request: {
    type: string;
    topic: string;
    tone?: string;
    length?: number;
    language?: string;
  }): Promise<string> {
    const prompt = this.buildPrompt(request);
    const cacheKey = this.hashPrompt(prompt);

    // Check cache
    const cached = await this.getCached(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: `You are a professional copywriter. Write in ${request.language || "Polish"}.` },
          { role: "user", content: prompt }
        ],
      });

      const content = response.choices[0]?.message?.content || "";
      
      // Cache result
      await this.setCached(cacheKey, content);
      
      return content;
    } catch (error) {
      console.error("CopywriterBot: Error generating content:", error);
      throw error;
    }
  }

  /**
   * Optimize content for SEO
   */
  async optimizeSEO(content: {
    text: string;
    keywords: string[];
  }): Promise<any> {
    const prompt = `Optimize the following content for SEO. Focus on keywords: ${content.keywords.join(", ")}.
    
    Content:
    ${content.text}
    
    Return optimized content with SEO improvements.`;

    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          { role: "system", content: "You are an SEO expert. Return optimized content." },
          { role: "user", content: prompt }
        ],
      });

      return {
        optimized: response.choices[0]?.message?.content || content.text,
        keywords: content.keywords,
        suggestions: []
      };
    } catch (error) {
      console.error("CopywriterBot: Error optimizing SEO:", error);
      return {
        optimized: content.text,
        keywords: content.keywords,
        suggestions: []
      };
    }
  }

  /**
   * Build prompt from request
   */
  private buildPrompt(request: {
    type: string;
    topic: string;
    tone?: string;
    length?: number;
    language?: string;
  }): string {
    return `Write ${request.type} about "${request.topic}".
    ${request.tone ? `Tone: ${request.tone}` : ""}
    ${request.length ? `Length: ${request.length} words` : "Length: appropriate"}
    Language: ${request.language || "Polish"}`;
  }

  /**
   * Hash prompt for caching
   */
  private hashPrompt(prompt: string): string {
    return crypto.createHash("sha256").update(prompt).digest("hex");
  }

  /**
   * Get cached content
   */
  private async getCached(key: string): Promise<string | null> {
    try {
      const cacheFile = path.join(CACHE_DIR, `${key}.txt`);
      if (await fs.pathExists(cacheFile)) {
        return await fs.readFile(cacheFile, "utf8");
      }
    } catch (error) {
      // Ignore cache errors
    }
    return null;
  }

  /**
   * Set cached content
   */
  private async setCached(key: string, content: string): Promise<void> {
    try {
      await fs.ensureDir(CACHE_DIR);
      const cacheFile = path.join(CACHE_DIR, `${key}.txt`);
      await fs.writeFile(cacheFile, content, "utf8");
    } catch (error) {
      // Ignore cache errors
    }
  }
}

export const CopywriterBotRegistration: BotRegistration = {
  name: "CopywriterBot",
  accepts: ["copy.generate-content", "copy.optimize-seo", "copy.generate-headlines"],
  concurrency: 2,
  async handler(task: TaskDefinition): Promise<TaskResult> {
    const bot = new CopywriterBot();

    try {
      if (task.name === "copy.generate-content") {
        const params = task.inputsRef ? JSON.parse(task.inputsRef as string) : {};
        const content = await bot.generateContent(params);

        return {
          id: task.id,
          status: "success",
          attempts: 1,
          artifacts: [content],
          metrics: { tokensOut: content.length }
        };
      }

      if (task.name === "copy.optimize-seo") {
        const params = task.inputsRef ? JSON.parse(task.inputsRef as string) : {};
        const optimized = await bot.optimizeSEO(params);

        return {
          id: task.id,
          status: "success",
          attempts: 1,
          artifacts: [JSON.stringify(optimized)],
          metrics: { tokensOut: 300 }
        };
      }

      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: `Unknown copy task: ${task.name}`,
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


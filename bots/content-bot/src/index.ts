import fs from "fs-extra";
import path from "path";
import crypto from "crypto";
import OpenAI from "openai";
import { TaskDefinition, TaskResult } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";

const CACHE_DIR = path.join(".ffdh", "cache", "llm");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function hashPrompt(p: string) {
  return crypto.createHash("sha256").update(p).digest("hex");
}

async function cached(prompt: string, fn: () => Promise<string>) {
  await fs.ensureDir(CACHE_DIR);
  const k = path.join(CACHE_DIR, `${hashPrompt(prompt)}.json`);
  if (await fs.pathExists(k)) return await fs.readFile(k, "utf8");
  const out = await fn();
  await fs.writeFile(k, out, "utf8");
  return out;
}

export const ContentBot: BotRegistration = {
  name: "ContentBot",
  accepts: ["cms.seed.content"],
  concurrency: 2,
  async handler(task: TaskDefinition): Promise<TaskResult> {
    try {
      console.log('ContentBot: Starting content generation...');

      const prompt = `You are a content writer. Generate JSON seed for "lookbook" entries (title, excerpt, tags). Use Polish. 3 items. Return ONLY minified JSON array of objects with: title, excerpt, tags.`;

      console.log('ContentBot: Calling OpenAI API...');

      const output = await cached(prompt, async () => {
        const rsp = await client.chat.completions.create({
          model: "gpt-4o-mini",
          temperature: 0.3,
          messages: [
            { role: "system", content: "Return ONLY minified JSON array." },
            { role: "user", content: prompt }
          ]
        });
        return rsp.choices[0]?.message?.content ?? "[]";
      });

      console.log('ContentBot: API response received, length:', output.length);

      // Znajdź root repo (gdzie jest pnpm-workspace.yaml)
      let repoRoot = process.cwd();
      while (repoRoot && !fs.existsSync(path.join(repoRoot, 'pnpm-workspace.yaml'))) {
        const parent = path.dirname(repoRoot);
        if (parent === repoRoot) break; // root filesystem
        repoRoot = parent;
      }

      const outFile = path.join(repoRoot, "bots", "content-bot", "out", "seed-lookbook.json");
      await fs.ensureDir(path.dirname(outFile));
      await fs.writeFile(outFile, output, "utf8");

      console.log('ContentBot: File written to:', outFile);

      return {
        id: task.id,
        status: "success",
        attempts: 1,
        artifacts: [outFile],
        metrics: { tokensOut: output.length, cacheHit: false }
      };
    } catch (error) {
      console.error('ContentBot: Error:', error);
      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        artifacts: [],
        errorMsg: error instanceof Error ? error.message : String(error),
        metrics: {}
      };
    }
  }
};

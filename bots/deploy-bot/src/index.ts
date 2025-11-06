import { execa } from "execa";
import { TaskDefinition, TaskResult } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";

export const DeployBot: BotRegistration = {
  name: "DeployBot",
  accepts: ["deploy.vercel"],
  concurrency: 1,
  async handler(task: TaskDefinition): Promise<TaskResult> {
    // Warunkowo: deploy tylko, jeśli są zmienne środowiskowe Vercel
    if (!process.env.VERCEL_TOKEN || !process.env.VERCEL_ORG_ID || !process.env.VERCEL_PROJECT_ID) {
      return {
        id: task.id,
        status: "success",
        attempts: 1,
        artifacts: [],
        metrics: {},
        errorMsg: "Deploy skipped: missing Vercel env"
      };
    }

    try {
      await execa("pnpm", ["-C", "apps/web", "build"], { stdio: "inherit" });
      const { stdout } = await execa("npx", ["vercel", "--token", process.env.VERCEL_TOKEN!, "--confirm", "--prod"], { stdio: "pipe" });
      return {
        id: task.id,
        status: "success",
        attempts: 1,
        artifacts: ["vercel:prod"],
        metrics: {}
      };
    } catch (e: any) {
      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        artifacts: [],
        metrics: {},
        errorMsg: e?.message ?? String(e)
      };
    }
  }
};

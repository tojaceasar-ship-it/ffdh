import { TaskDefinition, TaskResult } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";
import { generateLookbookPage } from "./handlers/generate-lookbook.js";

export const CodeBot: BotRegistration = {
  name: "CodeBot",
  accepts: ["page.generate.lookbook"],
  concurrency: 2,
  async handler(task: TaskDefinition): Promise<TaskResult> {
    // opcjonalnie: dopasuj po inputsRef, waliduj schemat
    const files = await generateLookbookPage();
    return {
      id: task.id,
      status: "success",
      attempts: 1,
      artifacts: files,
      metrics: {}
    };
  }
};


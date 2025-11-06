import { TaskDefinition, TaskResult } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";

// Rejestr botów – prosty katalog w pamięci
const registry = new Map<string, BotRegistration>();

export function registerBot(bot: BotRegistration) {
  registry.set(bot.name, bot);
}

export function getBotForTask(task: TaskDefinition): BotRegistration | null {
  // dopasowanie po nazwie „task.name” do listy accepts
  for (const bot of registry.values()) {
    if (bot.accepts.includes(task.name)) return bot;
  }
  return null;
}

export async function executeTask(task: TaskDefinition): Promise<TaskResult> {
  const bot = getBotForTask(task);
  if (!bot) {
    return {
      id: task.id,
      status: "fail",
      attempts: 1,
      errorCode: "BOT_NOT_FOUND",
      errorMsg: `No bot found for task: ${task.name}`,
      artifacts: [],
      metrics: {}
    };
  }
  return bot.handler(task);
}


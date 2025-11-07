import { TaskDefinition, TaskResult } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";
export declare function registerBot(bot: BotRegistration): void;
export declare function getBotForTask(task: TaskDefinition): BotRegistration | null;
export declare function executeTask(task: TaskDefinition): Promise<TaskResult>;
//# sourceMappingURL=bot-manager.d.ts.map
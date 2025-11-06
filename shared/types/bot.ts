import { z } from "zod";
import { TaskDefinition, TaskResult } from "./task";

export const BotTaskHandler = z.function()
  .args(z.object({
    task: z.any(),           // konkretny typ opisany w inputsRef
    idempotencyKey: z.string()
  }))
  .returns(z.promise(z.object({
    status: z.enum(["success", "fail"]),
    artifacts: z.array(z.string()).default([]),
    errorMsg: z.string().optional()
  })));

export type BotTaskHandler = z.infer<typeof BotTaskHandler>;

export interface BotRegistration {
  name: string;
  accepts: string[];         // np. ["page.generate.lookbook"]
  concurrency: number;       // max równoległych zadań dla tego bota
  handler(task: TaskDefinition): Promise<TaskResult>;
}


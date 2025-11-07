import { z } from "zod";
import { TaskDefinition, TaskResult } from "./task";
export declare const BotTaskHandler: z.ZodFunction<z.ZodTuple<[z.ZodObject<{
    task: z.ZodAny;
    idempotencyKey: z.ZodString;
}, "strip", z.ZodTypeAny, {
    idempotencyKey: string;
    task?: any;
}, {
    idempotencyKey: string;
    task?: any;
}>], z.ZodUnknown>, z.ZodPromise<z.ZodObject<{
    status: z.ZodEnum<["success", "fail"]>;
    artifacts: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    errorMsg: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "success" | "fail";
    artifacts: string[];
    errorMsg?: string | undefined;
}, {
    status: "success" | "fail";
    errorMsg?: string | undefined;
    artifacts?: string[] | undefined;
}>>>;
export type BotTaskHandler = z.infer<typeof BotTaskHandler>;
export interface BotRegistration {
    name: string;
    accepts: string[];
    concurrency: number;
    handler(task: TaskDefinition): Promise<TaskResult>;
}
//# sourceMappingURL=bot.d.ts.map
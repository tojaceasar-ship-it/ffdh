import { z } from "zod";

export const TaskDefinitionSchema = z.object({
  id: z.string(),
  version: z.string(),
  name: z.string(),
  priority: z.enum(["high", "normal", "low"]).default("normal"),
  concurrencyClass: z.enum(["cpu", "io", "llm"]),
  idempotencyKey: z.string(),
  inputsRef: z.string().optional(),
  timeoutMs: z.number().int().positive().default(900000),
});

export type TaskDefinition = z.infer<typeof TaskDefinitionSchema>;
export const TaskDefinition = TaskDefinitionSchema;

export const TaskResultSchema = z.object({
  id: z.string(),
  status: z.enum(["queued", "running", "success", "fail", "canceled"]),
  startedAt: z.string().datetime().optional(),
  endedAt: z.string().datetime().optional(),
  attempts: z.number().int().nonnegative().default(0),
  errorCode: z.string().optional(),
  errorMsg: z.string().optional(),
  artifacts: z.array(z.string()).default([]),
  metrics: z
    .object({
      durationMs: z.number().int().nonnegative().optional(),
      retries: z.number().int().nonnegative().optional(),
      tokensIn: z.number().int().nonnegative().optional(),
      tokensOut: z.number().int().nonnegative().optional(),
      cacheHit: z.boolean().optional(),
    })
    .partial(),
});

export type TaskResult = z.infer<typeof TaskResultSchema>;
export const TaskResult = TaskResultSchema;

export const BotCapabilities = z.object({
  name: z.string(),
  accepts: z.array(z.string()),
  produces: z.array(z.string()),
  maxConcurrency: z.number().int().positive().default(1),
});

export type BotCapabilities = z.infer<typeof BotCapabilities>;


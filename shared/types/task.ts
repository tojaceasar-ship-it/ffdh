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
  // Smart Build extensions
  dependsOn: z.array(z.string()).default([]), // DAG dependencies
  estimatedTokens: z.number().int().positive().default(512),
  fallbackRules: z.array(z.string()).optional(), // ["rule:generate-navbar"]
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
      // Smart Build extensions
      fallbackUsed: z.boolean().optional(),
      ruleApplied: z.string().optional(),
      humanReviewRequired: z.boolean().optional(),
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

// Smart Build Mode types
export const ProjectDescription = z.object({
  title: z.string(),
  description: z.string(),
  requirements: z.array(z.string()).optional(),
  style: z.string().optional(),
  targetAudience: z.string().optional(),
});

export type ProjectDescription = z.infer<typeof ProjectDescription>;

export const ClarificationQuestion = z.object({
  question: z.string(),
  field: z.string(),
  required: z.boolean().default(false),
});

export type ClarificationQuestion = z.infer<typeof ClarificationQuestion>;

export const DAGPlan = z.object({
  tasks: z.array(TaskDefinitionSchema),
  estimatedTokens: z.number().int().positive(),
  humanIterations: z.number().int().nonnegative().default(0),
});

export type DAGPlan = z.infer<typeof DAGPlan>;

export const ReviewDecision = z.object({
  decision: z.enum(["accept", "changes"]),
  comments: z.string().optional(),
  requestedChanges: z.array(z.string()).optional(),
});

export type ReviewDecision = z.infer<typeof ReviewDecision>;

export const SessionSummary = z.object({
  sessionId: z.string(),
  timestamp: z.string().datetime(),
  totalTokens: z.number().int().nonnegative(),
  cacheHitRate: z.number().min(0).max(1),
  fallbackUsage: z.number().min(0).max(1),
  humanIterations: z.number().int().nonnegative(),
  finalDecision: z.enum(["accept", "cancelled", "timeout"]),
  tasksCompleted: z.number().int().nonnegative(),
  tasksFailed: z.number().int().nonnegative(),
  durationMs: z.number().int().nonnegative(),
});

export type SessionSummary = z.infer<typeof SessionSummary>;


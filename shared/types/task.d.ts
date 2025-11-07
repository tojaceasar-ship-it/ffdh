import { z } from "zod";
export declare const TaskDefinitionSchema: z.ZodObject<{
    id: z.ZodString;
    version: z.ZodString;
    name: z.ZodString;
    priority: z.ZodDefault<z.ZodEnum<["high", "normal", "low"]>>;
    concurrencyClass: z.ZodEnum<["cpu", "io", "llm"]>;
    idempotencyKey: z.ZodString;
    inputsRef: z.ZodOptional<z.ZodString>;
    timeoutMs: z.ZodDefault<z.ZodNumber>;
    dependsOn: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    estimatedTokens: z.ZodDefault<z.ZodNumber>;
    fallbackRules: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    version: string;
    name: string;
    priority: "high" | "normal" | "low";
    concurrencyClass: "cpu" | "io" | "llm";
    idempotencyKey: string;
    timeoutMs: number;
    dependsOn: string[];
    estimatedTokens: number;
    inputsRef?: string | undefined;
    fallbackRules?: string[] | undefined;
}, {
    id: string;
    version: string;
    name: string;
    concurrencyClass: "cpu" | "io" | "llm";
    idempotencyKey: string;
    priority?: "high" | "normal" | "low" | undefined;
    inputsRef?: string | undefined;
    timeoutMs?: number | undefined;
    dependsOn?: string[] | undefined;
    estimatedTokens?: number | undefined;
    fallbackRules?: string[] | undefined;
}>;
export type TaskDefinition = z.infer<typeof TaskDefinitionSchema>;
export declare const TaskDefinition: z.ZodObject<{
    id: z.ZodString;
    version: z.ZodString;
    name: z.ZodString;
    priority: z.ZodDefault<z.ZodEnum<["high", "normal", "low"]>>;
    concurrencyClass: z.ZodEnum<["cpu", "io", "llm"]>;
    idempotencyKey: z.ZodString;
    inputsRef: z.ZodOptional<z.ZodString>;
    timeoutMs: z.ZodDefault<z.ZodNumber>;
    dependsOn: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    estimatedTokens: z.ZodDefault<z.ZodNumber>;
    fallbackRules: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    version: string;
    name: string;
    priority: "high" | "normal" | "low";
    concurrencyClass: "cpu" | "io" | "llm";
    idempotencyKey: string;
    timeoutMs: number;
    dependsOn: string[];
    estimatedTokens: number;
    inputsRef?: string | undefined;
    fallbackRules?: string[] | undefined;
}, {
    id: string;
    version: string;
    name: string;
    concurrencyClass: "cpu" | "io" | "llm";
    idempotencyKey: string;
    priority?: "high" | "normal" | "low" | undefined;
    inputsRef?: string | undefined;
    timeoutMs?: number | undefined;
    dependsOn?: string[] | undefined;
    estimatedTokens?: number | undefined;
    fallbackRules?: string[] | undefined;
}>;
export declare const TaskResultSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<["queued", "running", "success", "fail", "canceled"]>;
    startedAt: z.ZodOptional<z.ZodString>;
    endedAt: z.ZodOptional<z.ZodString>;
    attempts: z.ZodDefault<z.ZodNumber>;
    errorCode: z.ZodOptional<z.ZodString>;
    errorMsg: z.ZodOptional<z.ZodString>;
    artifacts: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    metrics: z.ZodObject<{
        durationMs: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        retries: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        tokensIn: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        tokensOut: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        cacheHit: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        fallbackUsed: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        ruleApplied: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        humanReviewRequired: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        durationMs?: number | undefined;
        retries?: number | undefined;
        tokensIn?: number | undefined;
        tokensOut?: number | undefined;
        cacheHit?: boolean | undefined;
        fallbackUsed?: boolean | undefined;
        ruleApplied?: string | undefined;
        humanReviewRequired?: boolean | undefined;
    }, {
        durationMs?: number | undefined;
        retries?: number | undefined;
        tokensIn?: number | undefined;
        tokensOut?: number | undefined;
        cacheHit?: boolean | undefined;
        fallbackUsed?: boolean | undefined;
        ruleApplied?: string | undefined;
        humanReviewRequired?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "queued" | "running" | "success" | "fail" | "canceled";
    attempts: number;
    artifacts: string[];
    metrics: {
        durationMs?: number | undefined;
        retries?: number | undefined;
        tokensIn?: number | undefined;
        tokensOut?: number | undefined;
        cacheHit?: boolean | undefined;
        fallbackUsed?: boolean | undefined;
        ruleApplied?: string | undefined;
        humanReviewRequired?: boolean | undefined;
    };
    startedAt?: string | undefined;
    endedAt?: string | undefined;
    errorCode?: string | undefined;
    errorMsg?: string | undefined;
}, {
    id: string;
    status: "queued" | "running" | "success" | "fail" | "canceled";
    metrics: {
        durationMs?: number | undefined;
        retries?: number | undefined;
        tokensIn?: number | undefined;
        tokensOut?: number | undefined;
        cacheHit?: boolean | undefined;
        fallbackUsed?: boolean | undefined;
        ruleApplied?: string | undefined;
        humanReviewRequired?: boolean | undefined;
    };
    startedAt?: string | undefined;
    endedAt?: string | undefined;
    attempts?: number | undefined;
    errorCode?: string | undefined;
    errorMsg?: string | undefined;
    artifacts?: string[] | undefined;
}>;
export type TaskResult = z.infer<typeof TaskResultSchema>;
export declare const TaskResult: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<["queued", "running", "success", "fail", "canceled"]>;
    startedAt: z.ZodOptional<z.ZodString>;
    endedAt: z.ZodOptional<z.ZodString>;
    attempts: z.ZodDefault<z.ZodNumber>;
    errorCode: z.ZodOptional<z.ZodString>;
    errorMsg: z.ZodOptional<z.ZodString>;
    artifacts: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    metrics: z.ZodObject<{
        durationMs: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        retries: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        tokensIn: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        tokensOut: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        cacheHit: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        fallbackUsed: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        ruleApplied: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        humanReviewRequired: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        durationMs?: number | undefined;
        retries?: number | undefined;
        tokensIn?: number | undefined;
        tokensOut?: number | undefined;
        cacheHit?: boolean | undefined;
        fallbackUsed?: boolean | undefined;
        ruleApplied?: string | undefined;
        humanReviewRequired?: boolean | undefined;
    }, {
        durationMs?: number | undefined;
        retries?: number | undefined;
        tokensIn?: number | undefined;
        tokensOut?: number | undefined;
        cacheHit?: boolean | undefined;
        fallbackUsed?: boolean | undefined;
        ruleApplied?: string | undefined;
        humanReviewRequired?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "queued" | "running" | "success" | "fail" | "canceled";
    attempts: number;
    artifacts: string[];
    metrics: {
        durationMs?: number | undefined;
        retries?: number | undefined;
        tokensIn?: number | undefined;
        tokensOut?: number | undefined;
        cacheHit?: boolean | undefined;
        fallbackUsed?: boolean | undefined;
        ruleApplied?: string | undefined;
        humanReviewRequired?: boolean | undefined;
    };
    startedAt?: string | undefined;
    endedAt?: string | undefined;
    errorCode?: string | undefined;
    errorMsg?: string | undefined;
}, {
    id: string;
    status: "queued" | "running" | "success" | "fail" | "canceled";
    metrics: {
        durationMs?: number | undefined;
        retries?: number | undefined;
        tokensIn?: number | undefined;
        tokensOut?: number | undefined;
        cacheHit?: boolean | undefined;
        fallbackUsed?: boolean | undefined;
        ruleApplied?: string | undefined;
        humanReviewRequired?: boolean | undefined;
    };
    startedAt?: string | undefined;
    endedAt?: string | undefined;
    attempts?: number | undefined;
    errorCode?: string | undefined;
    errorMsg?: string | undefined;
    artifacts?: string[] | undefined;
}>;
export declare const BotCapabilities: z.ZodObject<{
    name: z.ZodString;
    accepts: z.ZodArray<z.ZodString, "many">;
    produces: z.ZodArray<z.ZodString, "many">;
    maxConcurrency: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    accepts: string[];
    produces: string[];
    maxConcurrency: number;
}, {
    name: string;
    accepts: string[];
    produces: string[];
    maxConcurrency?: number | undefined;
}>;
export type BotCapabilities = z.infer<typeof BotCapabilities>;
export declare const ProjectDescription: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    requirements: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    style: z.ZodOptional<z.ZodString>;
    targetAudience: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    requirements?: string[] | undefined;
    style?: string | undefined;
    targetAudience?: string | undefined;
}, {
    title: string;
    description: string;
    requirements?: string[] | undefined;
    style?: string | undefined;
    targetAudience?: string | undefined;
}>;
export type ProjectDescription = z.infer<typeof ProjectDescription>;
export declare const ClarificationQuestion: z.ZodObject<{
    question: z.ZodString;
    field: z.ZodString;
    required: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    question: string;
    field: string;
    required: boolean;
}, {
    question: string;
    field: string;
    required?: boolean | undefined;
}>;
export type ClarificationQuestion = z.infer<typeof ClarificationQuestion>;
export declare const DAGPlan: z.ZodObject<{
    tasks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        version: z.ZodString;
        name: z.ZodString;
        priority: z.ZodDefault<z.ZodEnum<["high", "normal", "low"]>>;
        concurrencyClass: z.ZodEnum<["cpu", "io", "llm"]>;
        idempotencyKey: z.ZodString;
        inputsRef: z.ZodOptional<z.ZodString>;
        timeoutMs: z.ZodDefault<z.ZodNumber>;
        dependsOn: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        estimatedTokens: z.ZodDefault<z.ZodNumber>;
        fallbackRules: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        version: string;
        name: string;
        priority: "high" | "normal" | "low";
        concurrencyClass: "cpu" | "io" | "llm";
        idempotencyKey: string;
        timeoutMs: number;
        dependsOn: string[];
        estimatedTokens: number;
        inputsRef?: string | undefined;
        fallbackRules?: string[] | undefined;
    }, {
        id: string;
        version: string;
        name: string;
        concurrencyClass: "cpu" | "io" | "llm";
        idempotencyKey: string;
        priority?: "high" | "normal" | "low" | undefined;
        inputsRef?: string | undefined;
        timeoutMs?: number | undefined;
        dependsOn?: string[] | undefined;
        estimatedTokens?: number | undefined;
        fallbackRules?: string[] | undefined;
    }>, "many">;
    estimatedTokens: z.ZodNumber;
    humanIterations: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    estimatedTokens: number;
    tasks: {
        id: string;
        version: string;
        name: string;
        priority: "high" | "normal" | "low";
        concurrencyClass: "cpu" | "io" | "llm";
        idempotencyKey: string;
        timeoutMs: number;
        dependsOn: string[];
        estimatedTokens: number;
        inputsRef?: string | undefined;
        fallbackRules?: string[] | undefined;
    }[];
    humanIterations: number;
}, {
    estimatedTokens: number;
    tasks: {
        id: string;
        version: string;
        name: string;
        concurrencyClass: "cpu" | "io" | "llm";
        idempotencyKey: string;
        priority?: "high" | "normal" | "low" | undefined;
        inputsRef?: string | undefined;
        timeoutMs?: number | undefined;
        dependsOn?: string[] | undefined;
        estimatedTokens?: number | undefined;
        fallbackRules?: string[] | undefined;
    }[];
    humanIterations?: number | undefined;
}>;
export type DAGPlan = z.infer<typeof DAGPlan>;
export declare const ReviewDecision: z.ZodObject<{
    decision: z.ZodEnum<["accept", "changes"]>;
    comments: z.ZodOptional<z.ZodString>;
    requestedChanges: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    decision: "accept" | "changes";
    comments?: string | undefined;
    requestedChanges?: string[] | undefined;
}, {
    decision: "accept" | "changes";
    comments?: string | undefined;
    requestedChanges?: string[] | undefined;
}>;
export type ReviewDecision = z.infer<typeof ReviewDecision>;
export declare const SessionSummary: z.ZodObject<{
    sessionId: z.ZodString;
    timestamp: z.ZodString;
    totalTokens: z.ZodNumber;
    cacheHitRate: z.ZodNumber;
    fallbackUsage: z.ZodNumber;
    humanIterations: z.ZodNumber;
    finalDecision: z.ZodEnum<["accept", "cancelled", "timeout"]>;
    tasksCompleted: z.ZodNumber;
    tasksFailed: z.ZodNumber;
    durationMs: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    durationMs: number;
    humanIterations: number;
    sessionId: string;
    timestamp: string;
    totalTokens: number;
    cacheHitRate: number;
    fallbackUsage: number;
    finalDecision: "accept" | "cancelled" | "timeout";
    tasksCompleted: number;
    tasksFailed: number;
}, {
    durationMs: number;
    humanIterations: number;
    sessionId: string;
    timestamp: string;
    totalTokens: number;
    cacheHitRate: number;
    fallbackUsage: number;
    finalDecision: "accept" | "cancelled" | "timeout";
    tasksCompleted: number;
    tasksFailed: number;
}>;
export type SessionSummary = z.infer<typeof SessionSummary>;
//# sourceMappingURL=task.d.ts.map
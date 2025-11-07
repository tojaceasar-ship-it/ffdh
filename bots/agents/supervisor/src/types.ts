import { TaskDefinition, TaskResult } from "../../../../shared/types/task.js";
import { BotRegistration } from "../../../../shared/types/bot.js";

/**
 * Strategy types for task execution
 */
export type ExecutionStrategy = 
  | "parallel"      // Execute all ready tasks in parallel
  | "sequential"    // Execute one task at a time
  | "batch"         // Execute in batches
  | "priority-first"; // Execute by priority order

/**
 * Task analysis result
 */
export interface TaskAnalysis {
  task: TaskDefinition;
  dependencies: TaskDefinition[];
  estimatedDuration: number;
  riskLevel: "low" | "medium" | "high";
  canExecute: boolean;
}

/**
 * Planning result
 */
export interface PlanningResult {
  tasks: TaskDefinition[];
  executionOrder: string[]; // Task IDs in execution order
  strategy: ExecutionStrategy;
  estimatedTotalDuration: number;
  riskAssessment: {
    highRiskTasks: string[];
    blockingTasks: string[];
  };
}

/**
 * Decision context for task assignment
 */
export interface DecisionContext {
  availableBots: BotRegistration[];
  runningTasks: Map<string, TaskResult>;
  resourceUsage: {
    cpu: number;
    io: number;
    llm: number;
  };
  budgetRemaining: number;
}

/**
 * Assignment decision
 */
export interface AssignmentDecision {
  taskId: string;
  botName: string | null;
  reason: string;
  estimatedStartTime: number;
}


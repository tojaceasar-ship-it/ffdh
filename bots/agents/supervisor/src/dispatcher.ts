import { TaskDefinition, TaskResult } from "../../../../shared/types/task.js";
import { BotRegistration } from "../../../../shared/types/bot.js";
import { DecisionContext, AssignmentDecision } from "./types.js";
import { getBotForTask } from "../../../orchestrator/src/bot-manager.js";
import os from "os";

/**
 * Dispatcher - assigns tasks to bots based on context
 */
export class Dispatcher {
  /**
   * Decide which bot should handle a task
   */
  decideAssignment(task: TaskDefinition, context: DecisionContext): AssignmentDecision {
    const bot = getBotForTask(task);
    
    if (!bot) {
      return {
        taskId: task.id,
        botName: null,
        reason: `No bot available for task: ${task.name}`,
        estimatedStartTime: Date.now() + 60000 // 1 minute delay
      };
    }

    // Check if bot is available (not at max concurrency)
    const botRunningTasks = Array.from(context.runningTasks.values())
      .filter(r => r.status === "running")
      .length;

    const canExecuteNow = botRunningTasks < bot.concurrency;

    // Check resource availability
    const resourceAvailable = this.checkResourceAvailability(task, context);

    const estimatedStartTime = canExecuteNow && resourceAvailable
      ? Date.now()
      : Date.now() + this.estimateWaitTime(task, context);

    return {
      taskId: task.id,
      botName: bot.name,
      reason: canExecuteNow && resourceAvailable
        ? `Bot ${bot.name} available, resources sufficient`
        : `Bot ${bot.name} available, but waiting for resources`,
      estimatedStartTime
    };
  }

  /**
   * Check if resources are available for task
   */
  private checkResourceAvailability(task: TaskDefinition, context: DecisionContext): boolean {
    const { resourceUsage, budgetRemaining } = context;

    // Check concurrency limits
    const maxConcurrency = this.getMaxConcurrency(task.concurrencyClass);
    const currentUsage = resourceUsage[task.concurrencyClass];
    
    if (currentUsage >= maxConcurrency) {
      return false;
    }

    // Check budget for LLM tasks
    if (task.concurrencyClass === "llm") {
      const estimatedCost = task.estimatedTokens || 512;
      if (budgetRemaining < estimatedCost) {
        return false;
      }
    }

    return true;
  }

  /**
   * Estimate wait time before task can start
   */
  private estimateWaitTime(task: TaskDefinition, context: DecisionContext): number {
    const { resourceUsage } = context;
    const maxConcurrency = this.getMaxConcurrency(task.concurrencyClass);
    const currentUsage = resourceUsage[task.concurrencyClass];

    if (currentUsage >= maxConcurrency) {
      // Estimate based on average task duration
      return 30000; // 30 seconds average
    }

    return 0;
  }

  /**
   * Get max concurrency for concurrency class
   */
  private getMaxConcurrency(concurrencyClass: "cpu" | "io" | "llm"): number {
    const cpuCount = os.cpus().length;
    
    if (concurrencyClass === "cpu") {
      return Math.max(cpuCount - 2, 1);
    }
    return 2 * Math.max(cpuCount - 2, 1);
  }
}


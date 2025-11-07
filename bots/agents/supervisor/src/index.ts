import { TaskDefinition, TaskResult, DAGPlan } from "../../../../shared/types/task.js";
import { BotRegistration } from "../../../../shared/types/bot.js";
import { PlanningResult, DecisionContext } from "./types.js";
import { Planner } from "./planner.js";
import { Dispatcher } from "./dispatcher.js";
import { DecisionEngine } from "./decision-engine.js";
import { getBotForTask, registerBot } from "../../../orchestrator/src/bot-manager.js";
import { taskQueue } from "../../../orchestrator/src/task-queue.js";
import { executeTask } from "../../../orchestrator/src/bot-manager.js";

/**
 * SupervisorAgent - Central decision-making and task dispatcher
 * 
 * Responsibilities:
 * - Analyze incoming tasks and create execution plans
 * - Decide which bot should handle each task
 * - Monitor execution and adjust strategy
 * - Handle failures and retries
 */
export class SupervisorAgent {
  private planner: Planner;
  private dispatcher: Dispatcher;
  private decisionEngine: DecisionEngine;
  private runningTasks: Map<string, TaskResult> = new Map();
  private sessionId: string;

  constructor(sessionId?: string) {
    this.sessionId = sessionId || `supervisor-${Date.now()}`;
    this.planner = new Planner();
    this.dispatcher = new Dispatcher();
    this.decisionEngine = new DecisionEngine();
  }

  /**
   * Plan execution for a DAG
   */
  async plan(dagPlan: DAGPlan): Promise<PlanningResult> {
    return this.planner.createPlan(dagPlan);
  }

  /**
   * Execute plan with supervision
   */
  async executePlan(plan: PlanningResult, budgetRemaining: number = 6000): Promise<TaskResult[]> {
    const results: TaskResult[] = [];
    const completed = new Set<string>();

    // Build context
    const context: DecisionContext = {
      availableBots: this.getAvailableBots(),
      runningTasks: this.runningTasks,
      resourceUsage: this.getResourceUsage(),
      budgetRemaining
    };

    // Get execution order
    const executionOrder = plan.executionOrder;

    // Execute based on strategy
    switch (plan.strategy) {
      case "parallel":
        return this.executeParallel(executionOrder, plan.tasks, context);
      
      case "sequential":
        return this.executeSequential(executionOrder, plan.tasks, context);
      
      case "batch":
        return this.executeBatch(executionOrder, plan.tasks, context, 3);
      
      case "priority-first":
        return this.executePriorityFirst(executionOrder, plan.tasks, context);
      
      default:
        return this.executeSequential(executionOrder, plan.tasks, context);
    }
  }

  /**
   * Execute tasks in parallel
   */
  private async executeParallel(
    order: string[],
    tasks: TaskDefinition[],
    context: DecisionContext
  ): Promise<TaskResult[]> {
    const results: TaskResult[] = [];
    const taskMap = new Map(tasks.map(t => [t.id, t]));

    // Find ready tasks (all dependencies completed)
    const readyTasks = order.filter(id => {
      const task = taskMap.get(id)!;
      return task.dependsOn.every(depId => 
        results.some(r => r.id === depId && r.status === "success")
      );
    });

    // Execute all ready tasks in parallel
    const promises = readyTasks.map(id => {
      const task = taskMap.get(id)!;
      return this.executeSingleTask(task);
    });

    const batchResults = await Promise.allSettled(promises);
    results.push(...batchResults.map(r => 
      r.status === "fulfilled" ? r.value : {
        id: "unknown",
        status: "fail" as const,
        attempts: 1,
        errorMsg: r.reason?.message || "Unknown error",
        artifacts: [],
        metrics: {}
      }
    ));

    return results;
  }

  /**
   * Execute tasks sequentially
   */
  private async executeSequential(
    order: string[],
    tasks: TaskDefinition[],
    context: DecisionContext
  ): Promise<TaskResult[]> {
    const results: TaskResult[] = [];
    const taskMap = new Map(tasks.map(t => [t.id, t]));

    for (const id of order) {
      const task = taskMap.get(id)!;
      
      // Check dependencies
      const depsSatisfied = task.dependsOn.every(depId =>
        results.some(r => r.id === depId && r.status === "success")
      );

      if (!depsSatisfied) {
        results.push({
          id: task.id,
          status: "fail",
          attempts: 1,
          errorMsg: "Dependencies not satisfied",
          artifacts: [],
          metrics: {}
        });
        continue;
      }

      const result = await this.executeSingleTask(task);
      results.push(result);

      // Stop on failure if critical
      if (result.status === "fail" && task.priority === "high") {
        break;
      }
    }

    return results;
  }

  /**
   * Execute tasks in batches
   */
  private async executeBatch(
    order: string[],
    tasks: TaskDefinition[],
    context: DecisionContext,
    batchSize: number
  ): Promise<TaskResult[]> {
    const results: TaskResult[] = [];
    const taskMap = new Map(tasks.map(t => [t.id, t]));

    for (let i = 0; i < order.length; i += batchSize) {
      const batch = order.slice(i, i + batchSize);
      
      const batchPromises = batch.map(id => {
        const task = taskMap.get(id)!;
        return this.executeSingleTask(task);
      });

      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults.map(r =>
        r.status === "fulfilled" ? r.value : {
          id: "unknown",
          status: "fail" as const,
          attempts: 1,
          errorMsg: r.reason?.message || "Unknown error",
          artifacts: [],
          metrics: {}
        }
      ));
    }

    return results;
  }

  /**
   * Execute tasks by priority
   */
  private async executePriorityFirst(
    order: string[],
    tasks: TaskDefinition[],
    context: DecisionContext
  ): Promise<TaskResult[]> {
    // Sort by priority
    const sortedTasks = [...tasks].sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return this.executeSequential(
      sortedTasks.map(t => t.id),
      sortedTasks,
      context
    );
  }

  /**
   * Execute a single task
   */
  private async executeSingleTask(task: TaskDefinition): Promise<TaskResult> {
    this.runningTasks.set(task.id, {
      id: task.id,
      status: "running",
      startedAt: new Date().toISOString(),
      attempts: 0,
      artifacts: [],
      metrics: {}
    });

    try {
      const result = await taskQueue.enqueue(task, async (t) => {
        return await executeTask(t);
      });

      this.runningTasks.set(task.id, result);
      return result;
    } catch (error) {
      const failResult: TaskResult = {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: error instanceof Error ? error.message : String(error),
        artifacts: [],
        metrics: {}
      };
      this.runningTasks.set(task.id, failResult);
      return failResult;
    }
  }

  /**
   * Get available bots
   */
  private getAvailableBots(): BotRegistration[] {
    // This would ideally come from bot-manager registry
    // For now, return empty array - will be populated by actual bot registrations
    return [];
  }

  /**
   * Get current resource usage
   */
  private getResourceUsage(): { cpu: number; io: number; llm: number } {
    const running = Array.from(this.runningTasks.values())
      .filter(r => r.status === "running");

    return {
      cpu: running.filter(r => {
        // Would need to track concurrency class per task
        return true; // Simplified
      }).length,
      io: 0,
      llm: 0
    };
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Get running tasks snapshot
   */
  getRunningTasks(): Map<string, TaskResult> {
    return new Map(this.runningTasks);
  }
}

/**
 * Export SupervisorAgent registration (for integration with orchestrator)
 */
export const SupervisorAgentRegistration: BotRegistration = {
  name: "SupervisorAgent",
  accepts: ["supervisor.plan", "supervisor.execute"],
  concurrency: 1,
  async handler(task: TaskDefinition): Promise<TaskResult> {
    const supervisor = new SupervisorAgent();

    if (task.name === "supervisor.plan") {
      if (!task.inputsRef) {
        return {
          id: task.id,
          status: "fail",
          attempts: 1,
          errorMsg: "No DAG plan provided",
          artifacts: [],
          metrics: {}
        };
      }

      // Plan execution
      const dagPlan = typeof task.inputsRef === 'string'
        ? JSON.parse(task.inputsRef)
        : (task.inputsRef as DAGPlan);
      
      const plan = await supervisor.plan(dagPlan);

      return {
        id: task.id,
        status: "success",
        attempts: 1,
        artifacts: [JSON.stringify(plan)],
        metrics: {}
      };
    }

    if (task.name === "supervisor.execute") {
      if (!task.inputsRef) {
        return {
          id: task.id,
          status: "fail",
          attempts: 1,
          errorMsg: "No plan provided",
          artifacts: [],
          metrics: {}
        };
      }

      // Execute plan
      const input = typeof task.inputsRef === 'string'
        ? JSON.parse(task.inputsRef)
        : (task.inputsRef as { plan: PlanningResult; budgetRemaining: number });
      
      const results = await supervisor.executePlan(input.plan, input.budgetRemaining);

      return {
        id: task.id,
        status: "success",
        attempts: 1,
        artifacts: results.map(r => JSON.stringify(r)),
        metrics: {
          tokensOut: results.reduce((sum, r) => sum + (r.metrics?.tokensOut || 0), 0)
        }
      };
    }

    return {
      id: task.id,
      status: "fail",
      attempts: 1,
      errorMsg: `Unknown supervisor task: ${task.name}`,
      artifacts: [],
      metrics: {}
    };
  }
};


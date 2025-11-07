import { TaskDefinition, TaskResult } from "../../../../shared/types/task.js";
import { BotRegistration } from "../../../../shared/types/bot.js";
import { DecisionContext, ExecutionStrategy } from "./types.js";
import { Planner } from "./planner.js";
import { Dispatcher } from "./dispatcher.js";

/**
 * Decision Engine - selects optimal execution strategy
 */
export class DecisionEngine {
  private planner: Planner;
  private dispatcher: Dispatcher;

  constructor() {
    this.planner = new Planner();
    this.dispatcher = new Dispatcher();
  }

  /**
   * Make decision about task execution
   */
  makeDecision(
    tasks: TaskDefinition[],
    context: DecisionContext
  ): {
    strategy: ExecutionStrategy;
    assignments: Array<{ task: TaskDefinition; decision: any }>;
    reasoning: string;
  } {
    // Analyze tasks
    const analyses = tasks.map(task => this.planner.analyzeTask(task, tasks));

    // Determine strategy
    const strategy = this.selectStrategy(analyses, context);

    // Make assignments
    const assignments = tasks.map(task => ({
      task,
      decision: this.dispatcher.decideAssignment(task, context)
    }));

    // Generate reasoning
    const reasoning = this.generateReasoning(strategy, assignments, context);

    return {
      strategy,
      assignments,
      reasoning
    };
  }

  /**
   * Select optimal strategy
   */
  private selectStrategy(
    analyses: any[],
    context: DecisionContext
  ): ExecutionStrategy {
    const { resourceUsage, budgetRemaining } = context;

    // If low resources, use sequential
    if (resourceUsage.cpu >= 0.8 || resourceUsage.io >= 0.8) {
      return "sequential";
    }

    // If low budget, use priority-first
    if (budgetRemaining < 1000) {
      return "priority-first";
    }

    // If many tasks, use batch
    if (analyses.length > 5) {
      return "batch";
    }

    // Default to parallel
    return "parallel";
  }

  /**
   * Generate human-readable reasoning
   */
  private generateReasoning(
    strategy: ExecutionStrategy,
    assignments: Array<{ task: TaskDefinition; decision: any }>,
    context: DecisionContext
  ): string {
    const availableBots = context.availableBots.length;
    const runningTasks = Array.from(context.runningTasks.values())
      .filter(r => r.status === "running").length;

    return `Strategy: ${strategy}. ` +
      `Available bots: ${availableBots}. ` +
      `Running tasks: ${runningTasks}. ` +
      `Budget remaining: ${context.budgetRemaining} tokens. ` +
      `Tasks ready: ${assignments.filter(a => a.decision.botName !== null).length}/${assignments.length}.`;
  }
}


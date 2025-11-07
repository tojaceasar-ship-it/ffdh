import { TaskDefinition, DAGPlan } from "../../../../shared/types/task.js";
import { TaskAnalysis, PlanningResult, ExecutionStrategy } from "./types.js";
import { getBotForTask } from "../../../orchestrator/src/bot-manager.js";

/**
 * Planner module - analyzes tasks and creates execution plans
 */
export class Planner {
  /**
   * Analyze a single task
   */
  analyzeTask(task: TaskDefinition, allTasks: TaskDefinition[]): TaskAnalysis {
    // Find dependencies
    const dependencies = allTasks.filter(t => task.dependsOn.includes(t.id));

    // Check if dependencies are satisfied
    const canExecute = dependencies.length === task.dependsOn.length;

    // Estimate duration based on concurrency class
    const estimatedDuration = this.estimateDuration(task);

    // Assess risk level
    const riskLevel = this.assessRisk(task, dependencies);

    return {
      task,
      dependencies,
      estimatedDuration,
      riskLevel,
      canExecute
    };
  }

  /**
   * Create execution plan from DAG
   */
  createPlan(dagPlan: DAGPlan): PlanningResult {
    const { tasks } = dagPlan;
    
    // Analyze all tasks
    const analyses = tasks.map(task => this.analyzeTask(task, tasks));

    // Build execution order (topological sort)
    const executionOrder = this.topologicalSort(tasks);

    // Determine strategy
    const strategy = this.determineStrategy(analyses);

    // Calculate total duration
    const estimatedTotalDuration = this.estimateTotalDuration(analyses, strategy);

    // Risk assessment
    const highRiskTasks = analyses
      .filter(a => a.riskLevel === "high")
      .map(a => a.task.id);
    
    const blockingTasks = analyses
      .filter(a => !a.canExecute && a.dependencies.length > 0)
      .map(a => a.task.id);

    return {
      tasks,
      executionOrder,
      strategy,
      estimatedTotalDuration,
      riskAssessment: {
        highRiskTasks,
        blockingTasks
      }
    };
  }

  /**
   * Topological sort for DAG
   */
  private topologicalSort(tasks: TaskDefinition[]): string[] {
    const inDegree = new Map<string, number>();
    const graph = new Map<string, string[]>();

    // Initialize
    for (const task of tasks) {
      inDegree.set(task.id, 0);
      graph.set(task.id, []);
    }

    // Build graph
    for (const task of tasks) {
      for (const depId of task.dependsOn) {
        const current = inDegree.get(task.id) || 0;
        inDegree.set(task.id, current + 1);
        const deps = graph.get(depId) || [];
        deps.push(task.id);
        graph.set(depId, deps);
      }
    }

    // Kahn's algorithm
    const queue: string[] = [];
    for (const [id, degree] of inDegree) {
      if (degree === 0) queue.push(id);
    }

    const result: string[] = [];
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      for (const neighbor of graph.get(current) || []) {
        const degree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, degree);
        if (degree === 0) {
          queue.push(neighbor);
        }
      }
    }

    return result;
  }

  /**
   * Determine execution strategy
   */
  private determineStrategy(analyses: TaskAnalysis[]): ExecutionStrategy {
    const hasHighRisk = analyses.some(a => a.riskLevel === "high");
    const hasDependencies = analyses.some(a => a.dependencies.length > 0);
    const cpuTasks = analyses.filter(a => a.task.concurrencyClass === "cpu").length;
    const llmTasks = analyses.filter(a => a.task.concurrencyClass === "llm").length;

    // If high risk or dependencies, use sequential
    if (hasHighRisk || hasDependencies) {
      return "priority-first";
    }

    // If mostly CPU tasks, use parallel
    if (cpuTasks > llmTasks * 2) {
      return "parallel";
    }

    // Default to batch
    return "batch";
  }

  /**
   * Estimate task duration
   */
  private estimateDuration(task: TaskDefinition): number {
    // Base estimates by concurrency class
    const baseEstimates = {
      cpu: 5000,    // 5 seconds
      io: 10000,    // 10 seconds
      llm: 30000    // 30 seconds
    };

    return baseEstimates[task.concurrencyClass] || 10000;
  }

  /**
   * Assess risk level
   */
  private assessRisk(task: TaskDefinition, dependencies: TaskDefinition[]): "low" | "medium" | "high" {
    // High risk if:
    // - No bot available
    // - High token usage
    // - Many dependencies
    const bot = getBotForTask(task);
    if (!bot) return "high";
    
    if (task.estimatedTokens && task.estimatedTokens > 2000) return "high";
    if (dependencies.length > 3) return "medium";
    
    return "low";
  }

  /**
   * Estimate total duration
   */
  private estimateTotalDuration(analyses: TaskAnalysis[], strategy: ExecutionStrategy): number {
    if (strategy === "parallel") {
      // Longest task + overhead
      return Math.max(...analyses.map(a => a.estimatedDuration)) + 5000;
    }

    if (strategy === "sequential") {
      return analyses.reduce((sum, a) => sum + a.estimatedDuration, 0);
    }

    // Batch: assume 3 tasks per batch
    const batchSize = 3;
    const batches = Math.ceil(analyses.length / batchSize);
    const avgBatchDuration = analyses.reduce((sum, a) => sum + a.estimatedDuration, 0) / analyses.length;
    return batches * avgBatchDuration * batchSize;
  }
}


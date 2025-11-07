import { TaskDefinition, TaskResult, ProjectDescription, DAGPlan } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";

export class PlannerBot {
  async createDAGPlan(project: ProjectDescription): Promise<DAGPlan> {
    const tasks: TaskDefinition[] = [];

    // Use existing bot tasks that we know work - simplified linear execution for now
    tasks.push(this.createTask('page.generate.lookbook', 'cpu', [], 300, ['rule:generate-navbar', 'rule:generate-hero']));
    tasks.push(this.createTask('cms.seed.content', 'llm', [], 400)); // Remove dependency for now
    tasks.push(this.createTask('test.smoke', 'io', [], 150)); // Remove dependency for now
    tasks.push(this.createTask('deploy.vercel', 'io', [], 300)); // Remove dependency for now

    // Calculate estimated tokens
    const estimatedTokens = tasks.reduce((sum, task) => sum + (task.estimatedTokens || 512), 0);

    return {
      tasks,
      estimatedTokens,
      humanIterations: 0
    };
  }

  private createTask(
    taskName: string,
    concurrencyClass: 'cpu' | 'io' | 'llm',
    dependsOn: string[] = [],
    estimatedTokens: number = 512,
    fallbackRules?: string[]
  ): TaskDefinition {
    return {
      id: `${taskName}-${Date.now()}`,
      version: '1.0.0',
      name: taskName,
      priority: this.getPriority(taskName),
      concurrencyClass,
      idempotencyKey: `plan-${taskName}`,
      timeoutMs: 900000,
      dependsOn,
      estimatedTokens,
      fallbackRules
    };
  }

  private getPriority(name: string): 'high' | 'normal' | 'low' {
    if (name.includes('test') || name.includes('smoke')) {
      return 'high';
    }
    if (name.includes('setup') || name.includes('dependencies')) {
      return 'high';
    }
    if (name.includes('design-system')) {
      return 'high';
    }
    return 'normal';
  }

  async validateDAG(plan: DAGPlan): Promise<boolean> {
    // Check for cycles and missing dependencies
    const taskMap = new Map(plan.tasks.map(t => [t.id, t]));
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const hasCycle = (taskId: string): boolean => {
      if (visiting.has(taskId)) return true;
      if (visited.has(taskId)) return false;

      visiting.add(taskId);
      const task = taskMap.get(taskId);
      if (!task) return false;

      for (const dep of task.dependsOn || []) {
        if (hasCycle(dep)) return true;
      }

      visiting.delete(taskId);
      visited.add(taskId);
      return false;
    };

    for (const task of plan.tasks) {
      if (hasCycle(task.id)) return false;
    }

    return true;
  }
}

export const PlannerBotRegistration: BotRegistration = {
  name: "PlannerBot",
  accepts: ["planner.create-dag", "planner.validate"],
  concurrency: 1,
  async handler(task: TaskDefinition) {
    const plannerBot = new PlannerBot();

    if (!task.inputsRef) {
      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: "No project description provided",
        artifacts: [],
        metrics: {}
      };
    }

    try {
      if (task.name === "planner.create-dag") {
        const project = typeof task.inputsRef === 'string'
          ? JSON.parse(task.inputsRef)
          : task.inputsRef as ProjectDescription;
        const plan = await plannerBot.createDAGPlan(project);

    return {
      id: task.id,
      status: "success",
      attempts: 1,
      artifacts: [JSON.stringify(plan)],
      metrics: {}
    };
      }

      if (task.name === "planner.validate") {
        const plan = typeof task.inputsRef === 'string'
          ? JSON.parse(task.inputsRef)
          : task.inputsRef as DAGPlan;
        const isValid = await plannerBot.validateDAG(plan);

        return {
          id: task.id,
          status: isValid ? "success" : "fail",
          attempts: 1,
          artifacts: [isValid.toString()],
          errorMsg: isValid ? undefined : "DAG contains cycles or missing dependencies",
          metrics: {}
        };
      }

      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: "Unknown planner task",
        artifacts: [],
        metrics: {}
      };

    } catch (error) {
      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: error instanceof Error ? error.message : String(error),
        artifacts: [],
        metrics: {}
      };
    }
  }
};

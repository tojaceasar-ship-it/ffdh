import { TaskDefinition, TaskResult, ProjectDescription, DAGPlan } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";

export class PlannerBot {
  async createDAGPlan(project: ProjectDescription): Promise<DAGPlan> {
    const tasks: TaskDefinition[] = [];

    // Base infrastructure tasks (no dependencies)
    tasks.push(this.createTask('setup-project-structure', 'cpu', [], 100));
    tasks.push(this.createTask('setup-package-dependencies', 'cpu', [], 50));

    // Design system (depends on project structure)
    if (project.style?.includes('neon') || project.style?.includes('cyberpunk')) {
      tasks.push(this.createTask('create-design-system-neon', 'cpu', ['setup-project-structure'], 200));
    } else {
      tasks.push(this.createTask('create-design-system-standard', 'cpu', ['setup-project-structure'], 150));
    }

    // Core pages (depend on design system)
    tasks.push(this.createTask('generate-homepage', 'cpu', ['create-design-system-neon', 'create-design-system-standard'], 300));
    tasks.push(this.createTask('generate-navbar', 'cpu', ['create-design-system-neon', 'create-design-system-standard'], 100, ['rule:generate-navbar']));
    tasks.push(this.createTask('generate-hero', 'cpu', ['create-design-system-neon', 'create-design-system-standard'], 200, ['rule:generate-hero']));

    // Feature-specific pages
    if (project.requirements?.includes('image-gallery')) {
      tasks.push(this.createTask('generate-gallery-page', 'cpu', ['generate-homepage'], 400));
    }

    if (project.requirements?.includes('contact-form')) {
      tasks.push(this.createTask('generate-contact-page', 'cpu', ['generate-homepage'], 250));
    }

    // Content tasks (can run in parallel with UI generation)
    if (project.description.toLowerCase().includes('streetwear') ||
        project.description.toLowerCase().includes('fashion')) {
      tasks.push(this.createTask('generate-streetwear-content', 'llm', ['setup-project-structure'], 400));
    }

    // Testing tasks (depend on all generation)
    const generationTasks = tasks.filter(t => t.name.includes('generate')).map(t => t.id);
    tasks.push(this.createTask('run-unit-tests', 'cpu', generationTasks, 200));
    tasks.push(this.createTask('run-integration-tests', 'cpu', ['run-unit-tests'], 300));
    tasks.push(this.createTask('run-smoke-tests', 'io', ['run-integration-tests'], 150));

    // Calculate estimated tokens
    const estimatedTokens = tasks.reduce((sum, task) => sum + (task.estimatedTokens || 512), 0);

    return {
      tasks,
      estimatedTokens,
      humanIterations: 0
    };
  }

  private createTask(
    name: string,
    concurrencyClass: 'cpu' | 'io' | 'llm',
    dependsOn: string[] = [],
    estimatedTokens: number = 512,
    fallbackRules?: string[]
  ): TaskDefinition {
    return {
      id: `${name}-${Date.now()}`,
      version: '1.0.0',
      name: `plan.${name}`,
      priority: this.getPriority(name),
      concurrencyClass,
      idempotencyKey: `plan-${name}`,
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

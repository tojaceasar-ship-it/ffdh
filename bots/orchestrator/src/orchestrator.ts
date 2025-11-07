import { taskQueue } from "./task-queue.js";
import { withIdempotency } from "./task-adapter.js";
import { executeTask, registerBot } from "./bot-manager.js";
import { markQueued, markRunning, markDone, snapshot } from "./progress-tracker.js";
import { getKnowledgeAPI } from "../../knowledge-base/src/knowledge-loader.js";
import { TaskDefinition, TaskResult } from "../../../shared/types/task.js";

// 1) Rejestruj boty dostępne w systemie (na start: CodeBot)
import { CodeBot } from "../../code-bot/src/index.js";
import { ContentBot } from "../../content-bot/src/index.js";
import { TestBot } from "../../test-bot/src/index.js";
import { DeployBot } from "../../deploy-bot/src/index.js";

// Smart Build Mode imports - synchronous registration
import { IntakeBotRegistration } from "../../intake-bot/src/index.js";
import { ClarifyBotRegistration } from "../../clarify-bot/src/index.js";
import { PlannerBotRegistration } from "../../planner-bot/src/index.js";
import { ArchitectBotRegistration } from "../../architect-bot/src/index.js";
import { BudgetManagerBot } from "../../budget-manager/src/index.js";
import { FallbackEngineBot } from "../../fallback-engine/src/index.js";
import { ReviewBotRegistration } from "../../review-bot/src/index.js";
import { ReportBotRegistration } from "../../report-bot/src/index.js";

// Register all bots at module load time
registerBot(IntakeBotRegistration);
registerBot(ClarifyBotRegistration);
registerBot(PlannerBotRegistration);
registerBot(ArchitectBotRegistration);
registerBot(BudgetManagerBot);
registerBot(FallbackEngineBot);
registerBot(ReviewBotRegistration);
registerBot(ReportBotRegistration);

// Register legacy bots for execution
registerBot(CodeBot);
registerBot(ContentBot);
registerBot(TestBot);
registerBot(DeployBot);

export class Orchestrator {
  private kb = getKnowledgeAPI();

  async plan(): Promise<TaskDefinition[]> {
    const kb = await this.kb.load();
    const req = this.kb.getRequirements() || {};

    const tasks: TaskDefinition[] = [
      {
        id: "page-lookbook",
        version: "1.0.0",
        name: "page.generate.lookbook",
        priority: "normal",
        concurrencyClass: "cpu",
        timeoutMs: 120000,
        idempotencyKey: "",
        inputsRef: "kb://content-specs/lookbook"
      },
      {
        id: "content-seed",
        version: "1.0.0",
        name: "cms.seed.content",
        priority: "low",
        concurrencyClass: "llm",
        timeoutMs: 180000,
        idempotencyKey: "",
        inputsRef: "kb://content-specs/seed"
      },
      {
        id: "smoke",
        version: "1.0.0",
        name: "test.smoke",
        priority: "high",
        concurrencyClass: "io",
        timeoutMs: 180000,
        idempotencyKey: ""
      },
      {
        id: "deploy",
        version: "1.0.0",
        name: "deploy.vercel",
        priority: "high",
        concurrencyClass: "io",
        timeoutMs: 300000,
        idempotencyKey: ""
      }
    ];

    return tasks.map(withIdempotency);
  }

  async start() {
    // 0) Rejestr botów (Legacy Mode)
    registerBot(CodeBot);
    registerBot(ContentBot);
    registerBot(TestBot);
    registerBot(DeployBot);

    // 1) Załaduj KB
    await this.kb.load();

    // 2) Zbuduj plan
    const tasks = await this.plan();

    // 3) Kolejkuj i uruchamiaj
    for (const task of tasks) {
      markQueued(task.id, task.name);
      await taskQueue.enqueue(task, async (t) => {
        try {
          markRunning(t.id);
          const result: TaskResult = await executeTask(t);
          const ok = result.status === "success";
          markDone(t.id, ok, result.errorMsg);
          return result;
        } catch (e: any) {
          markDone(t.id, false, e?.message ?? String(e));
          return {
            id: t.id,
            status: "fail",
            attempts: 1,
            errorCode: "UNCAUGHT",
            errorMsg: e?.message ?? String(e),
            artifacts: [],
            metrics: {}
          };
        }
      });
    }

    // 4) Prosty monitoring (lokalnie)
    // Wait a bit for tasks to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    const view = snapshot();
    console.table(view.map(e => ({
      id: e.id,
      name: e.name,
      state: e.state,
      ms: e.endedAt && e.startedAt ? (e.endedAt - e.startedAt) : "-"
    })));
  }
}

// Smart Build Mode Orchestrator
export class SmartOrchestrator {
  private sessionId: string;
  private budgetManager: any;
  private fallbackEngine: any;

  constructor(sessionId?: string) {
    this.sessionId = sessionId || `smart-${Date.now()}`;
    this.initAsync();
  }

  private async initAsync() {
    const budgetModule = await import("../../budget-manager/src/index.js");
    const fallbackModule = await import("../../fallback-engine/src/index.js");

    this.budgetManager = new budgetModule.BudgetManager(this.sessionId);
    this.fallbackEngine = new fallbackModule.FallbackEngine();
  }

  async processSmartBuild(description: string) {
    console.log('🚀 Starting Smart Build Mode...');

    // Phase 1: Intake
    console.log('📥 Phase 1: Intake...');
    const projectDesc = await this.processIntake(description);

    // Phase 2: Clarify
    console.log('❓ Phase 2: Clarify...');
    const needsClarification = await this.checkClarification(projectDesc);
    if (needsClarification) {
      console.log('❓ Clarification needed. Waiting for user input...');
      return { status: 'needs_clarification', project: projectDesc };
    }

    // Phase 3: Architect
    console.log('🏗️ Phase 3: Design Architecture...');
    await this.designArchitecture(projectDesc);

    // Phase 4: Plan DAG
    console.log('📋 Phase 4: Plan DAG...');
    const dagPlan = await this.createDAGPlan(projectDesc);

    // Phase 5: Execute with budget control
    console.log('⚙️ Phase 5: Execute with budget control...');
    const result = await this.executeWithBudgetControl(dagPlan);

    // Phase 6: Review
    console.log('👁️ Phase 6: Local Review...');
    const reviewResult = await this.performReview(result.sessionId);

    // Phase 7: Report
    console.log('📊 Phase 7: Generate Report...');
    await this.generateReport(result.sessionId, result.results);

    return {
      ...result,
      reviewDecision: reviewResult
    };

    return result;
  }

  private async processIntake(description: string) {

    const intakeTask: TaskDefinition = {
      id: `intake-${Date.now()}`,
      version: '1.0.0',
      name: 'intake.process',
      priority: 'high',
      concurrencyClass: 'cpu',
      idempotencyKey: `intake-${this.sessionId}`,
      inputsRef: description
    };

    const result = await this.executeSingleTask(intakeTask);
    if (result.status !== 'success') {
      throw new Error('Intake processing failed');
    }

    // Load processed project description
    const fs = await import('fs-extra');
    const sessionFile = `.ffdh/sessions/${intakeTask.idempotencyKey}.json`;
    return await fs.default.readJson(sessionFile);
  }

  private async checkClarification(project: any) {

    const clarifyTask: TaskDefinition = {
      id: `clarify-${Date.now()}`,
      version: '1.0.0',
      name: 'clarify.needs',
      priority: 'high',
      concurrencyClass: 'cpu',
      idempotencyKey: `clarify-${this.sessionId}`,
      inputsRef: JSON.stringify(project)
    };

    const result = await this.executeSingleTask(clarifyTask);
    return result.status === 'success' && result.artifacts[0] === true;
  }

  private async createDAGPlan(project: any) {

    const planTask: TaskDefinition = {
      id: `plan-${Date.now()}`,
      version: '1.0.0',
      name: 'planner.create-dag',
      priority: 'high',
      concurrencyClass: 'cpu',
      idempotencyKey: `plan-${this.sessionId}`,
      inputsRef: JSON.stringify(project)
    };

    const result = await this.executeSingleTask(planTask);
    if (result.status !== 'success') {
      throw new Error('DAG planning failed');
    }

    return typeof result.artifacts[0] === 'string'
      ? JSON.parse(result.artifacts[0])
      : result.artifacts[0];
  }

  private async executeWithBudgetControl(dagPlan: any) {
    // All bots are already registered globally

    // Execute DAG respecting dependencies and budget
    const results = [];
    const completed = new Set<string>();

    while (completed.size < dagPlan.tasks.length) {
      // Find tasks ready to execute (all dependencies completed)
      const readyTasks = dagPlan.tasks.filter((task: any) =>
        !completed.has(task.id) &&
        task.dependsOn.every((dep: string) => completed.has(dep))
      );

      if (readyTasks.length === 0) {
        throw new Error('No tasks ready to execute - possible circular dependency');
      }

      // Execute ready tasks respecting budget
      for (const task of readyTasks) {
        // Check budget
        const hasBudget = await this.budgetManager.checkTokens(task);
        if (!hasBudget) {
          console.warn('⚠️ Budget exceeded for task:', task.name);
          // Try fallback if available
          const shouldUseFallback = await this.budgetManager.shouldUseFallback(task);
          if (shouldUseFallback && this.fallbackEngine.hasRule(task.name.replace('plan.', 'rule:'))) {
            console.log('🔧 Using fallback for:', task.name);
            task.fallbackRules = [task.name.replace('plan.', 'rule:')];
          } else {
            throw new Error(`Budget exceeded and no fallback available for: ${task.name}`);
          }
        }

        const result = await this.executeSingleTask(task);
        results.push(result);

        if (result.status === 'success') {
          completed.add(task.id);
          await this.budgetManager.recordUsage(task, result.metrics?.tokensOut || task.estimatedTokens || 512);
        } else {
          throw new Error(`Task failed: ${task.name} - ${result.errorMsg}`);
        }
      }
    }

    return {
      status: 'completed',
      sessionId: this.sessionId,
      results,
      budgetUsed: await this.budgetManager.getSessionUsage()
    };
  }

  private async executeSingleTask(task: TaskDefinition): Promise<TaskResult> {
    return new Promise((resolve, reject) => {
      taskQueue.enqueue(task, async (t) => {
        try {
          return await executeTask(t);
        } catch (error) {
          reject(error);
        }
      }).then(resolve).catch(reject);
    });
  }

  private async designArchitecture(project: any) {

    const architectTask: TaskDefinition = {
      id: `architect-${Date.now()}`,
      version: '1.0.0',
      name: 'architect.design',
      priority: 'high',
      concurrencyClass: 'cpu',
      idempotencyKey: `architect-${this.sessionId}`,
      inputsRef: JSON.stringify(project)
    };

    const result = await this.executeSingleTask(architectTask);
    if (result.status !== 'success') {
      throw new Error('Architecture design failed');
    }

    return result.artifacts[0];
  }

  private async performReview(sessionId: string) {

    // Start review
    const startTask: TaskDefinition = {
      id: `review-start-${Date.now()}`,
      version: '1.0.0',
      name: 'review.start',
      priority: 'high',
      concurrencyClass: 'io',
      idempotencyKey: `review-start-${sessionId}`,
      inputsRef: sessionId
    };

    await this.executeSingleTask(startTask);

    // Wait for review completion (simplified - in real implementation would be interactive)
    const waitTask: TaskDefinition = {
      id: `review-wait-${Date.now()}`,
      version: '1.0.0',
      name: 'review.wait',
      priority: 'high',
      concurrencyClass: 'io',
      idempotencyKey: `review-wait-${sessionId}`,
      inputsRef: sessionId,
      timeoutMs: 60000 // 1 minute for demo
    };

    const reviewResult = await this.executeSingleTask(waitTask);

    // Stop review
    const stopTask: TaskDefinition = {
      id: `review-stop-${Date.now()}`,
      version: '1.0.0',
      name: 'review.stop',
      priority: 'normal',
      concurrencyClass: 'io',
      idempotencyKey: `review-stop-${sessionId}`,
      inputsRef: sessionId
    };

    await this.executeSingleTask(stopTask);

    return reviewResult;
  }

  private async generateReport(sessionId: string, results: any[]) {

    const reportTask: TaskDefinition = {
      id: `report-${Date.now()}`,
      version: '1.0.0',
      name: 'report.generate-session',
      priority: 'normal',
      concurrencyClass: 'cpu',
      idempotencyKey: `report-${sessionId}`,
      inputsRef: JSON.stringify({ sessionId, results })
    };

    const result = await this.executeSingleTask(reportTask);
    if (result.status !== 'success') {
      console.warn('Report generation failed, but continuing...');
    }

    return result;
  }
}


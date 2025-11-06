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
    // 0) Rejestr botów
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


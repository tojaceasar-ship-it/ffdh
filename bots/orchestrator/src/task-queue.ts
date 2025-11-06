import os from "os";
import { TaskDefinition, TaskResult } from "../../../shared/types/task.js";
import { makeIdempotencyKey } from "../../../shared/utils/idempotency.js";
import { acquireLock } from "../../../shared/utils/locks.js";

const MAX_CPU = Math.max((os.cpus().length - 2) || 1, 1);
const MAX_IO = 2 * MAX_CPU;

interface QueueItem {
  task: TaskDefinition;
  resolve: (result: TaskResult) => void;
  reject: (error: Error) => void;
  handler?: (task: TaskDefinition) => Promise<TaskResult>;
}

class TaskQueue {
  private queues: {
    high: QueueItem[];
    normal: QueueItem[];
    low: QueueItem[];
  } = {
    high: [],
    normal: [],
    low: [],
  };

  private running: Map<string, TaskResult> = new Map();
  private concurrency: {
    cpu: number;
    io: number;
    llm: number;
  } = {
    cpu: 0,
    io: 0,
    llm: 0,
  };

  async enqueue(
    task: TaskDefinition,
    handler?: (task: TaskDefinition) => Promise<TaskResult>
  ): Promise<TaskResult> {
    // Validate task
    const validated = TaskDefinition.parse(task);

    // Generate idempotency key if not provided
    if (!validated.idempotencyKey) {
      validated.idempotencyKey = makeIdempotencyKey(
        validated.name,
        validated.version,
        validated.inputsRef
      );
    }

    // Check if already running
    if (this.running.has(validated.idempotencyKey)) {
      return this.running.get(validated.idempotencyKey)!;
    }

    return new Promise((resolve, reject) => {
      const item: QueueItem = {
        task: validated,
        resolve,
        reject,
        handler,
      };

      // Add to appropriate queue
      if (validated.priority === "high") {
        this.queues.high.push(item);
      } else if (validated.priority === "low") {
        this.queues.low.push(item);
      } else {
        this.queues.normal.push(item);
      }

      this.process();
    });
  }

  private async process() {
    // Process high priority first
    for (const priority of ["high", "normal", "low"] as const) {
      while (this.queues[priority].length > 0) {
        const item = this.queues[priority].shift()!;
        const { task } = item;

        // Check concurrency limits
        const maxConcurrency = this.getMaxConcurrency(task.concurrencyClass);
        const current = this.concurrency[task.concurrencyClass];

        if (current >= maxConcurrency) {
          // Put back and wait
          this.queues[priority].unshift(item);
          break;
        }

        // Execute task (async, don't await)
        this.executeTask(item).catch((err) => {
          item.reject(err);
        });
      }
    }
  }

  private getMaxConcurrency(concurrencyClass: "cpu" | "io" | "llm"): number {
    if (concurrencyClass === "cpu") return MAX_CPU;
    return MAX_IO;
  }

  private async executeTask(item: QueueItem) {
    const { task, resolve, reject, handler } = item;

    // Acquire lock
    let lock;
    try {
      lock = await acquireLock(task.idempotencyKey, 300); // 5 min TTL
    } catch (error) {
      reject(new Error("Task already running (locked)"));
      return;
    }

    // Update concurrency
    this.concurrency[task.concurrencyClass]++;

    const result: TaskResult = {
      id: task.id,
      status: "running",
      startedAt: new Date().toISOString(),
      attempts: 0,
      artifacts: [],
      metrics: {},
    };

    this.running.set(task.idempotencyKey, result);

    try {
      // Execute handler if provided, otherwise simulate
      if (handler) {
        const handlerResult = await handler(task);
        result.status = handlerResult.status;
        result.endedAt = handlerResult.endedAt || new Date().toISOString();
        result.artifacts = handlerResult.artifacts || [];
        result.errorMsg = handlerResult.errorMsg;
        result.metrics = handlerResult.metrics || {};
        result.metrics.durationMs = Date.now() - new Date(result.startedAt!).getTime();
      } else {
        // Fallback: simulate
        await new Promise((resolve) => setTimeout(resolve, 100));
        result.status = "success";
        result.endedAt = new Date().toISOString();
        result.metrics = {
          durationMs: Date.now() - new Date(result.startedAt!).getTime(),
          cacheHit: false,
        };
      }

      resolve(result);
    } catch (error) {
      result.status = "fail";
      result.endedAt = new Date().toISOString();
      result.errorMsg = error instanceof Error ? error.message : "Unknown error";
      reject(error as Error);
    } finally {
      this.concurrency[task.concurrencyClass]--;
      this.running.delete(task.idempotencyKey);
      await lock.release();
    }
  }
}

export const taskQueue = new TaskQueue();


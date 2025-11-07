import { TaskDefinition, TaskResult } from "../../../shared/types/task.js";
declare class TaskQueue {
    private queues;
    private running;
    private concurrency;
    enqueue(task: TaskDefinition, handler?: (task: TaskDefinition) => Promise<TaskResult>): Promise<TaskResult>;
    private process;
    private getMaxConcurrency;
    private executeTask;
}
export declare const taskQueue: TaskQueue;
export {};
//# sourceMappingURL=task-queue.d.ts.map
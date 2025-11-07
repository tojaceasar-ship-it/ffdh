import { SupervisorAgent } from "../src/index.js";
import { TaskDefinition, DAGPlan } from "../../../../shared/types/task.js";

describe("SupervisorAgent", () => {
  let supervisor: SupervisorAgent;

  beforeEach(() => {
    supervisor = new SupervisorAgent("test-session");
  });

  test("should create instance with session ID", () => {
    expect(supervisor.getSessionId()).toBe("test-session");
  });

  test("should plan execution for DAG", async () => {
    const dagPlan: DAGPlan = {
      tasks: [
        {
          id: "task-1",
          version: "1.0.0",
          name: "test.task",
          priority: "normal",
          concurrencyClass: "cpu",
          idempotencyKey: "key-1",
          dependsOn: [],
          estimatedTokens: 100
        },
        {
          id: "task-2",
          version: "1.0.0",
          name: "test.task2",
          priority: "high",
          concurrencyClass: "io",
          idempotencyKey: "key-2",
          dependsOn: ["task-1"],
          estimatedTokens: 200
        }
      ],
      estimatedTokens: 300,
      humanIterations: 0
    };

    const plan = await supervisor.plan(dagPlan);

    expect(plan.tasks).toHaveLength(2);
    expect(plan.executionOrder).toContain("task-1");
    expect(plan.executionOrder).toContain("task-2");
    expect(plan.executionOrder[0]).toBe("task-1"); // task-1 should come first
  });

  test("should track running tasks", () => {
    const running = supervisor.getRunningTasks();
    expect(running).toBeInstanceOf(Map);
    expect(running.size).toBe(0);
  });
});


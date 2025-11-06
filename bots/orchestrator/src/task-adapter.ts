import { makeIdempotencyKey } from "../../../shared/utils/idempotency.js";
import type { TaskDefinition } from "../../../shared/types/task.js";

export function withIdempotency(task: TaskDefinition): TaskDefinition {
  const key = task.idempotencyKey && task.idempotencyKey.length > 0
    ? task.idempotencyKey
    : makeIdempotencyKey(task.name, task.version, { inputsRef: task.inputsRef });
  return { ...task, idempotencyKey: key };
}


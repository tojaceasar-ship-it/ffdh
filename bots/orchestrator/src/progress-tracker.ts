type State = "queued" | "running" | "success" | "fail";

interface Entry {
  id: string;
  name: string;
  state: State;
  startedAt?: number;
  endedAt?: number;
  errorMsg?: string;
}

const table = new Map<string, Entry>();

export function markQueued(id: string, name: string) {
  table.set(id, { id, name, state: "queued" });
}

export function markRunning(id: string) {
  const e = table.get(id);
  if (!e) return;
  e.state = "running";
  e.startedAt = Date.now();
}

export function markDone(id: string, ok: boolean, errorMsg?: string) {
  const e = table.get(id);
  if (!e) return;
  e.state = ok ? "success" : "fail";
  e.endedAt = Date.now();
  e.errorMsg = errorMsg;
}

export function snapshot() {
  return Array.from(table.values());
}

